// components/drawReachable.js
import mapData from "./mapData.js";
import { axialToPixel } from "./hexUtils.js";

export function drawReachable(ctx, reachableMap, TILE_SIZE) {
  if (!reachableMap) return;

  // толщина линии — нежная, но заметная
  const borderWidth = TILE_SIZE * 0.06;

  for (const [key] of reachableMap.entries()) {
    const tile = mapData.find(t => `${t.q},${t.r}` === key);
    if (!tile) continue;

    const p = axialToPixel(tile.q, tile.r, TILE_SIZE);

    ctx.save();

    // Мягкий жёлтый цвет
    ctx.strokeStyle = "rgba(255, 220, 90, 0.70)";
    ctx.lineWidth = borderWidth;
    ctx.globalCompositeOperation = "source-over"; // ← важно: перестаёт белеть

    // Рисуем ровно по форме шестиугольника
    ctx.beginPath();
    const start = Math.PI / 6;
    for (let i = 0; i < 6; i++) {
      const a = start + (i * Math.PI) / 3;
      const x = p.x + TILE_SIZE * Math.cos(a);
      const y = p.y + TILE_SIZE * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.stroke();
    ctx.restore();
  }
}
