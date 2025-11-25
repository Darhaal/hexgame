// camera.js
// Behaviour EXACTLY like original HexMap:
// - symmetric min scale
// - expanded bounds
// - clamp identical to old logic
// - pointer drag
// - wheel zoom around cursor
// - reset on resize

/* ----------------------------------------------------
   Create camera object with expandedBounds
---------------------------------------------------- */
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
    dragStartX: 0,
    dragStartY: 0,

    expanded,
  };
}

/* ----------------------------------------------------
   Canvas resize
---------------------------------------------------- */
export function resizeCanvas(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

/* ----------------------------------------------------
   Symmetric min scale (identical to HexMap)
---------------------------------------------------- */
export function computeMinScaleSym(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;

  const mapW = maxX - minX;
  const mapH = maxY - minY;

  return Math.max(canvas.width / mapW, canvas.height / mapH);
}

/* ----------------------------------------------------
   Center camera (exact HexMap center logic)
---------------------------------------------------- */
export function centerCamera(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  camera.offsetX = canvas.width / 2 - cx * camera.scale;
  camera.offsetY = canvas.height / 2 - cy * camera.scale;
}

/* ----------------------------------------------------
   Clamp camera EXACTLY like HexMap
---------------------------------------------------- */
export function clampCamera(camera, canvas) {
  const { minX, maxX, minY, maxY } = camera.expanded;

  const left = minX * camera.scale;
  const right = maxX * camera.scale;
  const top = minY * camera.scale;
  const bottom = maxY * camera.scale;

  const w = right - left;
  const h = bottom - top;

  // horizontally
  if (w <= canvas.width) {
    camera.offsetX = (canvas.width - w) / 2 - left;
  } else {
    const min = canvas.width - right;
    const max = -left;
    if (camera.offsetX < min) camera.offsetX = min;
    if (camera.offsetX > max) camera.offsetX = max;
  }

  // vertically
  if (h <= canvas.height) {
    camera.offsetY = (canvas.height - h) / 2 - top;
  } else {
    const min = canvas.height - bottom;
    const max = -top;
    if (camera.offsetY < min) camera.offsetY = min;
    if (camera.offsetY > max) camera.offsetY = max;
  }
}

/* ----------------------------------------------------
   Reset camera (fit map)
---------------------------------------------------- */
export function resetCamera(camera, canvas) {
  resizeCanvas(canvas);

  const minS = computeMinScaleSym(camera, canvas);
  camera.scale = minS;

  centerCamera(camera, canvas);
  clampCamera(camera, canvas);
}

/* ----------------------------------------------------
   Mouse wheel zoom (identical)
---------------------------------------------------- */
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

/* ----------------------------------------------------
   Pointer drag (same behaviour)
---------------------------------------------------- */
function pointerDown(e, camera, canvas) {
  canvas.setPointerCapture?.(e.pointerId);
  camera.dragging = true;
  camera.dragStartX = e.clientX - camera.offsetX;
  camera.dragStartY = e.clientY - camera.offsetY;
}

function pointerMove(e, camera, canvas, draw) {
  if (!camera.dragging) return;
  camera.offsetX = e.clientX - camera.dragStartX;
  camera.offsetY = e.clientY - camera.dragStartY;

  clampCamera(camera, canvas);
  draw();
}

function pointerUp(e, camera, canvas) {
  camera.dragging = false;
  canvas.releasePointerCapture?.(e.pointerId);
}

/* ----------------------------------------------------
   Init camera interactions
---------------------------------------------------- */
export function initCameraEvents(canvas, camera, draw) {
  const d = (e) => pointerDown(e, camera, canvas);
  const m = (e) => pointerMove(e, camera, canvas, draw);
  const u = (e) => pointerUp(e, camera, canvas);
  const w = (e) => onWheel(e, camera, canvas, draw);
  const r = () => {
    resetCamera(camera, canvas);
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
