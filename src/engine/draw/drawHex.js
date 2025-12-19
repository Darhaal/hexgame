import { axialHexPath } from "../hex/hexUtils.js";
import { getAsset } from "../assets/AssetLoader";

const COLORS = {
  village: "#E8DCCA", lake: "#AEC6CF", river: "#9BC4D4",
  great_river: "#9BC4D4", lough_river: "#9BC4D4", island: "#cddfb9",
  forest: "#cddfb9", field: "#cddfb9", default: "#F0E6D2"
};

// Кеш паттернов, чтобы не пересоздавать каждый кадр
let patterns = {};

function getPattern(ctx, key) {
    if (!patterns[key]) {
        const img = getAsset(key);
        if (img) {
            try {
                patterns[key] = ctx.createPattern(img, "repeat");
            } catch (e) {
                console.warn("Pattern creation failed for", key);
            }
        }
    }
    return patterns[key];
}

function getTileImage(tile) { return null; } // Placeholder если нужны спрайты тайлов

export function drawHexBase(ctx, x, y, size, tile, flowRotation = 0) {
  if (!tile) return;

  // 1. Базовый цвет
  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.fillStyle = COLORS[tile.type] || COLORS.default;
  ctx.fill();
  ctx.globalCompositeOperation = "multiply";

  // 2. Текстура / Паттерн
  let activePattern = null;
  let alpha = 0.4;
  let flowSpeedX = 0;
  let isOscillating = false;
  const time = typeof performance !== 'undefined' ? performance.now() : 0;

  if (tile.type === 'forest' || tile.type === 'island') {
    activePattern = getPattern(ctx, 'forest');
    alpha = 0.6;
  } else if (tile.type === 'field') {
    activePattern = getPattern(ctx, 'field');
    alpha = 0.5;
  } else if (tile.type === 'lake') {
    activePattern = getPattern(ctx, 'water'); // Используем общую текстуру воды
    alpha = 0.5;
    isOscillating = true;
  } else if (tile.type === 'lough_river') {
    activePattern = getPattern(ctx, 'water');
    alpha = 0.5;
    isOscillating = true;
  } else if (tile.type === 'river') {
    activePattern = getPattern(ctx, 'water');
    alpha = 0.5;
    flowSpeedX = 0.04;
  } else if (tile.type === 'great_river') {
    activePattern = getPattern(ctx, 'water');
    alpha = 0.7;
    flowSpeedX = 0.04;
  } else {
    // Дефолтная бумага
    activePattern = getPattern(ctx, 'paper');
    alpha = 0.4;
  }

  if (activePattern) {
    if (typeof DOMMatrix !== 'undefined' && activePattern.setTransform) {
        let matrix = new DOMMatrix();

        // Поворот течения
        if ((tile.type === 'river' || tile.type === 'great_river') && flowRotation !== 0) {
             matrix = matrix.rotate(flowRotation);
        }

        // Анимация
        if (isOscillating) {
            const oscX = Math.sin(time * 0.001) * 15;
            const oscY = Math.cos(time * 0.001) * 15;
            matrix = matrix.translate(oscX, oscY);
        } else if (flowSpeedX !== 0) {
            const offset = (time * flowSpeedX) % 512;
            matrix = matrix.translate(offset, 0);
        }

        activePattern.setTransform(matrix);
    }
    ctx.globalAlpha = alpha;
    ctx.fillStyle = activePattern;
    ctx.fill();
  }
  ctx.restore();
}


// --- БЕРЕГА ---
export function drawHexShores(ctx, x, y, size, shoreMask, tileType = 'river') {
  if (!shoreMask || !shoreMask.some(b => b)) return;

  let shorePattern = null;
  let useForestStyle = false;

  if (tileType === 'lough_river') {
      shorePattern = getPattern(ctx, 'forest');
      useForestStyle = true;
  } else {
      shorePattern = getPattern(ctx, 'shore');
  }

  if (!shorePattern) return;

  ctx.save();

  // Клиппинг по гексу
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.clip();

  let widthFactor = 0.5;
  if (tileType === 'lake' || tileType === 'lough_river') widthFactor = 0.3;
  const strokeW = size * widthFactor;

  const drawShorePath = () => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        if (shoreMask[i]) {
          const a1 = (i * 60) * Math.PI / 180;
          const a2 = ((i + 1) * 60) * Math.PI / 180;
          const x1 = x + size * Math.cos(a1);
          const y1 = y + size * Math.sin(a1);
          const x2 = x + size * Math.cos(a2);
          const y2 = y + size * Math.sin(a2);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
      }
  };

  if (useForestStyle) {
      // СЛОЙ 1: Цвет леса
      drawShorePath();
      ctx.strokeStyle = COLORS.forest;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
      ctx.stroke();

      // СЛОЙ 2: Текстура
      drawShorePath();
      ctx.strokeStyle = shorePattern;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.6;
      ctx.globalCompositeOperation = "multiply";
      ctx.stroke();
  } else {
      drawShorePath();
      ctx.strokeStyle = shorePattern;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
      ctx.stroke();
  }

  // --- РАНДОМНЫЕ ОСТРОВА ---
  if (tileType === 'lough_river') {
      const seed = Math.floor(x) * 31 + Math.floor(y) * 17;
      const rand = (offset) => Math.abs(Math.sin(seed + offset));
      const numIslands = 1 + Math.floor(rand(0) * 1.8);

      for (let k = 0; k < numIslands; k++) {
          const offsetX = (rand(k + 1) - 0.5) * size * 0.4;
          const offsetY = (rand(k + 2) - 0.5) * size * 0.4;
          const baseR = size * (0.15 + rand(k + 3) * 0.15);

          const vertices = [];
          const numVerts = 7;
          for (let j = 0; j < numVerts; j++) {
              const angle = (j / numVerts) * Math.PI * 2;
              const r = baseR * (0.7 + rand(k * 10 + j) * 0.6);
              vertices.push({
                  x: x + offsetX + Math.cos(angle) * r,
                  y: y + offsetY + Math.sin(angle) * r
              });
          }

          ctx.beginPath();
          const startX = (vertices[numVerts - 1].x + vertices[0].x) / 2;
          const startY = (vertices[numVerts - 1].y + vertices[0].y) / 2;
          ctx.moveTo(startX, startY);
          for (let j = 0; j < numVerts; j++) {
              const p1 = vertices[j];
              const p2 = vertices[(j + 1) % numVerts];
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }
          ctx.closePath();

          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = COLORS.forest;
          ctx.globalAlpha = 1.0;
          ctx.fill();

          ctx.globalCompositeOperation = "multiply";
          ctx.fillStyle = shorePattern;
          ctx.globalAlpha = 0.6;
          ctx.fill();
      }
  }
  ctx.restore();
}

export function drawHexOverlay(ctx, x, y, size, tile) {
  if (!tile) return;

  // Контур гекса
  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.strokeStyle = "rgba(142, 113, 57, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  // Здесь можно было бы рисовать спрайты деревьев/домов, если они есть
}

export function drawHexNet(ctx, x, y, size) {}