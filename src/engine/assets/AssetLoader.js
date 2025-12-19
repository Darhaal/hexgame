// src/engine/assets/AssetLoader.js

const ASSET_PATHS = {
  // Текстуры ландшафта (drawHex)
  paper: "/textures/paper.jpg",
  forest: "/textures/forest.jpg",
  field: "/textures/field.jpg",
  shore: "/textures/shore.jpg",
  water: "/textures/water.jpg",
  lough_river: "/textures/lough_river.jpg",

  // Декор (drawBorder)
  wood_dark: "/textures/wood_dark.jpg",

  // Игрок (drawPlayer)
  player: "/player.png"
};

const assets = {};
let isLoaded = false;

export function getAsset(key) {
  return assets[key] || null;
}

export function areAssetsLoaded() {
  return isLoaded;
}

export async function initAssets() {
  if (isLoaded) return Promise.resolve();

  const promises = Object.entries(ASSET_PATHS).map(([key, src]) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";
      img.onload = () => {
        assets[key] = img;
        resolve();
      };
      img.onerror = (e) => {
        console.warn(`Failed to load asset: ${src}`, e);
        // Резолвим даже с ошибкой, чтобы игра не зависла, просто без текстуры
        assets[key] = null;
        resolve();
      };
    });
  });

  await Promise.all(promises);
  isLoaded = true;
  console.log("All assets loaded");
}