// src/engine/camera.js

function dispatchCameraChange(camera) {
  if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('camera-change', {
          detail: { x: camera.offsetX, y: camera.offsetY }
      }));
  }
}

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
    hasMoved: false,
    dragStartX: 0,
    dragStartY: 0,
    expanded,
    disableInput: false // [NEW] Флаг отключения ввода
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
  dispatchCameraChange(camera);
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
  dispatchCameraChange(camera);
}

function onWheel(e, camera, canvas, draw) {
  if (camera.disableInput) return; // [FIX] Блокировка зума
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
  dispatchCameraChange(camera);
  draw();
}

function pointerDown(e, camera, canvas) {
  if (camera.disableInput) return; // [FIX]
  canvas.setPointerCapture?.(e.pointerId);
  camera.dragging = true;
  camera.hasMoved = false;
  camera.dragStartX = e.clientX - camera.offsetX;
  camera.dragStartY = e.clientY - camera.offsetY;
}

function pointerMove(e, camera, canvas, draw) {
  if (camera.disableInput || !camera.dragging) return; // [FIX]

  const newOffsetX = e.clientX - camera.dragStartX;
  const newOffsetY = e.clientY - camera.dragStartY;

  if (Math.abs(newOffsetX - camera.offsetX) > 2 || Math.abs(newOffsetY - camera.offsetY) > 2) {
      camera.hasMoved = true;
  }

  camera.offsetX = newOffsetX;
  camera.offsetY = newOffsetY;
  clampCamera(camera, canvas);
  dispatchCameraChange(camera);
  draw();
}

function pointerUp(e, camera, canvas) {
  camera.dragging = false;
  canvas.releasePointerCapture?.(e.pointerId);
}

// [UPDATE] Добавлен аргумент disableControls
export function initCameraEvents(canvas, camera, draw, disableControls = false) {
  camera.disableInput = disableControls; // Синхронизируем состояние

  const d = (e) => pointerDown(e, camera, canvas);
  const m = (e) => pointerMove(e, camera, canvas, draw);
  const u = (e) => pointerUp(e, camera, canvas);
  const w = (e) => onWheel(e, camera, canvas, draw);

  const r = () => {
    resizeCanvas(canvas);
    clampCamera(camera, canvas);
    draw();
    dispatchCameraChange(camera);
  };

  const input = {
    keys: { w: false, a: false, s: false, d: false, equal: false, minus: false },
    mouse: { x: -1, y: -1 }
  };

  const onKeyDown = (e) => {
     if(camera.disableInput) return; // [FIX]
     if(e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
     const key = e.key.toLowerCase();
     if(key === 'w') input.keys.w = true;
     if(key === 'a') input.keys.a = true;
     if(key === 's') input.keys.s = true;
     if(key === 'd') input.keys.d = true;
     if(e.key === '+' || e.key === '=') input.keys.equal = true;
     if(e.key === '-' || e.key === '_') input.keys.minus = true;
  };

  const onKeyUp = (e) => {
     const key = e.key.toLowerCase();
     if(key === 'w') input.keys.w = false;
     if(key === 'a') input.keys.a = false;
     if(key === 's') input.keys.s = false;
     if(key === 'd') input.keys.d = false;
     if(e.key === '+' || e.key === '=') input.keys.equal = false;
     if(e.key === '-' || e.key === '_') input.keys.minus = false;
  };

  let rafId;
  const updateLoop = () => {
     if (!camera.disableInput) { // [FIX] Логика работает только если ввод разрешен
         let changed = false;
         const panSpeed = 15;
         const zoomSpeed = 0.02;

         if (input.keys.w) { camera.offsetY += panSpeed; changed = true; }
         if (input.keys.s) { camera.offsetY -= panSpeed; changed = true; }
         if (input.keys.a) { camera.offsetX += panSpeed; changed = true; }
         if (input.keys.d) { camera.offsetX -= panSpeed; changed = true; }

         if (input.keys.equal || input.keys.minus) {
             const factor = input.keys.equal ? (1 + zoomSpeed) : (1 - zoomSpeed);
             const oldScale = camera.scale;
             let nextScale = oldScale * factor;
             const minS = computeMinScaleSym(camera, canvas);
             const MAX = 4;
             if (nextScale < minS) nextScale = minS;
             if (nextScale > MAX) nextScale = MAX;

             if (nextScale !== oldScale) {
                 const cx = canvas.width / 2;
                 const cy = canvas.height / 2;
                 const wx = (cx - camera.offsetX) / oldScale;
                 const wy = (cy - camera.offsetY) / oldScale;
                 camera.scale = nextScale;
                 camera.offsetX = cx - wx * nextScale;
                 camera.offsetY = cy - wy * nextScale;
                 changed = true;
             }
         }

         if (changed) {
             clampCamera(camera, canvas);
             dispatchCameraChange(camera);
         }
     }
     rafId = requestAnimationFrame(updateLoop);
  };

  canvas.addEventListener("pointerdown", d);
  window.addEventListener("pointermove", m);
  window.addEventListener("pointerup", u);
  canvas.addEventListener("wheel", w, { passive: false });
  window.addEventListener("resize", r);

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);

  rafId = requestAnimationFrame(updateLoop);

  return () => {
    canvas.removeEventListener("pointerdown", d);
    window.removeEventListener("pointermove", m);
    window.removeEventListener("pointerup", u);
    canvas.removeEventListener("wheel", w);
    window.removeEventListener("resize", r);
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("keyup", onKeyUp);
    cancelAnimationFrame(rafId);
  };
}