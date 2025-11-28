"use client";

import { useRef, useEffect, useCallback } from "react";
import { createCamera, resetCamera, initCameraEvents, resizeCanvas, clampCamera } from "../../engine/camera";
import { drawScene } from "../../engine/draw/drawScene";
import mapData from "../../data/mapData";
import { axialToPixel } from "../../engine/hex/hexUtils"; // Импортируем утилиту

export default function HexCanvas({ playerPosRef, reachableRef, onTileClicked, tick }) {
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  // Функция для проверки размера окна
  const ensureCanvasSize = (canvas, camera) => {
    const cssW = Math.floor(canvas.clientWidth || window.innerWidth);
    const cssH = Math.floor(canvas.clientHeight || window.innerHeight);
    if (canvas.width !== cssW || canvas.height !== cssH) {
      resizeCanvas(canvas);
      clampCamera(camera, canvas);
      return true;
    }
    return false;
  };

  // Функция отрисовки (стабильная ссылка)
  const performDraw = useCallback(() => {
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
    });
  }, [playerPosRef, reachableRef]); // Зависимости стабильны (refs)

  // 1. Инициализация камеры и событий (Запускается один раз)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Создаем камеру
    if (!cameraRef.current) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      const TILE_SIZE = 100;
      for (const t of mapData) {
        const p = axialToPixel(t.q, t.r, TILE_SIZE);
        minX = Math.min(minX, p.x - TILE_SIZE);
        maxX = Math.max(maxX, p.x + TILE_SIZE);
        minY = Math.min(minY, p.y - TILE_SIZE);
        maxY = Math.max(maxY, p.y + TILE_SIZE);
      }
      const bounds = { minX, maxX, minY, maxY };
      cameraRef.current = createCamera(bounds, 100);
      resetCamera(cameraRef.current, canvas);
    }

    // Первый кадр
    performDraw();

    // Подключаем события камеры (драг, зум)
    // Передаем performDraw, чтобы камера могла перерисовывать при движении
    const cleanupCameraEvents = initCameraEvents(canvas, cameraRef.current, performDraw);

    // Обработчик клика
    const onClick = (e) => {
      const camera = cameraRef.current;
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
        const p = axialToPixel(t.q, t.r, 100);
        const d = Math.hypot(p.x - worldX, p.y - worldY);
        if (d < bestDist) {
          bestDist = d;
          best = t;
        }
      }
      onTileClicked(best);
    };

    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", performDraw);

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", performDraw);
      if (cleanupCameraEvents) cleanupCameraEvents();
    };
  }, [onTileClicked, performDraw]);

  // 2. Игровой цикл (Запускается каждый кадр при изменении tick)
  useEffect(() => {
    performDraw();
  }, [tick, performDraw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100vw",
        height: "100vh",
        display: "block",
        touchAction: "none",
        background: "#000",
      }}
    />
  );
}