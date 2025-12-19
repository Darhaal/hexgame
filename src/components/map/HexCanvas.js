"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { createCamera, resetCamera, initCameraEvents, resizeCanvas, clampCamera } from "../../engine/camera";
import { drawScene } from "../../engine/draw/drawScene";
import mapData from "../../data/mapData";
import { axialToPixel } from "../../engine/hex/hexUtils";
import { initAssets } from "../../engine/assets/AssetLoader";

function useCanvasDrawLoop(performDraw) {
    const requestRef = useRef();
    const drawRef = useRef(performDraw);
    useEffect(() => { drawRef.current = performDraw; }, [performDraw]);
    useEffect(() => {
        const animate = () => {
            if (drawRef.current) drawRef.current();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
}

export default function HexCanvas({ playerPosRef, reachableRef, path, onTileClicked, gameTime }) {
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const TILE_SIZE = 100;

  // 1. Загрузка ассетов при маунте
  useEffect(() => {
      initAssets().then(() => {
          setAssetsLoaded(true);
      });
  }, []);

  const ensureCanvasSize = (canvas, camera) => {
    const cssW = Math.floor(canvas.clientWidth || window.innerWidth);
    const cssH = Math.floor(canvas.clientHeight || window.innerHeight);
    if (canvas.width !== cssW || canvas.height !== cssH) {
      resizeCanvas(canvas);
      if (camera) clampCamera(camera, canvas);
      return true;
    }
    return false;
  };

  const performDraw = useCallback(() => {
    if (!assetsLoaded) return; // Не рисуем, пока не загрузились
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera) return;

    ensureCanvasSize(canvas, camera);
    drawScene({
      canvas,
      camera,
      mapData,
      playerPos: playerPosRef.current,
      reachableMap: reachableRef.current,
      path: path,
      tileSize: TILE_SIZE,
      gameTime: gameTime
    });
  }, [playerPosRef, reachableRef, path, TILE_SIZE, gameTime, assetsLoaded]);

  // Запускаем цикл отрисовки
  useCanvasDrawLoop(performDraw);

  // Инициализация камеры и событий (только когда канвас готов)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!cameraRef.current) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

      // Увеличиваем маржин, чтобы учесть декоративные рамки (drawBorder)
      const BOUNDS_MARGIN = TILE_SIZE * 3;

      for (const t of mapData) {
        const p = axialToPixel(t.q, t.r, TILE_SIZE);
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      }

      // Применяем маржин к границам
      const bounds = {
          minX: minX - BOUNDS_MARGIN,
          maxX: maxX + BOUNDS_MARGIN,
          minY: minY - BOUNDS_MARGIN,
          maxY: maxY + BOUNDS_MARGIN
      };

      cameraRef.current = createCamera(bounds, TILE_SIZE);
      resetCamera(cameraRef.current, canvas);
    }

    const cleanupCameraEvents = initCameraEvents(canvas, cameraRef.current, performDraw);

    const onClick = (e) => {
      const camera = cameraRef.current;
      // Если драгали карту - это не клик по тайлу
      if (camera.hasMoved) {
        camera.hasMoved = false;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const worldX = (mx - camera.offsetX) / camera.scale;
      const worldY = (my - camera.offsetY) / camera.scale;

      let best = null;
      let bestDist = Infinity;

      for (const t of mapData) {
        const p = axialToPixel(t.q, t.r, TILE_SIZE);
        const d = Math.hypot(p.x - worldX, p.y - worldY);
        // Проверка радиуса клика (чуть меньше размера тайла)
        if (d < TILE_SIZE * 0.9 && d < bestDist) {
            bestDist = d;
            best = t;
        }
      }
      onTileClicked(best, e.shiftKey);
    };

    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", performDraw);

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", performDraw);
      if (cleanupCameraEvents) cleanupCameraEvents();
    };
  }, [onTileClicked, performDraw]);

  if (!assetsLoaded) {
      return (
          <div style={{
              width: "100vw", height: "100vh", background: "#ffffff", color: "#333",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "monospace"
          }}>
              LOADING ASSETS...
          </div>
      );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        touchAction: "none",
        background: "#ffffff", // Белый фон для канваса тоже
      }}
    />
  );
}