import { axialHexPath } from "../hex/hexUtils.js";

const placeholder = null;

// --- ЗАГРУЗКА ТЕКСТУР ---
// Теперь для каждого типа воды свой путь.
// Вы можете заменить "/textures/water.jpg" на разные файлы для разных рек.
const TEXTURE_PATH = "/textures/paper.jpg";
const FOREST_TEXTURE_PATH = "/textures/forest.jpg";
const FIELD_TEXTURE_PATH = "/textures/field.jpg";

const LAKE_TEXTURE_PATH = "/textures/water.jpg";        // Озера
const RIVER_TEXTURE_PATH = "/textures/water.jpg";       // Обычные реки
const GREAT_RIVER_TEXTURE_PATH = "/textures/water.jpg"; // Великие реки (Днепр)
const LOUGH_TEXTURE_PATH = "/textures/water.jpg";       // Заводи/Острова

// Изображения
let textureImg = null;
let forestTextureImg = null;
let fieldTextureImg = null;

let lakeImg = null;
let riverImg = null;
let greatRiverImg = null;
let loughImg = null;

// Флаги загрузки
let textureLoaded = false;
let forestTextureLoaded = false;
let fieldTextureLoaded = false;

let lakeLoaded = false;
let riverLoaded = false;
let greatRiverLoaded = false;
let loughLoaded = false;

// Паттерны (кешируем их, чтобы не пересоздавать каждый кадр)
let patterns = {
  paper: null,
  forest: null,
  field: null,
  lake: null,
  river: null,
  great_river: null,
  lough_river: null
};

if (typeof window !== "undefined") {
  // 1. Бумага
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = TEXTURE_PATH;
  img.onload = () => { textureImg = img; textureLoaded = true; };

  // 2. Лес
  const forestI = new Image();
  forestI.crossOrigin = "anonymous";
  forestI.src = FOREST_TEXTURE_PATH;
  forestI.onload = () => { forestTextureImg = forestI; forestTextureLoaded = true; };

  // 3. Поле
  const fieldI = new Image();
  fieldI.crossOrigin = "anonymous";
  fieldI.src = FIELD_TEXTURE_PATH;
  fieldI.onload = () => { fieldTextureImg = fieldI; fieldTextureLoaded = true; };

  // 4. Озеро
  const lakeI = new Image();
  lakeI.crossOrigin = "anonymous";
  lakeI.src = LAKE_TEXTURE_PATH;
  lakeI.onload = () => { lakeImg = lakeI; lakeLoaded = true; };

  // 5. Река
  const riverI = new Image();
  riverI.crossOrigin = "anonymous";
  riverI.src = RIVER_TEXTURE_PATH;
  riverI.onload = () => { riverImg = riverI; riverLoaded = true; };

  // 6. Великая река
  const greatI = new Image();
  greatI.crossOrigin = "anonymous";
  greatI.src = GREAT_RIVER_TEXTURE_PATH;
  greatI.onload = () => { greatRiverImg = greatI; greatRiverLoaded = true; };

  // 7. Заводи
  const loughI = new Image();
  loughI.crossOrigin = "anonymous";
  loughI.src = LOUGH_TEXTURE_PATH;
  loughI.onload = () => { loughImg = loughI; loughLoaded = true; };
}

// Палитра
const COLORS = {
  village:     "#E8DCCA",
  lake:        "#AEC6CF",
  river:       "#9BC4D4", // Чуть отличим цвет реки от озера
  great_river: "#8AAEC4", // Более глубокий синий
  lough_river: "#A4BFCB",
  island:      "#B8C9A5",
  forest:      "#B8C9A5",
  field:       "#B8C9A5",
  default:     "#F0E6D2"
};

function getTileImage(tile) {
  if (!tile) return null;
  return null;
}

// --- ФУНДАМЕНТ (ЦВЕТ + ТЕКСТУРА) ---
export function drawHexBase(ctx, x, y, size, tile) {
  if (!tile) return;

  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);

  // 1. Базовый цвет
  ctx.fillStyle = COLORS[tile.type] || COLORS.default;
  ctx.fill();

  // 2. Наложение текстуры (Multiply)
  ctx.globalCompositeOperation = "multiply";

  let activePattern = null;
  let alpha = 0.4;

  // --- ЛОГИКА ВЫБОРА ТЕКСТУРЫ ---

  // Острова теперь тоже считаем лесом
  if ((tile.type === 'forest' || tile.type === 'island') && forestTextureLoaded) {
    if (!patterns.forest) patterns.forest = createPatternSafe(ctx, forestTextureImg);
    activePattern = patterns.forest;
    alpha = 0.6; // Густой лес

  } else if (tile.type === 'field' && fieldTextureLoaded) {
    if (!patterns.field) patterns.field = createPatternSafe(ctx, fieldTextureImg);
    activePattern = patterns.field;
    alpha = 0.5;

  // --- ВОДА (ПОЛНОЕ РАЗДЕЛЕНИЕ) ---

  } else if (tile.type === 'lake' && lakeLoaded) {
    // Озеро
    if (!patterns.lake) patterns.lake = createPatternSafe(ctx, lakeImg);
    activePattern = patterns.lake;
    alpha = 0.5;

  } else if (tile.type === 'river' && riverLoaded) {
    // Река
    if (!patterns.river) patterns.river = createPatternSafe(ctx, riverImg);
    activePattern = patterns.river;
    alpha = 0.5;

  } else if (tile.type === 'great_river' && greatRiverLoaded) {
    // Великая река (Днепр)
    if (!patterns.great_river) patterns.great_river = createPatternSafe(ctx, greatRiverImg);
    activePattern = patterns.great_river;
    alpha = 0.7; // Более насыщенная текстура для глубины

  } else if (tile.type === 'lough_river' && loughLoaded) {
    // Заводи
    if (!patterns.lough_river) patterns.lough_river = createPatternSafe(ctx, loughImg);
    activePattern = patterns.lough_river;
    alpha = 0.55;

  } else if (textureLoaded) {
    // Бумага (дефолт)
    if (!patterns.paper) patterns.paper = createPatternSafe(ctx, textureImg);
    activePattern = patterns.paper;
    alpha = 0.4;
  }

  if (activePattern) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = activePattern;
    ctx.fill();
  }

  ctx.restore();
}

function createPatternSafe(ctx, img) {
  try {
    return ctx.createPattern(img, "repeat");
  } catch (e) {
    return null;
  }
}

// --- СЕТКА ---
export function drawHexNet(ctx, x, y, size) {
  ctx.save();
  ctx.beginPath();
  axialHexPath(ctx, x, y, size);
  ctx.strokeStyle = "rgba(139, 69, 19, 0.25)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

// --- ОБЪЕКТЫ ---
export function drawHexOverlay(ctx, x, y, size, tile) {
  if (!tile) return;

  const img = getTileImage(tile);
  if (img && img.complete && img.naturalWidth !== 0) {
    const hexScreenHeight = size * Math.sqrt(3);
    const sourceRefHeight = 512;
    const scale = hexScreenHeight / sourceRefHeight;
    const drawWidth = img.naturalWidth * scale;
    const drawHeight = img.naturalHeight * scale;

    ctx.save();
    ctx.drawImage(img, x - drawWidth / 2, y - drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }
}