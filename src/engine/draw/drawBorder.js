/**
 * Draw decorative "wood" tiles on the map's outer edges.
 * This module preloads an image for a repeating pattern.
 */

import { axialToPixel } from "../hex/hexUtils";

const IMG_PATH = "/textures/wood_dark.jpg";
let woodPattern = null;
let loadedImage = null;
let imageLoaded = false;

// Preload (browser-only)
(function preload() {
  if (typeof window === "undefined" || typeof Image === "undefined") return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = IMG_PATH;
  img.onload = () => { imageLoaded = true; loadedImage = img; };
  img.onerror = () => { imageLoaded = false; loadedImage = null; };
})();

// Обновленная функция отрисовки контура для Flat Top
function hexPath(ctx, x, y, size) {
  const start = 0; // Начинаем с 0 для плоского верха
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = start + (i * Math.PI) / 3;
    const px = x + size * Math.cos(a);
    const py = y + size * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

const RING_1 = [
  { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
];

export function drawBorder(ctx, tiles, TILE_SIZE = 100) {
  if (!ctx || !tiles || tiles.length === 0) return;

  if (!woodPattern) {
    if (imageLoaded && loadedImage) {
      try {
        woodPattern = ctx.createPattern(loadedImage, "repeat");
      } catch (e) {
        woodPattern = null;
      }
    } else {
      return;
    }
  }

  ctx.save();
  const sizeInner = TILE_SIZE;
  for (const tile of tiles) {
    for (const off of RING_1) {
      const q = tile.q + off.q;
      const r = tile.r + off.r;
      if (tiles.some(t => t.q === q && t.r === r)) continue;

      const p = axialToPixel(q, r, TILE_SIZE);

      // wood fill
      ctx.fillStyle = woodPattern;
      hexPath(ctx, p.x, p.y, sizeInner);
      ctx.fill();

      // inner soft shadow
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      const shadow = ctx.createRadialGradient(p.x, p.y, TILE_SIZE * 0.2, p.x, p.y, TILE_SIZE);
      shadow.addColorStop(0, "rgba(0,0,0,0.0)");
      shadow.addColorStop(0.85, "rgba(0,0,0,0.18)");
      shadow.addColorStop(1.0, "rgba(0,0,0,0.3)");
      ctx.fillStyle = shadow;
      hexPath(ctx, p.x, p.y, sizeInner);
      ctx.fill();
      ctx.restore();
    }
  }
  ctx.restore();
}