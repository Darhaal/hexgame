import { axialToPixel } from "../hex/hexUtils";
import { getAsset } from "../assets/AssetLoader";

let woodPattern = null;

function hexPath(ctx, x, y, size) {
  const start = 0;
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
    const img = getAsset('wood_dark');
    if (img) {
      try {
        woodPattern = ctx.createPattern(img, "repeat");
      } catch (e) {
        woodPattern = null;
      }
    } else {
      return; // Ждем загрузки
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

      // Wood fill
      ctx.fillStyle = woodPattern;
      hexPath(ctx, p.x, p.y, sizeInner);
      ctx.fill();

      // Shadow
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