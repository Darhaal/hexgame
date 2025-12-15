import { drawBorder } from "./drawBorder";
import { drawHexBase, drawHexOverlay, drawHexShores } from "./drawHex";
import { drawPlayer } from "./drawPlayer";
import { drawPath } from "./drawPath"; // Импорт отрисовки пути
import { axialToPixel } from "../hex/hexUtils";

// drawReachable больше не импортируем и не используем

// Кеш для карты течений
let cachedFlowMap = null;
let cachedMapRef = null;

function isWater(t) {
  return t && ['river', 'great_river', 'lake', 'lough_river'].includes(t.type);
}

function isRiver(t) {
  return t && t.type === 'river';
}

function isSink(t) {
  return t && (t.type === 'great_river');
}

// Хелпер для определения группы воды (для берегов)
function getWaterGroup(type) {
    // Разделяем системы, чтобы между ними рисовался берег
    if (type === 'river' || type === 'great_river') return 'river_sys';
    if (type === 'lake' || type === 'lough_river') return 'lake_sys';
    return 'land';
}

/**
 * Рассчитывает направления течения методом поиска пути (BFS).
 */
function calculateFlowMap(mapData, tileSize) {
  const flowMap = new Map();
  const tileMap = new Map();

  mapData.forEach(t => tileMap.set(`${t.q},${t.r}`, t));

  const getNeighbors = (t) => {
    const offsets = [
      {q:1,r:0}, {q:1,r:-1}, {q:0,r:-1},
      {q:-1,r:0}, {q:-1,r:1}, {q:0,r:1}
    ];
    return offsets
      .map(off => tileMap.get(`${t.q + off.q},${t.r + off.r}`))
      .filter(n => n !== undefined);
  };

  // 1. Днепр и Озера
  mapData.forEach(t => {
    if (t.type === 'great_river') {
       let angle = 90;
       const neighbors = getNeighbors(t).filter(n => n.type === 'great_river');
       const selfP = axialToPixel(t.q, t.r, tileSize);

       const downstream = neighbors.find(n => {
          const nP = axialToPixel(n.q, n.r, tileSize);
          return nP.y > selfP.y + 1;
       });

       if (downstream) {
          const nP = axialToPixel(downstream.q, downstream.r, tileSize);
          angle = Math.atan2(nP.y - selfP.y, nP.x - selfP.x) * (180 / Math.PI);
       }
       flowMap.set(`${t.q},${t.r}`, angle);
    } else if (t.type === 'lake' || t.type === 'lough_river') {
       flowMap.set(`${t.q},${t.r}`, 0);
    }
  });

  // 2. BFS для обычных рек
  const queue = [];
  const parents = new Map();
  const visited = new Set();

  mapData.forEach(t => {
    if (isSink(t)) {
      queue.push(t);
      visited.add(t);
    }
  });

  while (queue.length > 0) {
    const curr = queue.shift();
    const neighbors = getNeighbors(curr);

    for (const n of neighbors) {
      if (isRiver(n) && !visited.has(n)) {
        visited.add(n);
        parents.set(n, curr);
        queue.push(n);
      }
    }
  }

  parents.forEach((target, source) => {
     const sP = axialToPixel(source.q, source.r, tileSize);
     const tP = axialToPixel(target.q, target.r, tileSize);
     const angle = Math.atan2(tP.y - sP.y, tP.x - sP.x) * (180 / Math.PI);
     flowMap.set(`${source.q},${source.r}`, angle);
  });

  mapData.forEach(t => {
    if (isRiver(t) && !flowMap.has(`${t.q},${t.r}`)) {
       if (t.name === "Рось") flowMap.set(`${t.q},${t.r}`, 0);
       else if (t.name === "Горловка") flowMap.set(`${t.q},${t.r}`, 180);
       else flowMap.set(`${t.q},${t.r}`, 90);
    }
  });

  return flowMap;
}

export async function drawScene({ canvas, camera, mapData, playerPos, reachableMap, path, tick }) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");
  if (!canvas.width || !canvas.height) return;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);

  const TILE_SIZE = 100;

  if (mapData !== cachedMapRef) {
    cachedFlowMap = calculateFlowMap(mapData, TILE_SIZE);
    cachedMapRef = mapData;
  }

  if (drawBorder) await drawBorder(ctx, mapData, TILE_SIZE);

  const tileTypeMap = new Map();
  mapData.forEach(t => tileTypeMap.set(`${t.q},${t.r}`, t.type));

  const sortedMap = [...mapData].sort((a, b) => {
    const aY = a.r + a.q / 2;
    const bY = b.r + b.q / 2;
    return (aY - bY) || (a.q - b.q);
  });

  for (const t of sortedMap) {
    const p = axialToPixel(t.q, t.r, TILE_SIZE);
    const flowAngle = cachedFlowMap ? (cachedFlowMap.get(`${t.q},${t.r}`) || 0) : 0;

    drawHexBase(ctx, p.x, p.y, TILE_SIZE, t, flowAngle);

    if (isWater(t)) {
        const shoreOffsets = [
            {q:1, r:0}, {q:0, r:1}, {q:-1, r:1},
            {q:-1, r:0}, {q:0, r:-1}, {q:1, r:-1}
        ];

        const selfGroup = getWaterGroup(t.type);

        const shoreMask = shoreOffsets.map(off => {
            const nType = tileTypeMap.get(`${t.q + off.q},${t.r + off.r}`);

            // Если соседа нет (край карты)
            if (!nType) {
                // Для lough_river берег НУЖЕН (чтобы закрыть заводь лесом)
                if (t.type === 'lough_river') return true;
                // Для рек берег НЕ НУЖЕН (чтобы текли за край)
                return false;
            }

            const nGroup = getWaterGroup(nType);

            // Рисуем берег, если сосед - суша (land) или вода другой системы (river vs lake)
            return nGroup === 'land' || nGroup !== selfGroup;
        });

        drawHexShores(ctx, p.x, p.y, TILE_SIZE, shoreMask, t.type);
    }
  }

  for (const t of sortedMap) {
    const p = axialToPixel(t.q, t.r, TILE_SIZE);
    drawHexOverlay(ctx, p.x, p.y, TILE_SIZE, t);
  }

  // --- ОТРИСОВКА ПУТИ ---
  // drawReachable убрана

  // Рисуем путь (крестики)
  if (path && drawPath) {
      drawPath(ctx, path, TILE_SIZE);
  }

  if (playerPos && drawPlayer) drawPlayer(ctx, playerPos, TILE_SIZE);

  ctx.restore();
}