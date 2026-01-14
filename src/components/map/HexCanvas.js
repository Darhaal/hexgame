"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { createCamera, resetCamera, initCameraEvents, resizeCanvas, clampCamera } from "../../engine/camera";
import { drawScene } from "../../engine/draw/drawScene";
import mapData from "../../data/mapData";
import { axialToPixel } from "../../engine/hex/hexUtils";
import { initAssets } from "../../engine/assets/AssetLoader";
import { useGame } from "../../context/GameContext";

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

  const { isLocationOpen } = useGame();

  useEffect(() => {
      initAssets().then(() => {
          setAssetsLoaded(true);
      });
  }, []);

  // --- ВАЖНО: Используем ref для функции отрисовки ---
  // Это позволяет не пересоздавать обработчики событий камеры при изменении пропсов (времени, позиции)
  const performDrawCallback = useCallback(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera) return;

    // Ресайз внутри drawloop, если нужно
    const cssW = Math.floor(canvas.clientWidth || window.innerWidth);
    const cssH = Math.floor(canvas.clientHeight || window.innerHeight);
    if (canvas.width !== cssW || canvas.height !== cssH) {
      resizeCanvas(canvas);
      clampCamera(camera, canvas);
    }

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

  // Сохраняем актуальную функцию в ref
  const performDrawRef = useRef(performDrawCallback);
  useEffect(() => { performDrawRef.current = performDrawCallback; }, [performDrawCallback]);

  // Запуск лупа
  useCanvasDrawLoop(performDrawCallback);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!cameraRef.current) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const BOUNDS_MARGIN = TILE_SIZE * 3;

      for (const t of mapData) {
        const p = axialToPixel(t.q, t.r, TILE_SIZE);
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      }

      const bounds = {
          minX: minX - BOUNDS_MARGIN,
          maxX: maxX + BOUNDS_MARGIN,
          minY: minY - BOUNDS_MARGIN,
          maxY: maxY + BOUNDS_MARGIN
      };

      cameraRef.current = createCamera(bounds, TILE_SIZE);
      resetCamera(cameraRef.current, canvas);
    }

    // Обновляем флаг блокировки ввода
    if (cameraRef.current) {
        cameraRef.current.disableInput = isLocationOpen;
    }

    // Прокси для вызова отрисовки из событий камеры
    const drawProxy = () => {
        if (performDrawRef.current) performDrawRef.current();
    };

    // Инициализируем события ТОЛЬКО при изменении флага isLocationOpen
    // (или при первом маунте), но НЕ при каждом тике таймера.
    const cleanupCameraEvents = initCameraEvents(canvas, cameraRef.current, drawProxy, isLocationOpen);

    const onClick = (e) => {
      const camera = cameraRef.current;
      if (camera.hasMoved) {
        camera.hasMoved = false;
        return;
      }
      if (camera.disableInput) return;

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
        if (d < TILE_SIZE * 0.9 && d < bestDist) {
            bestDist = d;
            best = t;
        }
      }
      onTileClicked(best, e.shiftKey);
    };

    canvas.addEventListener("click", onClick);
    // Ресайз обрабатывается внутри drawLoop/initCameraEvents, но добавим для надежности
    // window.addEventListener("resize", drawProxy);

    return () => {
      canvas.removeEventListener("click", onClick);
      // window.removeEventListener("resize", drawProxy);
      if (cleanupCameraEvents) cleanupCameraEvents();
    };
  }, [onTileClicked, isLocationOpen]); // Убрали зависимости gameTime/path/performDrawCallback

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
        background: "#ffffff",
      }}
    />
  );
}