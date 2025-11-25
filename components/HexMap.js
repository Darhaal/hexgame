// HexMap.js
// Full version using mapData and drawing labels.
// Your engine stays the same; now tiles come from mapData and names are shown.
import DevConsole from "./DevConsole.js";
import {
  createCamera,
  resizeCanvas,
  computeMinScale,
  centerCamera,
  clampCamera,
  initCameraEvents
} from "./camera.js";

import { useEffect, useRef } from "react";
import mapData from "./mapData.js";
import {
  computeReachable,
  applyMove,
  loadPlayerState,
  savePlayerState,
  START_STEPS,
  BLOCKED,
  setVehicle,
  VEHICLES
} from "./playerEngine.js";
import { drawReachable } from "./drawReachable.js";
import { drawPlayer } from "./drawPlayer.js";
import { axialToPixel } from "./hexUtils.js";
import { drawHex } from "./drawHex.js";
import { drawBorder } from "./drawBorder.js";

/* -----------------------------------------
   Config
----------------------------------------- */
const TILE_SIZE = 100;
const OUTER_PLACEHOLDER_URL =
  "/mnt/data/a86f7d89-7774-439b-9301-c5002747585a.png";

/* -----------------------------------------
   Bounds from mapData
----------------------------------------- */
function computeMapBounds(tiles, size = TILE_SIZE) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const t of tiles) {
    const p = axialToPixel(t.q, t.r, size);
    minX = Math.min(minX, p.x - size);
    maxX = Math.max(maxX, p.x + size);
    minY = Math.min(minY, p.y - size);
    maxY = Math.max(maxY, p.y + size);
  }

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export default function HexMap() {
  const canvasRef = useRef(null);
  const tilesRef = useRef(mapData); // <-- use your real manual map
  const boundsRef = useRef(null);

  const view = useRef({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    dragStartX: 0,
    dragStartY: 0,
  });
const { pos: initialPos, steps: initialSteps } = loadPlayerState();

const playerPosRef = useRef(initialPos);
const playerStepsRef = useRef(initialSteps);

const reachableRef = useRef(
  computeReachable(playerPosRef.current, playerStepsRef.current)
);

    function findNearestTileByPixel(x, y) {
        let best = null;
        let bestDist = Infinity;
        for (const t of mapData) {
          const p = axialToPixel(t.q, t.r, TILE_SIZE);
          const d = Math.hypot(p.x - x, p.y - y);
          if (d < bestDist) {
            bestDist = d;
            best = t;
          }
        }
        return best;
      }

    function handleTileClick(worldX, worldY) {
      const tile = findNearestTileByPixel(worldX, worldY);
      if (!tile) return;

      // 🚫 Явная блокировка воды / рек
      if (BLOCKED.has(tile.type)) {
        return; // можно всплывашку сделать позже
      }

      const key = `${tile.q},${tile.r}`;

      if (!reachableRef.current.has(key)) return;

      const move = applyMove(
        playerPosRef.current,
        tile,
        reachableRef.current,
        playerStepsRef.current
      );
      if (!move) return;

      playerPosRef.current = move.newPos;
      playerStepsRef.current = move.newSteps;

      savePlayerState(move.newPos, move.newSteps);

      reachableRef.current = computeReachable(
        move.newPos,
        move.newSteps
      );

     drawRef.current();
    }
const drawRef = useRef(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    /* ---------- compute bounds ---------- */
    boundsRef.current = computeMapBounds(tilesRef.current, TILE_SIZE);

    const marginX = 2 * Math.sqrt(3) * TILE_SIZE;
    const marginY = 2 * 1.5 * TILE_SIZE;

    const expanded = {
      minX: boundsRef.current.minX - marginX,
      maxX: boundsRef.current.maxX + marginX,
      minY: boundsRef.current.minY - marginY,
      maxY: boundsRef.current.maxY + marginY,
    };

    const placeholder = new Image();
    placeholder.src = OUTER_PLACEHOLDER_URL;

    function onClick(e) {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - view.current.offsetX) / view.current.scale;
      const y = (e.clientY - rect.top - view.current.offsetY) / view.current.scale;

      handleTileClick(x, y);
    }

    function handleSetVehicle(id) {
      if (!setVehicle(id)) return false;

      // обновляем шаги после смены транспорта
      playerStepsRef.current =
        START_STEPS + VEHICLES[id].stepBonus;

      reachableRef.current = computeReachable(
        playerPosRef.current,
        playerStepsRef.current
      );

      savePlayerState(playerPosRef.current, playerStepsRef.current);
      drawRef.current();

      return true;
    }

    /* -----------------------------------------
       Drawing helper: hex
    ----------------------------------------- */

    /* -----------------------------------------
       Drawing helper: label
    ----------------------------------------- */
    function drawLabel(x, y, text) {
      const s = 1 / view.current.scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(s, s);

      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.strokeText(text, 0, 0);

      ctx.fillStyle = "white";
      ctx.fillText(text, 0, 0);

      ctx.restore();
    }

    /* -----------------------------------------
       canvas size
    ----------------------------------------- */
    function sizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    /* -----------------------------------------
       min scale
    ----------------------------------------- */
    function computeSymmetricMinScale() {
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const mapW = expanded.maxX - expanded.minX;
      const mapH = expanded.maxY - expanded.minY;
      return Math.max(cw / mapW, ch / mapH);
    }

    /* -----------------------------------------
       Clamp camera
    ----------------------------------------- */
    function clampOffsets() {
      const v = view.current;
      const s = v.scale;
      const cw = canvas.width;
      const ch = canvas.height;

      const left = expanded.minX * s;
      const right = expanded.maxX * s;
      const top = expanded.minY * s;
      const bottom = expanded.maxY * s;

      const w = right - left;
      const h = bottom - top;

      if (w <= cw) v.offsetX = (cw - w) / 2 - left;
      else {
        const min = cw - right;
        const max = -left;
        if (v.offsetX < min) v.offsetX = min;
        if (v.offsetX > max) v.offsetX = max;
      }

      if (h <= ch) v.offsetY = (ch - h) / 2 - top;
      else {
        const min = ch - bottom;
        const max = -top;
        if (v.offsetY < min) v.offsetY = min;
        if (v.offsetY > max) v.offsetY = max;
      }
    }

    /* -----------------------------------------
       DRAW MAIN
    ----------------------------------------- */
    drawRef.current = async function () {
      sizeCanvas();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(view.current.offsetX, view.current.offsetY);
      ctx.scale(view.current.scale, view.current.scale);

      await drawBorder(ctx, tilesRef.current, TILE_SIZE);

      for (const t of tilesRef.current) {
        const p = axialToPixel(t.q, t.r, TILE_SIZE);
        drawHex(ctx, p.x, p.y, TILE_SIZE, t.color);
      }

      drawReachable(ctx, reachableRef.current, TILE_SIZE);
      drawPlayer(ctx, playerPosRef.current, TILE_SIZE);

      ctx.restore();
    };
    /* -----------------------------------------
       Reset view to fit
    ----------------------------------------- */
    function resetViewToFit() {
      sizeCanvas();
      const minS = computeSymmetricMinScale();
      view.current.scale = minS;

      const cx = (expanded.minX + expanded.maxX) / 2;
      const cy = (expanded.minY + expanded.maxY) / 2;

      view.current.offsetX = canvas.width / 2 - cx * minS;
      view.current.offsetY = canvas.height / 2 - cy * minS;

      clampOffsets();
      drawRef.current();
    }

    /* -----------------------------------------
       Interaction
    ----------------------------------------- */
    function onPointerDown(e) {
      canvas.setPointerCapture?.(e.pointerId);
      view.current.dragging = true;
      view.current.dragStartX = e.clientX - view.current.offsetX;
      view.current.dragStartY = e.clientY - view.current.offsetY;
    }

    function onPointerMove(e) {
      if (!view.current.dragging) return;
      view.current.offsetX = e.clientX - view.current.dragStartX;
      view.current.offsetY = e.clientY - view.current.dragStartY;
      clampOffsets();
      drawRef.current();
    }

    function onPointerUp(e) {
      view.current.dragging = false;
      canvas.releasePointerCapture?.(e.pointerId);
    }

    function onWheel(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const old = view.current.scale;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      let next = old * factor;

      const minS = computeSymmetricMinScale();
      const MAX_SCALE = 4;
      if (next < minS) next = minS;
      if (next > MAX_SCALE) next = MAX_SCALE;

      const wx = (mx - view.current.offsetX) / old;
      const wy = (my - view.current.offsetY) / old;

      view.current.scale = next;
      view.current.offsetX = mx - wx * next;
      view.current.offsetY = my - wy * next;

      clampOffsets();
      drawRef.current();
    }

    /* -----------------------------------------
       Event listeners
    ----------------------------------------- */
    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", resetViewToFit);
    canvas.addEventListener("click", onClick);

    resetViewToFit();

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", resetViewToFit);
      canvas.removeEventListener("click", onClick);
    };
  }, []);

 return (
   <div>
     <DevConsole
       onAddSteps={(n) => {
         playerStepsRef.current += n;
         savePlayerState(playerPosRef.current, playerStepsRef.current);
         reachableRef.current = computeReachable(
           playerPosRef.current,
           playerStepsRef.current
         );
         drawRef.current();
       }}

       onSetVehicle={(id) => {
         setVehicle(id);

         playerStepsRef.current =
           START_STEPS + VEHICLES[id].stepBonus;

         savePlayerState(playerPosRef.current, playerStepsRef.current);

         reachableRef.current = computeReachable(
           playerPosRef.current,
           playerStepsRef.current
         );

         drawRef.current();
       }}

       onReset={() => {
         // Сбросим игрока
         playerPosRef.current = { q: 0, r: 0 };
         playerStepsRef.current = START_STEPS;

         savePlayerState(playerPosRef.current, playerStepsRef.current);

         reachableRef.current = computeReachable(
           playerPosRef.current,
           playerStepsRef.current
         );

         drawRef.current();
       }}

       onToggleDebug={() => {
         // Пока просто лог
         console.log("Debug toggled (но можно сделать debug-режим)");
       }}
     />

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
   </div>
 );
}