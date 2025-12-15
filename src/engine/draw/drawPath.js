import { axialToPixel } from "../hex/hexUtils";

export function drawPath(ctx, path, TILE_SIZE = 100) {
  if (!path || path.length === 0) return;

  // ПАЛИТРА "CARDBOARD & LOW POLY"
  const STYLES = {
    PATH_COLOR: "#5D4037",      // Темно-коричневый (маркер)
    PATH_SHADOW: "rgba(255,255,255,0.4)", // Выдавленность (светлая)
    DEST_COLOR: "#C62828",      // Матовый красный (Крест)
    WAYPOINT_COLOR: "#F9A825",  // Матовый темно-желтый/охра (Стрелка)
    LABEL_BG: "#D7CCC8",        // Картон
    LABEL_BORDER: "#4E342E",    // Темный край
    LABEL_TEXT: "#3E2723"       // Текст
  };

  ctx.save();
  ctx.lineCap = "butt"; // Жесткие концы линий для лоу-поли
  ctx.lineJoin = "miter";

  // Преобразуем координаты
  const points = path.map(t => ({
      ...t,
      ...axialToPixel(t.q, t.r, TILE_SIZE)
  }));

  // 1. ОТРИСОВКА ЛИНИИ
  if (points.length > 1) {
      ctx.save();

      // Подложка (светлая) для эффекта царапины на картоне
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y + 2);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y + 2);
      ctx.strokeStyle = STYLES.PATH_SHADOW;
      ctx.lineWidth = 5;
      ctx.setLineDash([15, 10]);
      ctx.stroke();

      // Основная линия (грубый маркер)
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      ctx.strokeStyle = STYLES.PATH_COLOR;
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 10]); // Пунктир
      ctx.stroke();

      ctx.restore();
  }

  // 2. ОТРИСОВКА МАРКЕРОВ
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const isLast = i === points.length - 1;

    // Не рисуем на старте
    if (i > 0) {
        if (isLast) {
            // --- ФИНИШ: КРЕСТ (Low Poly Style) ---
            drawLowPolyCross(ctx, curr.x, curr.y, TILE_SIZE, STYLES.DEST_COLOR);
        } else if (curr.isWaypoint) {
            // --- ПРОМЕЖУТОЧНАЯ ТОЧКА: СТРЕЛКА (Low Poly Style) ---
            const next = points[i + 1];
            const angle = Math.atan2(next.y - curr.y, next.x - curr.x);
            drawLowPolyArrow(ctx, curr.x, curr.y, TILE_SIZE, angle, STYLES.WAYPOINT_COLOR);
        }
    }
  }

  // 3. ПЛАШКИ ВРЕМЕНИ
  drawCardboardLabels(ctx, points, TILE_SIZE, STYLES);

  ctx.restore();
}

// Рисует Крест (Жесткий, вырезанный из бумаги)
function drawLowPolyCross(ctx, x, y, size, color) {
    const r = size * 0.22;
    ctx.save();
    ctx.translate(x, y);

    // Тень (жесткая, смещенная)
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    drawCrossShape(ctx, 3, 3, r * 0.7, 6);
    ctx.fill();

    // Сам крест
    ctx.fillStyle = color;
    ctx.strokeStyle = "#3E2723"; // Контур
    ctx.lineWidth = 2;

    ctx.beginPath();
    drawCrossShape(ctx, 0, 0, r * 0.7, 6);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

// Хелпер для формы креста (полигон)
function drawCrossShape(ctx, dx, dy, size, thickness) {
    const s = size;
    const t = thickness;

    ctx.translate(dx, dy);
    ctx.rotate(Math.PI / 4); // Поворот на 45 град (X)

    // Рисуем "плюс", но повернутый
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

// Рисует Стрелку (Треугольник)
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

    // Стрелка (плоская, без градиентов)
    ctx.fillStyle = color;
    ctx.strokeStyle = "#3E2723";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(scale * 0.6, 0);    // Нос
    ctx.lineTo(-scale * 0.5, scale * 0.5); // Левое крыло
    ctx.lineTo(-scale * 0.3, 0);   // Вырез
    ctx.lineTo(-scale * 0.5, -scale * 0.5); // Правое крыло
    ctx.closePath();

    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

// Рисует время (Кусочки картона)
function drawCardboardLabels(ctx, points, TILE_SIZE, styles) {
  ctx.save();
  // Шрифт моноширинный, как печатная машинка
  ctx.font = "bold 12px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 1; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];

    if (curr.accumulatedTime === undefined) continue;

    const h = Math.floor(curr.accumulatedTime / 60);
    const m = curr.accumulatedTime % 60;
    const timeStr = `+${h > 0 ? h + 'h ' : ''}${m}m`;

    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;

    const metrics = ctx.measureText(timeStr);
    const paddingX = 4;
    const boxW = metrics.width + paddingX * 2;
    const boxH = 18;

    ctx.translate(midX, midY);

    // Тень (жесткая)
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-boxW/2 + 2, -boxH/2 + 2, boxW, boxH);

    // Фон (Картонка)
    ctx.fillStyle = styles.LABEL_BG;
    ctx.fillRect(-boxW/2, -boxH/2, boxW, boxH);

    // Рамка
    ctx.strokeStyle = styles.LABEL_BORDER;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-boxW/2, -boxH/2, boxW, boxH);

    // Текст
    ctx.fillStyle = styles.LABEL_TEXT;
    ctx.fillText(timeStr, 0, 1);

    ctx.translate(-midX, -midY);
  }
  ctx.restore();
}