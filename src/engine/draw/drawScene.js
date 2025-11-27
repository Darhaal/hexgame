// src/engine/draw/drawScene.js
/**
 * Single entrypoint to draw the whole scene.
 * FIXED: Removed canvas resizing from inside the draw loop (performance fix).
 */

import { drawBorder } from "./drawBorder";
import { drawHex } from "./drawHex";
import { drawPlayer } from "./drawPlayer";
import { drawReachable } from "./drawReachable";
import { axialToPixel } from "../hex/hexUtils";

export async function drawScene({ canvas, camera, mapData, playerPos, reachableMap }) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // --- PERFORMANCE FIX: Убрали изменение размеров canvas отсюда ---
  // Размер меняется только при событии resize в HexCanvas/camera.js

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);

  // draw decorative border/wall textures outside map
  await drawBorder(ctx, mapData, 100);

  // draw all hexes
  for (const t of mapData) {
    const p = axialToPixel(t.q, t.r, 100);
    drawHex(ctx, p.x, p.y, 100, t.type.color);
  }

  // draw reachable overlay
  drawReachable(ctx, reachableMap, 100);

  // draw player
  drawPlayer(ctx, playerPos, 100);

  ctx.restore();
}