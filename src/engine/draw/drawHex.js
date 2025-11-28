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
const LOUGH_TEXTURE_PATH = "/textures/water.jpg";

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
  great_river: "#8AAEC4", lough_river: "#A4BFCB", island: "#B8C9A5",
  forest: "#B8C9A5", field: "#B8C9A5", default: "#F0E6D2"
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
  const time = typeof performance !== 'undefined' ? performance.now() : 0;

  if ((tile.type === 'forest' || tile.type === 'island') && forestTextureLoaded) {
    if (!patterns.forest) patterns.forest = createPatternSafe(ctx, forestTextureImg);
    activePattern = patterns.forest; alpha = 0.6;
  } else if (tile.type === 'field' && fieldTextureLoaded) {
    if (!patterns.field) patterns.field = createPatternSafe(ctx, fieldTextureImg);
    activePattern = patterns.field; alpha = 0.5;
  } else if (tile.type === 'lake' && lakeLoaded) {
    if (!patterns.lake) patterns.lake = createPatternSafe(ctx, lakeImg);
    activePattern = patterns.lake; alpha = 0.5; flowSpeedX = 0.005;
  } else if (tile.type === 'river' && riverLoaded) {
    if (!patterns.river) patterns.river = createPatternSafe(ctx, riverImg);
    activePattern = patterns.river; alpha = 0.5; flowSpeedX = 0.04;
  } else if (tile.type === 'great_river' && greatRiverLoaded) {
    if (!patterns.great_river) patterns.great_river = createPatternSafe(ctx, greatRiverImg);
    activePattern = patterns.great_river; alpha = 0.7; flowSpeedX = 0.04;
  } else if (tile.type === 'lough_river' && loughLoaded) {
    if (!patterns.lough_river) patterns.lough_river = createPatternSafe(ctx, loughImg);
    activePattern = patterns.lough_river; alpha = 0.55;
  } else if (textureLoaded) {
    if (!patterns.paper) patterns.paper = createPatternSafe(ctx, textureImg);
    activePattern = patterns.paper; alpha = 0.4;
  }

  if (activePattern) {
    if (typeof DOMMatrix !== 'undefined' && activePattern.setTransform) {
        let matrix = new DOMMatrix();
        if (flowRotation !== 0) matrix = matrix.rotate(flowRotation);
        if (flowSpeedX !== 0) {
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

// --- БЕРЕГА (ОБНОВЛЕНО ПОД 0.2 и 0.5) ---
export function drawHexShores(ctx, x, y, size, shoreMask, tileType = 'river') {
  if (!shoreMask || !shoreMask.some(b => b)) return;
  if (!shoreLoaded) return;

  if (!patterns.shore && shoreImg) {
    patterns.shore = createPatternSafe(ctx, shoreImg);
  }
  if (!patterns.shore) return;

  ctx.save();

  // 1. Ограничиваем рисование внутренней частью гекса
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.clip();

  // 2. Настраиваем ширину берега в зависимости от типа
  // Для Озер: 0.2 от размера (узкий берег)
  // Для Рек (и прочих): 0.5 от размера (широкий берег)
  let widthFactor = 0.5;
  if (tileType === 'lake' || tileType === 'lough_river') {
    widthFactor = 0.3;
  }

  // Т.к. clip обрезает половину линии, мы задаем strokeWidth = factor * size
  // Видимая часть будет равна factor * size / 2.
  // Если вы хотите видимую часть именно 0.5, то здесь нужно ставить 1.0.
  // Но полагаю, вы имели в виду параметр толщины линии в коде (как было 0.2/0.3).
  // Поэтому ставим strokeWidth равным запрошенному коэффициенту.
  const strokeW = size * widthFactor;

  ctx.strokeStyle = patterns.shore;
  ctx.lineWidth = strokeW;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = "source-over";

  // 3. Рисуем грани
  for (let i = 0; i < 6; i++) {
    if (shoreMask[i]) {
      const a1 = (i * 60) * Math.PI / 180;
      const a2 = ((i + 1) * 60) * Math.PI / 180;
      const x1 = x + size * Math.cos(a1);
      const y1 = y + size * Math.sin(a1);
      const x2 = x + size * Math.cos(a2);
      const y2 = y + size * Math.sin(a2);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
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