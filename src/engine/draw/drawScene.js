import { drawBorder } from "./drawBorder";
import { drawHexBase, drawHexOverlay, drawHexShores } from "./drawHex";
import { drawPlayer } from "./drawPlayer";
import { drawPath } from "./drawPath";
import { axialToPixel } from "../hex/hexUtils";

// Кеши
let cachedFlowMap = null;
let cachedMapRef = null;

// ПЕРЕМЕННЫЕ ДЛЯ ОПТИМИЗАЦИИ (Static Layer)
let staticCanvas = null;
let staticCtx = null;
let staticLayerValid = false;
let staticBounds = null; // { minX, minY, width, height }

function isWater(t) {
  return t && ['river', 'great_river', 'lake', 'lough_river'].includes(t.type);
}

function isRiver(t) { return t && t.type === 'river'; }
function isSink(t) { return t && (t.type === 'great_river'); }

function getWaterGroup(type) {
    if (type === 'river' || type === 'great_river') return 'river_sys';
    if (type === 'lake' || type === 'lough_river') return 'lake_sys';
    return 'land';
}

function calculateFlowMap(mapData, tileSize) {
  const flowMap = new Map();
  const tileMap = new Map();
  mapData.forEach(t => tileMap.set(`${t.q},${t.r}`, t));

  const getNeighbors = (t) => {
    const offsets = [{q:1,r:0}, {q:1,r:-1}, {q:0,r:-1}, {q:-1,r:0}, {q:-1,r:1}, {q:0,r:1}];
    return offsets.map(off => tileMap.get(`${t.q + off.q},${t.r + off.r}`)).filter(n => n !== undefined);
  };

  // 1. Great Rivers
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

  // 2. Normal Rivers (BFS)
  const queue = [];
  const parents = new Map();
  const visited = new Set();
  mapData.forEach(t => { if (isSink(t)) { queue.push(t); visited.add(t); } });

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

// Вычисляем границы всего мира в пикселях
function calculateWorldBounds(mapData, tileSize) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    // Добавляем запас (margin) на border и размер гекса
    // Увеличили margin, чтобы border не обрезался в статическом слое
    const margin = tileSize * 3;

    for (const t of mapData) {
        const p = axialToPixel(t.q, t.r, tileSize);
        minX = Math.min(minX, p.x);
        maxX = Math.max(maxX, p.x);
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
    }
    return {
        minX: minX - margin,
        minY: minY - margin,
        width: (maxX - minX) + margin * 2,
        height: (maxY - minY) + margin * 2
    };
}

// Отрисовка статического слоя (Земля, Леса, Деревни, Границы)
function drawStaticLayer(mapData, sortedMap, tileSize) {
    if (!staticCanvas) {
        staticCanvas = document.createElement('canvas');
        staticCtx = staticCanvas.getContext('2d');
    }

    if (!staticBounds) {
        staticBounds = calculateWorldBounds(mapData, tileSize);
    }

    // Ресайз канваса (это очищает его)
    if (staticCanvas.width !== Math.ceil(staticBounds.width) || staticCanvas.height !== Math.ceil(staticBounds.height)) {
        staticCanvas.width = Math.ceil(staticBounds.width);
        staticCanvas.height = Math.ceil(staticBounds.height);
    } else {
        staticCtx.clearRect(0, 0, staticCanvas.width, staticCanvas.height);
    }

    staticCtx.save();
    // Сдвигаем координаты так, чтобы minX, minY стали 0,0
    staticCtx.translate(-staticBounds.minX, -staticBounds.minY);

    // 1. Borders
    drawBorder(staticCtx, mapData, tileSize);

    // 2. Static Tiles (Non-Water)
    for (const t of sortedMap) {
        if (!isWater(t)) {
            // Рисуем базу
            drawHexBase(staticCtx, axialToPixel(t.q, t.r, tileSize).x, axialToPixel(t.q, t.r, tileSize).y, tileSize, t, 0);
            // Рисуем оверлей (домики, деревья)
            drawHexOverlay(staticCtx, axialToPixel(t.q, t.r, tileSize).x, axialToPixel(t.q, t.r, tileSize).y, tileSize, t);
        }
    }

    staticCtx.restore();
    staticLayerValid = true;
}


export async function drawScene({ canvas, camera, mapData, playerPos, reachableMap, path, tileSize }) {
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  // Очистка главного экрана - БЕЛЫЙ ФОН
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Расчет потоков воды (если карта изменилась)
  if (mapData !== cachedMapRef) {
    cachedFlowMap = calculateFlowMap(mapData, tileSize);
    cachedMapRef = mapData;
    staticLayerValid = false; // Карта изменилась -> сброс кеша
    staticBounds = null;
  }

  // Сортировка для Z-index
  const sortedMap = [...mapData].sort((a, b) => {
    const aY = a.r + a.q / 2;
    const bY = b.r + b.q / 2;
    return (aY - bY) || (a.q - b.q);
  });

  // 1. Подготовка статического слоя (если нужно)
  if (!staticLayerValid) {
      drawStaticLayer(mapData, sortedMap, tileSize);
  }

  // 2. Начало отрисовки камеры
  ctx.save();
  ctx.translate(camera.offsetX, camera.offsetY);
  ctx.scale(camera.scale, camera.scale);

  // 3. Рисуем СТАТИЧЕСКИЙ слой одной картинкой
  if (staticCanvas && staticBounds) {
      // Рисуем картинку в мировых координатах (minX, minY)
      ctx.drawImage(staticCanvas, staticBounds.minX, staticBounds.minY);
  }

  // 4. Рисуем ДИНАМИЧЕСКИЕ тайлы (Вода)
  const tileTypeMap = new Map(mapData.map(t => [`${t.q},${t.r}`, t.type]));

  for (const t of sortedMap) {
    if (isWater(t)) {
        const p = axialToPixel(t.q, t.r, tileSize);
        const flowAngle = cachedFlowMap ? (cachedFlowMap.get(`${t.q},${t.r}`) || 0) : 0;

        // Рисуем базу воды (анимированную)
        drawHexBase(ctx, p.x, p.y, tileSize, t, flowAngle);

        // Рисуем берега
        const shoreOffsets = [
            {q:1, r:0}, {q:0, r:1}, {q:-1, r:1},
            {q:-1, r:0}, {q:0, r:-1}, {q:1, r:-1}
        ];
        const selfGroup = getWaterGroup(t.type);
        const shoreMask = shoreOffsets.map(off => {
            const nType = tileTypeMap.get(`${t.q + off.q},${t.r + off.r}`);
            const nGroup = nType ? getWaterGroup(nType) : 'land';
            if (!nType && t.type === 'lough_river') return true;
            if (!nType && (t.type === 'river' || t.type === 'great_river')) return false;
            return nGroup === 'land' || nGroup !== selfGroup;
        });

        drawHexShores(ctx, p.x, p.y, tileSize, shoreMask, t.type);

        // Оверлей для воды
        drawHexOverlay(ctx, p.x, p.y, tileSize, t);
    }
  }

  // 5. Путь, Игрок
  if (path && drawPath) drawPath(ctx, path, tileSize);
  if (playerPos && drawPlayer) drawPlayer(ctx, playerPos, tileSize);

  ctx.restore();
}