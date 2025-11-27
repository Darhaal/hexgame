// src/engine/draw/drawPlayer.js
/**
 * Draw the player icon centered on the tile.
 * Image is loaded once.
 */

import { axialToPixel } from "../hex/hexUtils";

let img = null;
let imgLoaded = false;

function loadImage() {
  if (img) return;
  if (typeof window === "undefined") return;
  img = new Image();
  img.src = "/player.png"; // place this in public/
  img.onload = () => { imgLoaded = true; };
  img.onerror = () => { console.error("Failed to load /player.png"); };
}

export function drawPlayer(ctx, pos, TILE_SIZE = 100) {
  loadImage();
  const { x, y } = axialToPixel(pos.q, pos.r, TILE_SIZE);
  ctx.save();
  ctx.translate(x, y);
  if (imgLoaded) {
    ctx.drawImage(img, -TILE_SIZE * 0.5, -TILE_SIZE * 0.5, TILE_SIZE, TILE_SIZE);
  } else {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, 0, TILE_SIZE * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}
