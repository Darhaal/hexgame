// src/engine/draw/drawHex.js
/**
 * Draw a single hex with soft inner gradient + stroke.
 */

function hexPath(ctx, x, y, size) {
  const angle = Math.PI / 3;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = angle * i + Math.PI / 6; // pointy top
    const px = x + size * Math.cos(a);
    const py = y + size * Math.sin(a);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function drawHex(ctx, x, y, size, color = "#888") {
  ctx.save();
  hexPath(ctx, x, y, size);
  ctx.fillStyle = color;
  ctx.fill();

  // inner soft radial gradient for depth
  const inner = size * 0.65;
  const gradient = ctx.createRadialGradient(x, y, inner, x, y, size);
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.45)");
  hexPath(ctx, x, y, size);
  ctx.fillStyle = gradient;
  ctx.fill();

  // thin semi-transparent stroke
  hexPath(ctx, x, y, size);
  ctx.strokeStyle = "rgba(0,0,0,0.45)";
  ctx.lineWidth = size * 0.025;
  ctx.stroke();
  ctx.restore();
}
