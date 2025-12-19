import { axialToPixel } from "../hex/hexUtils";
import { formatGameTime, getTileCost } from "../time/timeModels";
import staticMapData from "../../data/mapData"; // Fallback static data

/**
 * Рисует путь (линии, кресты) и метки времени.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} path - Путь, включая текущую позицию игрока как первую точку.
 * @param {number} TILE_SIZE
 * @param {number} gameTime - Текущее игровое время (не используется для дельты, но может пригодиться).
 * @param {Array} mapData - Данные карты для точного расчета стоимости (опционально).
 * @param {string} vehicleId - ID транспорта для точного расчета (опционально, default 'none').
 */
export function drawPath(ctx, path, TILE_SIZE = 100, gameTime, mapData = null, vehicleId = 'none') {
  if (!path || path.length === 0) return;

  // ПАЛИТРА "CARDBOARD & LOW POLY"
  const STYLES = {
    PATH_COLOR: "#5D4037",      // Темно-коричневый (маркер)
    PATH_SHADOW: "rgba(255,255,255,0.4)", // Выдавленность (светлая)
    DEST_COLOR: "#C62828",      // Матовый красный (Крест)
    WAYPOINT_COLOR: "#F9A825",  // Матовый темно-желтый/охра (Стрелка)
    LABEL_BG: "#D7CCC8",        // Картон
    LABEL_BORDER: "#4E342E",    // Темный край
    LABEL_TEXT: "#3E2723",      // Текст
    TOTAL_TIME_COLOR: "#1B5E20" // Темно-зеленый для общего времени
  };

  ctx.save();
  ctx.lineCap = "butt";
  ctx.lineJoin = "miter";

  // Преобразуем координаты в пиксели
  const points = path.map(t => ({
      ...t,
      ...axialToPixel(t.q, t.r, TILE_SIZE)
  }));

  // 1. ОТРИСОВКА ЛИНИИ
  if (points.length > 1) {
      ctx.save();

      // Подложка (тень)
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y + 2);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y + 2);
      ctx.strokeStyle = STYLES.PATH_SHADOW;
      ctx.lineWidth = 5;
      ctx.setLineDash([15, 10]);
      ctx.stroke();

      // Основная линия
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = STYLES.PATH_COLOR;
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]);
      ctx.stroke();

      ctx.restore();
  }

  // 2. ОТРИСОВКА МАРКЕРОВ
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const isLast = i === points.length - 1;

    // СТАРТ (Игрок)
    if (i === 0) {
        if (points.length > 1) {
            const next = points[1];
            // Вычисляем угол к следующей точке
            const angle = Math.atan2(next.y - curr.y, next.x - curr.x);

            // Рисуем стрелку от игрока. Смещаем совсем немного, чтобы она была видна из-под аватара,
            // но не улетала на следующую клетку.
            // TILE_SIZE * 0.3 достаточно, чтобы выглянуть из-под круга игрока (радиус ~0.3-0.5 размера).
            const offset = TILE_SIZE * 0.3;
            const drawX = curr.x + Math.cos(angle) * offset;
            const drawY = curr.y + Math.sin(angle) * offset;

            drawLowPolyArrow(ctx, drawX, drawY, TILE_SIZE, angle, STYLES.WAYPOINT_COLOR);
        }
    }
    // ФИНИШ: Красный крест
    else if (isLast) {
        drawLowPolyCross(ctx, curr.x, curr.y, TILE_SIZE, STYLES.DEST_COLOR);
    }
    // ПРОМЕЖУТОЧНАЯ ТОЧКА: Желтая стрелка
    else if (curr.isWaypoint) {
        const next = points[i + 1];
        const angle = next ? Math.atan2(next.y - curr.y, next.x - curr.x) : 0;
        drawLowPolyArrow(ctx, curr.x, curr.y, TILE_SIZE, angle, STYLES.WAYPOINT_COLOR);
    }
  }

  // 3. ПЛАШКИ ВРЕМЕНИ
  drawDetailedTimeLabels(ctx, points, TILE_SIZE, STYLES, mapData, vehicleId);

  ctx.restore();
}

// --- ГЕОМЕТРИЧЕСКИЕ ФИГУРЫ ---

function drawLowPolyCross(ctx, x, y, size, color) {
    const r = size * 0.22;
    ctx.save();
    ctx.translate(x, y);

    // Тень
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    drawCrossShape(ctx, 3, 3, r * 0.7, 6);
    ctx.fill();

    // Крест
    ctx.fillStyle = color;
    ctx.strokeStyle = "#3E2723";
    ctx.lineWidth = 2;

    ctx.beginPath();
    drawCrossShape(ctx, 0, 0, r * 0.7, 6);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawCrossShape(ctx, dx, dy, size, thickness) {
    const s = size;
    const t = thickness;

    ctx.translate(dx, dy);
    ctx.rotate(Math.PI / 4);

    ctx.moveTo(-t, -s);
    ctx.lineTo(t, -s);
    ctx.lineTo(t, -t);
    ctx.lineTo(s, -t);
    ctx.lineTo(s, t);
    ctx.lineTo(t, t);
    ctx.lineTo(t, s);
    ctx.lineTo(-t, s);
    ctx.lineTo(-t, t);
    ctx.lineTo(-s, t);
    ctx.lineTo(-s, -t);
    ctx.lineTo(-t, -t);
    ctx.closePath();

    ctx.rotate(-Math.PI / 4);
    ctx.translate(-dx, -dy);
}

function drawLowPolyArrow(ctx, x, y, size, angle, color) {
    const scale = size * 0.25;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // Тень
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.moveTo(scale * 0.6 + 2, 0 + 2);
    ctx.lineTo(-scale * 0.5 + 2, scale * 0.5 + 2);
    ctx.lineTo(-scale * 0.3 + 2, 0 + 2);
    ctx.lineTo(-scale * 0.5 + 2, -scale * 0.5 + 2);
    ctx.fill();

    // Стрелка
    ctx.fillStyle = color;
    ctx.strokeStyle = "#3E2723";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(scale * 0.6, 0);
    ctx.lineTo(-scale * 0.5, scale * 0.5);
    ctx.lineTo(-scale * 0.3, 0);
    ctx.lineTo(-scale * 0.5, -scale * 0.5);
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

/**
 * Рисует метки времени: шаги и итог.
 * Логика динамического расчета оставшегося времени
 * на основе геометрии и РЕАЛЬНОЙ стоимости тайлов из mapData.
 */
function drawDetailedTimeLabels(ctx, points, TILE_SIZE, styles, mapData, vehicleId) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Используем переданную карту или fallback на статический импорт
  const data = mapData || staticMapData;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    const isLast = i === points.length - 1;

    // Пропускаем точки без данных о времени (если вдруг такие есть)
    if (curr.accumulatedTime === undefined) continue;

    // --- 1. МЕТКА ВРЕМЕНИ ШАГА (Статичная, между узлами) ---
    // Рисуем только если это не текущий активный шаг (т.е. если prev - это полноценный узел)
    if (prev.accumulatedTime !== undefined) {
        const stepTime = curr.accumulatedTime - prev.accumulatedTime;
        const stepH = Math.floor(stepTime / 60);
        const stepM = Math.floor(stepTime % 60);
        const stepStr = `+${stepH > 0 ? stepH + 'h' : ''}${stepM}m`;

        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;

        drawLabel(ctx, midX, midY, stepStr, styles, 18);
    }

    // --- 2. ОБЩЕЕ ОСТАВШЕЕСЯ ВРЕМЯ (Динамическое, над финишем) ---
    if (isLast) {
        let remainingMinutes = 0;

        // А. Статичная часть: Время от следующего узла (points[1]) до конца
        // Если путь > 1 точки (игрок + цель), то есть "статичный" хвост пути
        if (points.length > 1 && points[1].accumulatedTime !== undefined) {
             const timeFromNextToEnd = curr.accumulatedTime - points[1].accumulatedTime;
             remainingMinutes += timeFromNextToEnd;
        }

        // Б. Динамическая часть: Время для ТЕКУЩЕГО шага (от points[0] до points[1])
        if (points.length > 1) {
            const p0 = points[0]; // Игрок (текущая позиция)
            const p1 = points[1]; // Цель текущего шага

            // Дистанция в пикселях
            const distPixels = Math.hypot(p1.x - p0.x, p1.y - p0.y);
            // Полная дистанция шага между центрами гексов (Flat Top)
            const fullStepPixels = TILE_SIZE * Math.sqrt(3);

            // Доля пути, которую осталось пройти (0.0 - 1.0)
            const fraction = Math.min(1, Math.max(0, distPixels / fullStepPixels));

            // Определяем реальную стоимость шага через mapData
            const getT = (q, r) => data.find(t => t.q === q && t.r === r);

            // Текущий тайл (округляем координаты игрока)
            const t0 = getT(Math.round(p0.q), Math.round(p0.r));
            // Следующий тайл
            const t1 = getT(p1.q, p1.r);

            // Стоимость перемещения
            const cost0 = getTileCost(t0, vehicleId);
            const cost1 = getTileCost(t1, vehicleId);

            // Средняя стоимость шага (как в movementLogic)
            let stepCost = (cost0 + cost1) / 2;

            // Обработка "бесконечной" стоимости (вода без лодки)
            if (!Number.isFinite(stepCost)) {
                 stepCost = 10;
            }

            remainingMinutes += fraction * stepCost;
        } else {
            // Игрок уже в точке назначения (путь схлопнулся)
            remainingMinutes = 0;
        }

        const totalH = Math.floor(remainingMinutes / 60);
        const totalM = Math.floor(remainingMinutes % 60);

        // Показываем только если есть остаток
        if (remainingMinutes > 0) {
            const totalStr = `REMAINING: ${totalH > 0 ? totalH + 'h ' : ''}${totalM}m`;
            const totalY = curr.y - TILE_SIZE * 0.4;
            drawLabel(ctx, curr.x, totalY, totalStr, { ...styles, LABEL_TEXT: styles.TOTAL_TIME_COLOR }, 24);
        }
    }
  }
  ctx.restore();
}

function drawLabel(ctx, x, y, text, styles, fontSize) {
    ctx.save();
    ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
    const metrics = ctx.measureText(text);
    const paddingX = 6;
    const paddingY = 4;
    const boxW = metrics.width + paddingX * 2;
    const boxH = fontSize * 1.4;

    ctx.translate(x, y);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-boxW/2 + 3, -boxH/2 + 3, boxW, boxH);
    ctx.fillStyle = styles.LABEL_BG;
    ctx.fillRect(-boxW/2, -boxH/2, boxW, boxH);
    ctx.strokeStyle = styles.LABEL_BORDER;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-boxW/2, -boxH/2, boxW, boxH);
    ctx.fillStyle = styles.LABEL_TEXT;
    ctx.fillText(text, 0, 2);
    ctx.restore();
}