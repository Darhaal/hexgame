// src/engine/hex/hexUtils.js
/**
 * Hex coordinate utilities.
 * Using "pointy-top" axial coordinates.
 */

/**
 * Convert axial q,r to pixel coordinates.
 * @param {number} q
 * @param {number} r
 * @param {number} size - radius/size used by draw functions (defaults 100)
 * @returns {{x:number,y:number}}
 */
export function axialToPixel(q, r, size = 100) {
  const x = size * Math.sqrt(3) * (q + r / 2);
  const y = size * 1.5 * r;
  return { x, y };
}
