/**
 * Hex coordinate utilities.
 * Using "FLAT-TOP" axial coordinates (Плоский верх).
 */

/**
 * Convert axial q,r to pixel coordinates for FLAT TOP hexes.
 * @param {number} q
 * @param {number} r
 * @param {number} size - radius/size used by draw functions (defaults 100)
 * @returns {{x:number,y:number}}
 */
export function axialToPixel(q, r, size = 100) {
  // МАТЕМАТИКА ДЛЯ FLAT TOP
  // X = size * 3/2 * q
  // Y = size * sqrt(3) * (r + q/2)
  const x = size * (3 / 2) * q;
  const y = size * Math.sqrt(3) * (r + q / 2);
  return { x, y };
}

/**
 * Рисует путь (path) шестиугольника с ПЛОСКИМ ВЕРХОМ.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} size
 */
export function axialHexPath(ctx, x, y, size) {
  // Угол 60 градусов (PI/3)
  const angle = Math.PI / 3;

  // Для Flat Top начинаем с 0 градусов (0, 60, 120...),
  // в отличие от Pointy Top, где начинали с 30 (PI/6).
  for (let i = 0; i < 6; i++) {
    const a = angle * i;
    const px = x + size * Math.cos(a);
    const py = y + size * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

/**
 * Вспомогательная функция для перевода пикселей обратно в гексы (для кликов мыши).
 * Обновлена для Flat Top.
 */
export function pixelToAxial(x, y, size) {
  const q = ((2 / 3) * x) / size;
  const r = ((-1 / 3) * x + (Math.sqrt(3) / 3) * y) / size;
  return hexRound(q, r);
}

function hexRound(q, r) {
  let s = -q - r;
  let qi = Math.round(q);
  let ri = Math.round(r);
  let si = Math.round(s);
  const q_diff = Math.abs(qi - q);
  const r_diff = Math.abs(ri - r);
  const s_diff = Math.abs(si - s);
  if (q_diff > r_diff && q_diff > s_diff) {
    qi = -ri - si;
  } else if (r_diff > s_diff) {
    ri = -qi - si;
  }
  return { q: qi, r: ri };
}