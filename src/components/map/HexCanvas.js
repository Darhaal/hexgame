// src/components/map/HexCanvas.jsx
"use client";

import { useRef, useEffect } from "react";
// Добавляем clampCamera и resizeCanvas в импорт
import { createCamera, resetCamera, initCameraEvents, resizeCanvas, clampCamera } from "../../engine/camera";
import { drawScene } from "../../engine/draw/drawScene";
import mapData from "../../data/mapData";

export default function HexCanvas({ playerPosRef, reachableRef, onTileClicked }) {
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  // Функция для проверки размера окна без сброса камеры
  function ensureCanvasSize(canvas, camera) {
    const cssW = Math.floor(canvas.clientWidth || window.innerWidth);
    const cssH = Math.floor(canvas.clientHeight || window.innerHeight);
    if (canvas.width !== cssW || canvas.height !== cssH) {
      resizeCanvas(canvas);
      clampCamera(camera, canvas);
      return true;
    }
    return false;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Создаем камеру ТОЛЬКО один раз
    if (!cameraRef.current) {
      function computeBounds() {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        const { axialToPixel } = require("../../engine/hex/hexUtils");
        const TILE_SIZE = 100;
        for (const t of mapData) {
          const p = axialToPixel(t.q, t.r, TILE_SIZE);
          minX = Math.min(minX, p.x - TILE_SIZE);
          maxX = Math.max(maxX, p.x + TILE_SIZE);
          minY = Math.min(minY, p.y - TILE_SIZE);
          maxY = Math.max(maxY, p.y + TILE_SIZE);
        }
        return { minX, maxX, minY, maxY };
      }

      const bounds = computeBounds();
      cameraRef.current = createCamera(bounds, 100);
      resetCamera(cameraRef.current, canvas); // Центрируем только при старте
    }

    const draw = () => {
      ensureCanvasSize(canvas, cameraRef.current);
      drawScene({
        canvas,
        camera: cameraRef.current,
        mapData,
        playerPos: playerPosRef.current,
        reachableMap: reachableRef.current,
      });
    };

    draw();

    const cleanupEvents = initCameraEvents(canvas, cameraRef.current, draw);

    function onClick(e) {
      const camera = cameraRef.current;

      // --- ИСПРАВЛЕНИЕ БАГА №1 ---
      // Если мы тащили карту (hasMoved === true), то это не клик по клетке.
      if (camera.hasMoved) {
        camera.hasMoved = false; // Сбрасываем флаг и выходим
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const worldX = (mx - camera.offsetX) / camera.scale;
      const worldY = (my - camera.offsetY) / camera.scale;

      const { axialToPixel } = require("../../engine/hex/hexUtils");
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
    }

    canvas.addEventListener("click", onClick);

    // Resize теперь просто перерисовывает, логика внутри ensureCanvasSize
    const onWindowResize = () => {
       ensureCanvasSize(canvas, cameraRef.current);
       draw();
    };
    window.addEventListener("resize", onWindowResize);

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", onWindowResize);
      if (cleanupEvents) cleanupEvents();
    };
  }, [playerPosRef, reachableRef, onTileClicked]);

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