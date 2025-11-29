import { axialHexPath } from "../hex/hexUtils.js";

const placeholder = null;

// --- ЗАГРУЗКА ТЕКСТУР ---
const TEXTURE_PATH = "/textures/paper.jpg";
const FOREST_TEXTURE_PATH = "/textures/forest.jpg";
const FIELD_TEXTURE_PATH = "/textures/field.jpg";
const SHORE_TEXTURE_PATH = "/textures/shore.jpg";

const LAKE_TEXTURE_PATH = "/textures/water.jpg";
const RIVER_TEXTURE_PATH = "/textures/water.jpg";
const GREAT_RIVER_TEXTURE_PATH = "/textures/water.jpg";
const LOUGH_TEXTURE_PATH = "/textures/lough_river.jpg"; // Больше не используется для отрисовки

let textureImg = null;
let forestTextureImg = null;
let fieldTextureImg = null;
let shoreImg = null;
let lakeImg = null;
let riverImg = null;
let greatRiverImg = null;
let loughImg = null;

let textureLoaded = false;
let forestTextureLoaded = false;
let fieldTextureLoaded = false;
let shoreLoaded = false;
let lakeLoaded = false;
let riverLoaded = false;
let greatRiverLoaded = false;
let loughLoaded = false;

let patterns = {
  paper: null, forest: null, field: null, shore: null,
  lake: null, river: null, great_river: null, lough_river: null
};

if (typeof window !== "undefined") {
  const load = (src, cb) => {
    const i = new Image(); i.crossOrigin = "anonymous"; i.src = src;
    i.onload = () => cb(i);
  };
  load(TEXTURE_PATH, (i) => { textureImg = i; textureLoaded = true; });
  load(FOREST_TEXTURE_PATH, (i) => { forestTextureImg = i; forestTextureLoaded = true; });
  load(FIELD_TEXTURE_PATH, (i) => { fieldTextureImg = i; fieldTextureLoaded = true; });
  load(SHORE_TEXTURE_PATH, (i) => { shoreImg = i; shoreLoaded = true; });
  load(LAKE_TEXTURE_PATH, (i) => { lakeImg = i; lakeLoaded = true; });
  load(RIVER_TEXTURE_PATH, (i) => { riverImg = i; riverLoaded = true; });
  load(GREAT_RIVER_TEXTURE_PATH, (i) => { greatRiverImg = i; greatRiverLoaded = true; });
  load(LOUGH_TEXTURE_PATH, (i) => { loughImg = i; loughLoaded = true; });
}

const COLORS = {
  village: "#E8DCCA", lake: "#AEC6CF", river: "#9BC4D4",
  great_river: "#9BC4D4", lough_river: "#9BC4D4", island: "#cddfb9",
  forest: "#cddfb9", field: "#cddfb9", default: "#F0E6D2"
};

function getTileImage(tile) { return null; }

export function drawHexBase(ctx, x, y, size, tile, flowRotation = 0) {
  if (!tile) return;
  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.fillStyle = COLORS[tile.type] || COLORS.default;
  ctx.fill();
  ctx.globalCompositeOperation = "multiply";

  let activePattern = null;
  let alpha = 0.4;
  let flowSpeedX = 0;
  let isOscillating = false;

  const time = typeof performance !== 'undefined' ? performance.now() : 0;

  if ((tile.type === 'forest' || tile.type === 'island') && forestTextureLoaded) {
    if (!patterns.forest) patterns.forest = createPatternSafe(ctx, forestTextureImg);
    activePattern = patterns.forest; alpha = 0.6;
  } else if (tile.type === 'field' && fieldTextureLoaded) {
    if (!patterns.field) patterns.field = createPatternSafe(ctx, fieldTextureImg);
    activePattern = patterns.field; alpha = 0.5;

  // --- ОЗЕРА (КОЛЕБАНИЕ) ---
  } else if (tile.type === 'lake' && lakeLoaded) {
    if (!patterns.lake) patterns.lake = createPatternSafe(ctx, lakeImg);
    activePattern = patterns.lake; alpha = 0.5;
    isOscillating = true;

  // --- ЗАВОДИ (ТЕПЕРЬ КАК ОЗЕРО) ---
  } else if (tile.type === 'lough_river' && lakeLoaded) {
    // Используем текстуру Озера (вода)
    if (!patterns.lake) patterns.lake = createPatternSafe(ctx, lakeImg);
    activePattern = patterns.lake;
    alpha = 0.5;
    isOscillating = true; // Колеблется как вода

  // --- РЕКИ (ТЕЧЕНИЕ) ---
  } else if (tile.type === 'river' && riverLoaded) {
    if (!patterns.river) patterns.river = createPatternSafe(ctx, riverImg);
    activePattern = patterns.river; alpha = 0.5; flowSpeedX = 0.04;
  } else if (tile.type === 'great_river' && greatRiverLoaded) {
    if (!patterns.great_river) patterns.great_river = createPatternSafe(ctx, greatRiverImg);
    activePattern = patterns.great_river; alpha = 0.7; flowSpeedX = 0.04;

  } else if (textureLoaded) {
    if (!patterns.paper) patterns.paper = createPatternSafe(ctx, textureImg);
    activePattern = patterns.paper; alpha = 0.4;
  }

  if (activePattern) {
    if (typeof DOMMatrix !== 'undefined' && activePattern.setTransform) {
        let matrix = new DOMMatrix();

        // 1. Поворот (для рек)
        if (tile.type === 'river' || tile.type === 'great_river') {
             if (flowRotation !== 0) matrix = matrix.rotate(flowRotation);
        }

        // 2. Анимация
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

function createPatternSafe(ctx, img) {
  try { return ctx.createPattern(img, "repeat"); } catch (e) { return null; }
}

// --- БЕРЕГА ---
export function drawHexShores(ctx, x, y, size, shoreMask, tileType = 'river') {
  if (!shoreMask || !shoreMask.some(b => b)) return;

  // Подготовка ресурсов
  let shorePattern = null;
  let useForestStyle = false;

  if (tileType === 'lough_river') {
      if (!forestTextureLoaded) return;
      if (!patterns.forest && forestTextureImg) {
          patterns.forest = createPatternSafe(ctx, forestTextureImg);
      }
      shorePattern = patterns.forest;
      useForestStyle = true;
  } else {
      if (!shoreLoaded) return;
      if (!patterns.shore && shoreImg) {
          patterns.shore = createPatternSafe(ctx, shoreImg);
      }
      shorePattern = patterns.shore;
  }

  if (!shorePattern) return;

  ctx.save();

  // 1. Клиппинг
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.clip();

  // Настройки ширины
  let widthFactor = 0.5;
  if (tileType === 'lake' || tileType === 'lough_river') {
    widthFactor = 0.3;
  }
  const strokeW = size * widthFactor;

  // Функция рисования пути берега
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

  // --- ОТРИСОВКА БЕРЕГОВ ---

  if (useForestStyle) {
      // СЛОЙ 1: Цвет леса (база)
      drawShorePath();
      ctx.strokeStyle = COLORS.forest;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
      ctx.stroke();

      // СЛОЙ 2: Текстура леса (наложение)
      drawShorePath();
      ctx.strokeStyle = shorePattern;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.6; // Прозрачность текстуры
      ctx.globalCompositeOperation = "multiply"; // Смешивание с цветом
      ctx.stroke();
  } else {
      // Обычный берег (только текстура песка)
      drawShorePath();
      ctx.strokeStyle = shorePattern;
      ctx.lineWidth = strokeW;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = "source-over";
      ctx.stroke();
  }

  // --- РАНДОМНЫЕ ОСТРОВА (Только для lough_river) ---
  if (tileType === 'lough_river') {
      const seed = Math.floor(x) * 31 + Math.floor(y) * 17;
      const rand = (offset) => Math.abs(Math.sin(seed + offset));
      const numIslands = 1 + Math.floor(rand(0) * 1.8);

      for (let k = 0; k < numIslands; k++) {
          // Генерация формы
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

          // Рисуем форму
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

          // ЗАЛИВКА ОСТРОВОВ (ТАК ЖЕ КАК БЕРЕГ: ЦВЕТ + ТЕКСТУРА)

          // Слой 1: Цвет
          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = COLORS.forest;
          ctx.globalAlpha = 1.0;
          ctx.fill();

          // Слой 2: Текстура
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
  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.strokeStyle = "rgba(142, 113, 57, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  const img = getTileImage(tile);
  if (img && img.complete && img.naturalWidth !== 0) {
    const hexScreenHeight = size * Math.sqrt(3);
    const scale = hexScreenHeight / 512;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.save();
    ctx.drawImage(img, x - w / 2, y - h / 2, w, h);
    ctx.restore();
  }
}

export function drawHexNet(ctx, x, y, size) {}