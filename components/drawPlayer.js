import { axialToPixel } from "./hexUtils.js";

let img = null;
let imgLoaded = false;

// Загружаем картинку один раз
function loadImage() {
  if (img) return; // уже загружена или в процессе

  img = new Image();
  img.src = "/player.png";   // файл должен лежать в public/
  img.onload = () => {
    imgLoaded = true;
  };
  img.onerror = () => {
    console.error("Failed to load /player.png");
  };
}

export function drawPlayer(ctx, pos, TILE_SIZE) {
  loadImage();

  const { x, y } = axialToPixel(pos.q, pos.r, TILE_SIZE);

  ctx.save();
  ctx.translate(x, y);

  if (imgLoaded) {
    ctx.drawImage(
      img,
      -TILE_SIZE * 0.5,
      -TILE_SIZE * 0.5,
      TILE_SIZE,
      TILE_SIZE
    );
  } else {
    // запасной кружок пока картинка грузится
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(0, 0, TILE_SIZE * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
