import { axialToPixel } from "../hex/hexUtils";
import { getAsset } from "../assets/AssetLoader";

export function drawPlayer(ctx, pos, TILE_SIZE = 100) {
  const { x, y } = axialToPixel(pos.q, pos.r, TILE_SIZE);
  ctx.save();
  ctx.translate(x, y);

  const iconSize = TILE_SIZE * 0.5;
  const img = getAsset('player');

  if (img) {
    ctx.drawImage(img, -iconSize, -iconSize, iconSize * 2, iconSize * 2);
  } else {
    // Fallback
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, 0, iconSize * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}