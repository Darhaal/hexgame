import { drawBorder } from "./drawBorder";
import { drawHexBase, drawHexOverlay } from "./drawHex";
import { drawPlayer } from "./drawPlayer";
import { drawReachable } from "./drawReachable";
import { axialToPixel } from "../hex/hexUtils";

export async function drawScene({ canvas, camera, mapData, playerPos, reachableMap }) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  if (!canvas.width || !canvas.height) return;

  // 1. Очистка
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Камера
  ctx.save();
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);

  const TILE_SIZE = 100;

  // 3. Рамка
  // (Предполагается, что drawBorder использует hexUtils, тогда она сама подстроится,
  // если нет - вам нужно обновить математику и там)
  if (typeof drawBorder === 'function') {
     await drawBorder(ctx, mapData, TILE_SIZE);
  }

  // --- СОРТИРОВКА (FLAT TOP) ---
  // Для Flat Top важно рисовать сверху вниз по экрану (по Y).
  // Y зависит от r + q/2.
  const sortedMap = [...mapData].sort((a, b) => {
    // Вычисляем "вес" позиции по вертикали экрана
    const aY = a.r + a.q / 2;
    const bY = b.r + b.q / 2;

    // Сначала сортируем по вертикали (Y), если равны — по горизонтали (q)
    return (aY - bY) || (a.q - b.q);
  });

  // --- ПРОХОД 1: ПОДЛОЖКА (Земля) ---
  for (const t of sortedMap) {
    const p = axialToPixel(t.q, t.r, TILE_SIZE);
    drawHexBase(ctx, p.x, p.y, TILE_SIZE, t);
  }

  // --- ПРОХОД 2: ОБЪЕКТЫ (Деревья) ---
  for (const t of sortedMap) {
    const p = axialToPixel(t.q, t.r, TILE_SIZE);
    drawHexOverlay(ctx, p.x, p.y, TILE_SIZE, t);
  }

  // --- ПОДСВЕТКА ХОДОВ ---
  if (reachableMap) {
    // Убедитесь, что drawReachable тоже использует axialToPixel и axialHexPath из hexUtils
    if (typeof drawReachable === 'function') {
        drawReachable(ctx, reachableMap, TILE_SIZE);
    }
  }

  // --- ИГРОК ---
  if (playerPos) {
    if (typeof drawPlayer === 'function') {
        drawPlayer(ctx, playerPos, TILE_SIZE);
    }
  }

  ctx.restore();
}