// src/engine/camera.js

export function createCamera(bounds, tileSize) {
  const marginX = 2 * Math.sqrt(3) * tileSize;
  const marginY = 2 * 1.5 * tileSize;
  const expanded = {
    minX: bounds.minX - marginX,
    maxX: bounds.maxX + marginX,
    minY: bounds.minY - marginY,
    maxY: bounds.maxY + marginY,
  };

  return {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    hasMoved: false, // <--- НОВОЕ: запоминаем, двигали ли мы камеру
    dragStartX: 0,
    dragStartY: 0,
    expanded,
  };
}

export function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

export function computeMinScaleSym(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;
  const mapW = maxX - minX;
  const mapH = maxY - minY;
  return Math.max(canvas.width / mapW, canvas.height / mapH);
}

export function centerCamera(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  camera.offsetX = canvas.width / 2 - cx * camera.scale;
  camera.offsetY = canvas.height / 2 - cy * camera.scale;
}

export function clampCamera(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;
  const left = minX * camera.scale;
  const right = maxX * camera.scale;
  const top = minY * camera.scale;
  const bottom = maxY * camera.scale;
  const w = right - left;
  const h = bottom - top;

  if (w <= canvas.width) {
    camera.offsetX = (canvas.width - w) / 2 - left;
  } else {
    const min = canvas.width - right;
    const max = -left;
    if (camera.offsetX < min) camera.offsetX = min;
    if (camera.offsetX > max) camera.offsetX = max;
  }

  if (h <= canvas.height) {
    camera.offsetY = (canvas.height - h) / 2 - top;
  } else {
    const min = canvas.height - bottom;
    const max = -top;
    if (camera.offsetY < min) camera.offsetY = min;
    if (camera.offsetY > max) camera.offsetY = max;
  }
}

export function resetCamera(camera, canvas) {
  resizeCanvas(canvas);
  const minS = computeMinScaleSym(camera, canvas);
  camera.scale = minS;
  centerCamera(camera, canvas);
  clampCamera(camera, canvas);
}

/* Обработчики событий */

function onWheel(e, camera, canvas, draw) {
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  const old = camera.scale;
  const factor = e.deltaY > 0 ? 0.9 : 1.1;
  let next = old * factor;
  const minS = computeMinScaleSym(camera, canvas);
  const MAX = 4;
  if (next < minS) next = minS;
  if (next > MAX) next = MAX;
  const wx = (mx - camera.offsetX) / old;
  const wy = (my - camera.offsetY) / old;
  camera.scale = next;
  camera.offsetX = mx - wx * next;
  camera.offsetY = my - wy * next;
  clampCamera(camera, canvas);
  draw();
}

function pointerDown(e, camera, canvas) {
  canvas.setPointerCapture?.(e.pointerId);
  camera.dragging = true;
  camera.hasMoved = false; // <--- Сброс флага при нажатии
  camera.dragStartX = e.clientX - camera.offsetX;
  camera.dragStartY = e.clientY - camera.offsetY;
}

function pointerMove(e, camera, canvas, draw) {
  if (!camera.dragging) return;

  // Новая позиция
  const newOffsetX = e.clientX - camera.dragStartX;
  const newOffsetY = e.clientY - camera.dragStartY;

  // <--- ПРОВЕРКА: Если сдвинули хоть чуть-чуть, считаем это драгом, а не кликом
  if (Math.abs(newOffsetX - camera.offsetX) > 2 || Math.abs(newOffsetY - camera.offsetY) > 2) {
      camera.hasMoved = true;
  }

  camera.offsetX = newOffsetX;
  camera.offsetY = newOffsetY;
  clampCamera(camera, canvas);
  draw();
}

function pointerUp(e, camera, canvas) {
  camera.dragging = false;
  canvas.releasePointerCapture?.(e.pointerId);
}

export function initCameraEvents(canvas, camera, draw) {
  const d = (e) => pointerDown(e, camera, canvas);
  const m = (e) => pointerMove(e, camera, canvas, draw);
  const u = (e) => pointerUp(e, camera, canvas);
  const w = (e) => onWheel(e, camera, canvas, draw);

  // Исправление прыжка камеры: просто ресайз и ограничение границ
  const r = () => {
    resizeCanvas(canvas);
    clampCamera(camera, canvas);
    draw();
  };

  canvas.addEventListener("pointerdown", d);
  window.addEventListener("pointermove", m);
  window.addEventListener("pointerup", u);
  canvas.addEventListener("wheel", w, { passive: false });
  window.addEventListener("resize", r);

  return () => {
    canvas.removeEventListener("pointerdown", d);
    window.removeEventListener("pointermove", m);
    window.removeEventListener("pointerup", u);
    canvas.removeEventListener("wheel", w);
    window.removeEventListener("resize", r);
  };
}