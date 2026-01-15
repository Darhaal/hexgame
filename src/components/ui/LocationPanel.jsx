"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "../../context/GameContext";
import { PANEL_STYLES } from "../../styles/panelStyles";
import ObjectActionMenu from "./ObjectActionMenu"; // [NEW]

const GRID_SIZE = 100;
const CELL_SIZE = 20;

export default function LocationPanel() {
  const {
    activeTile,
    isLocationOpen, setIsLocationOpen,
    getObjectsAtActiveTile,
    moveWorldObject, deleteWorldObject,
    isDeleteMode, setDeleteMode,
    isMoving,
    windowSize, updateWindowSize,
    windowPosition, updateWindowPosition
  } = useGame();

  const [localObjects, setLocalObjects] = useState([]);

  // UI States
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingMap, setIsDraggingMap] = useState(false);

  // Map States
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [draggedObjId, setDraggedObjId] = useState(null);
  const [hoveredObjId, setHoveredObjId] = useState(null);

  // [NEW] Меню действий
  const [actionMenu, setActionMenu] = useState(null); // { id, x, y }

  const dragStartRef = useRef({ x: 0, y: 0 });
  const winStartRef = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const mapStartRef = useRef({ x: 0, y: 0 });
  const objDragRef = useRef({ startX: 0, startY: 0, initialGridX: 0, initialGridY: 0 });
  const viewportRef = useRef(null);
  const scrollVelocity = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const stateRef = useRef({ zoom: 1, mapOffset: { x: 0, y: 0 }, windowSize: { width: 900, height: 600 } });

  useEffect(() => {
      stateRef.current.zoom = zoom;
      stateRef.current.mapOffset = mapOffset;
      stateRef.current.windowSize = windowSize;
  }, [zoom, mapOffset, windowSize]);

  // ... (getClampedOffset, checkCollision, findSmartPosition - same as before) ...
  // Я вставлю сокращенные версии для экономии места, так как логика не менялась
  const getClampedOffset = useCallback((x, y, currentZoom, winW, winH) => {
      const mapW = GRID_SIZE * CELL_SIZE * currentZoom;
      const mapH = GRID_SIZE * CELL_SIZE * currentZoom;
      const viewportH = winH - 40;
      let newX = x; let newY = y;
      if (mapW > winW) { const minX = winW - mapW; newX = Math.max(minX, Math.min(0, newX)); } else { newX = (winW - mapW) / 2; }
      if (mapH > viewportH) { const minY = viewportH - mapH; newY = Math.max(minY, Math.min(0, newY)); } else { newY = (viewportH - mapH) / 2; }
      return { x: newX, y: newY };
  }, []);
  const checkCollision = (targetX, targetY, ignoreId, w, h) => {
      if (targetX < 0 || targetY < 0 || targetX + w > GRID_SIZE || targetY + h > GRID_SIZE) return true;
      for (const obj of localObjects) {
          if (obj.uniqueId === ignoreId) continue;
          if (targetX < obj.x + (obj.width || 1) && targetX + w > obj.x && targetY < obj.y + (obj.height || 1) && targetY + h > obj.y) return true;
      }
      return false;
  };
  const findSmartPosition = (tx, ty, id, w, h) => {
      if (!checkCollision(tx, ty, id, w, h)) return { x: tx, y: ty };
      const maxRadius = 5;
      for (let r = 1; r <= maxRadius; r++) {
          for (let dx = -r; dx <= r; dx++) {
              for (let dy = -r; dy <= r; dy++) {
                   if (Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
                   if (!checkCollision(tx + dx, ty + dy, id, w, h)) return { x: tx + dx, y: ty + dy };
              }
          }
      }
      return null;
  };

  useEffect(() => {
    if (activeTile && isLocationOpen) {
      setLocalObjects(getObjectsAtActiveTile());
      setZoom(1);
      const initialX = (windowSize.width / 2) - ((GRID_SIZE * CELL_SIZE) / 2);
      const initialY = ((windowSize.height - 40) / 2) - ((GRID_SIZE * CELL_SIZE) / 2);
      setMapOffset(getClampedOffset(initialX, initialY, 1, windowSize.width, windowSize.height));
    }
  }, [activeTile, isLocationOpen]);

  // ... (Loop, Keyboard, Wheel - same as before) ...
  useEffect(() => {
      if (!isLocationOpen) return;
      const updateLoop = () => {
          const vx = scrollVelocity.current.x; const vy = scrollVelocity.current.y;
          if (vx !== 0 || vy !== 0) { setMapOffset(prev => getClampedOffset(prev.x - vx, prev.y - vy, stateRef.current.zoom, stateRef.current.windowSize.width, stateRef.current.windowSize.height)); }
          rafRef.current = requestAnimationFrame(updateLoop);
      };
      rafRef.current = requestAnimationFrame(updateLoop);
      return () => cancelAnimationFrame(rafRef.current);
  }, [isLocationOpen, getClampedOffset]);

  const handleWheel = (e) => {
      e.stopPropagation(); e.preventDefault();
      const rect = viewportRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left; const mouseY = e.clientY - rect.top;
      const worldX = (mouseX - mapOffset.x) / zoom; const worldY = (mouseY - mapOffset.y) / zoom;
      const scaleAmount = -e.deltaY * 0.002;
      const newZoom = Math.min(Math.max(zoom + scaleAmount, 0.5), 3.0);
      const newOffsetX = mouseX - (worldX * newZoom); const newOffsetY = mouseY - (worldY * newZoom);
      setZoom(newZoom);
      setMapOffset(getClampedOffset(newOffsetX, newOffsetY, newZoom, windowSize.width, windowSize.height));
  };

  // --- MOUSE HANDLERS (UPDATED for Click) ---
  const handleObjectMouseDown = (e, obj) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDeleteMode) { deleteWorldObject(obj.uniqueId); return; }

      // Сохраняем позицию клика, чтобы отличить клик от драга
      objDragRef.current = {
          startX: e.clientX, startY: e.clientY,
          initialGridX: obj.x, initialGridY: obj.y,
          isClickCandidate: true // [NEW] Флаг потенциального клика
      };

      if (obj.movable) {
          setDraggedObjId(obj.uniqueId);
      }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (isDraggingWindow) updateWindowPosition({ x: winStartRef.current.x + e.clientX - dragStartRef.current.x, y: winStartRef.current.y + e.clientY - dragStartRef.current.y });
      if (isResizing) {
          const newW = Math.max(600, winStartRef.current.w + e.clientX - dragStartRef.current.x);
          const newH = Math.max(400, winStartRef.current.h + e.clientY - dragStartRef.current.y);
          updateWindowSize({ width: newW, height: newH });
          setMapOffset(prev => getClampedOffset(prev.x, prev.y, zoom, newW, newH));
      }
      if (isDraggingMap) setMapOffset(getClampedOffset(mapStartRef.current.x + e.clientX - dragStartRef.current.x, mapStartRef.current.y + e.clientY - dragStartRef.current.y, zoom, windowSize.width, windowSize.height));

      if (draggedObjId) {
          const dx = Math.abs(e.clientX - objDragRef.current.startX);
          const dy = Math.abs(e.clientY - objDragRef.current.startY);

          // Если сдвинули больше чем на 3 пикселя, это уже не клик
          if (dx > 3 || dy > 3) {
              objDragRef.current.isClickCandidate = false;

              const z = stateRef.current.zoom;
              const deltaX = (e.clientX - objDragRef.current.startX) / z;
              const deltaY = (e.clientY - objDragRef.current.startY) / z;

              // Визуал
              const el = document.getElementById(`obj-${draggedObjId}`);
              if (el) el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

              // Коллизии
              const gridDX = Math.round(deltaX / CELL_SIZE); const gridDY = Math.round(deltaY / CELL_SIZE);
              const tX = objDragRef.current.initialGridX + gridDX; const tY = objDragRef.current.initialGridY + gridDY;
              const obj = localObjects.find(o => o.uniqueId === draggedObjId);
              const w = obj ? (obj.width || 1) : 1; const h = obj ? (obj.height || 1) : 1;
              const hasCol = checkCollision(tX, tY, draggedObjId, w, h);
              if (el) {
                  el.style.backgroundColor = hasCol ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 0, 0.2)';
                  el.style.borderColor = hasCol ? '#ef5350' : '#66bb6a';
              }
          }
      }
    };

    const handleUp = (e) => {
      // ОБРАБОТКА КЛИКА vs ДРАГА
      if (draggedObjId) {
          if (objDragRef.current.isClickCandidate) {
              // Это был клик!
              const rect = document.getElementById(`obj-${draggedObjId}`).getBoundingClientRect();
              setActionMenu({
                  id: draggedObjId,
                  x: rect.right + 10, // Позиция справа от объекта
                  y: rect.top
              });
              setDraggedObjId(null);
          } else {
              // Это был драг
              const z = stateRef.current.zoom;
              const deltaX = (e.clientX - objDragRef.current.startX)/zoom;
              const deltaY = (e.clientY - objDragRef.current.startY)/zoom;
              const gridDX = Math.round(deltaX / CELL_SIZE);
              const gridDY = Math.round(deltaY / CELL_SIZE);
              let tX = objDragRef.current.initialGridX + gridDX;
              let tY = objDragRef.current.initialGridY + gridDY;
              const obj = localObjects.find(o => o.uniqueId === draggedObjId);
              const w = obj ? (obj.width || 1) : 1; const h = obj ? (obj.height || 1) : 1;

              const finalPos = findSmartPosition(tX, tY, draggedObjId, w, h);
              if (finalPos) {
                  moveWorldObject(draggedObjId, finalPos.x, finalPos.y);
                  setLocalObjects(prev => prev.map(o => o.uniqueId === draggedObjId ? { ...o, x: finalPos.x, y: finalPos.y } : o));
              }
              const el = document.getElementById(`obj-${draggedObjId}`);
              if (el) { el.style.transform = "none"; el.style.backgroundColor = "#fff"; el.style.borderColor = "rgba(40,40,40,0.8)"; }
              setDraggedObjId(null);
          }
      }
      setIsDraggingWindow(false); setIsResizing(false); setIsDraggingMap(false);
    };

    if (isDraggingWindow || isResizing || isDraggingMap || draggedObjId || isLocationOpen) { window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', handleUp); }
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', handleUp); };
  }, [isDraggingWindow, isResizing, isDraggingMap, draggedObjId, windowSize, windowPosition, zoom, isLocationOpen, getClampedOffset]);

  // Handlers for window controls (drag, resize, close)
  const startDragWindow = (e) => { if(e.target.tagName !== 'BUTTON') { setIsDraggingWindow(true); dragStartRef.current = {x:e.clientX, y:e.clientY}; winStartRef.current = {x:windowPosition.x, y:windowPosition.y}; }};
  const startResize = (e) => { e.preventDefault(); setIsResizing(true); dragStartRef.current = {x:e.clientX, y:e.clientY}; winStartRef.current = {w:windowSize.width, h:windowSize.height}; };
  const startDragMap = (e) => {
      if (e.target.dataset.interactive) return;
      e.preventDefault(); setIsDraggingMap(true);
      dragStartRef.current = {x:e.clientX, y:e.clientY}; mapStartRef.current = {x:mapOffset.x, y:mapOffset.y};
      setActionMenu(null); // Закрыть меню при клике на карту
  };
  const handleRightClick = (e) => { e.preventDefault(); if (isDeleteMode) setDeleteMode(false); setActionMenu(null); };

  if (!isLocationOpen || !activeTile || isMoving) return null;

  return (
    <div style={containerStyle}>
        {/* [NEW] Меню действий */}
        {actionMenu && (
            <ObjectActionMenu
                objectId={actionMenu.id}
                position={{x: actionMenu.x, y: actionMenu.y}}
                onClose={() => setActionMenu(null)}
                zoom={zoom}
            />
        )}

        <div style={{
            ...PANEL_STYLES.frame,
            width: windowSize.width,
            height: windowSize.height,
            transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`
        }}>
            <div style={PANEL_STYLES.header} onMouseDown={startDragWindow}>
                <div style={PANEL_STYLES.headerTitle}>
                    {isDeleteMode ? <span style={{color:'#ef5350'}}>РЕЖИМ УДАЛЕНИЯ (ПКМ - ОТМЕНА)</span> : `ТОПОГРАФИЯ: ${activeTile.name}`}
                </div>
                <button onClick={() => setIsLocationOpen(false)} style={PANEL_STYLES.closeBtn}>✕</button>
            </div>

            <div
                ref={viewportRef}
                style={{
                    ...viewportStyle,
                    cursor: isDeleteMode ? 'crosshair' : 'grab',
                    borderColor: isDeleteMode ? '#ef5350' : '#b0a390'
                }}
                onMouseDown={startDragMap}
                onWheel={handleWheel}
                onContextMenu={handleRightClick}
            >
                {/* Сетка */}
                <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
                    backgroundPosition: `${mapOffset.x}px ${mapOffset.y}px`,
                    backgroundSize: `${CELL_SIZE * zoom}px ${CELL_SIZE * zoom}px`,
                    backgroundImage: `
                        linear-gradient(rgba(0, 100, 200, 0.2) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 100, 200, 0.2) 1px, transparent 1px)
                    `
                }} />

                <div style={{
                    position: 'absolute',
                    transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${zoom})`,
                    transformOrigin: 'top left',
                    width: `${GRID_SIZE * CELL_SIZE}px`,
                    height: `${GRID_SIZE * CELL_SIZE}px`,
                    zIndex: 2
                }}>
                    {localObjects.map(obj => (
                        <div
                            key={obj.uniqueId}
                            id={`obj-${obj.uniqueId}`}
                            onMouseDown={(e) => handleObjectMouseDown(e, obj)}
                            onMouseEnter={() => setHoveredObjId(obj.uniqueId)}
                            onMouseLeave={() => setHoveredObjId(null)}
                            data-interactive="true"
                            style={{
                                position: 'absolute',
                                left: obj.x * CELL_SIZE,
                                top: obj.y * CELL_SIZE,
                                width: (obj.width || 1) * CELL_SIZE,
                                height: (obj.height || 1) * CELL_SIZE,
                                cursor: isDeleteMode ? 'crosshair' : (obj.movable ? 'grab' : 'default'),
                                border: isDeleteMode ? '2px dashed #ef5350' : '2px solid rgba(20,20,20,0.8)',
                                background: isDeleteMode ? 'rgba(255,0,0,0.1)' : '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '2px 2px 0 rgba(0,0,0,0.1)',
                                boxSizing: 'border-box',
                                transition: draggedObjId === obj.uniqueId ? 'none' : 'transform 0.1s',
                                zIndex: (hoveredObjId === obj.uniqueId || draggedObjId === obj.uniqueId) ? 100 : 2
                            }}
                        >
                            <span style={{fontSize: '12px', filter: 'grayscale(1) contrast(1.5)'}}>{obj.icon}</span>

                            {/* Выноска */}
                            {hoveredObjId === obj.uniqueId && !isDeleteMode && draggedObjId !== obj.uniqueId && (
                                <div style={{
                                    position: 'absolute', top: 0, left: '100%', display: 'flex', alignItems: 'flex-start', pointerEvents: 'none', zIndex: 5
                                }}>
                                    <div style={{
                                        width: '15px', height: '1px', background: '#000080', transform: 'rotate(-30deg)', transformOrigin: 'bottom left', marginTop: '5px'
                                    }}></div>
                                    <div style={{
                                        borderBottom: '1px solid #000080', paddingLeft: '2px', paddingRight: '4px', transform: 'translate(-2px, -8px)'
                                    }}>
                                        <span style={{
                                            fontFamily: "'Courier New', monospace", fontSize: '10px', color: '#000080', fontWeight: 'bold', whiteSpace: 'nowrap',
                                            textShadow: '0 0 2px #fff, 0 0 4px #fff, 0 0 6px #fff'
                                        }}>
                                            {obj.name}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{
                        position: 'absolute',
                        left: (GRID_SIZE / 2) * CELL_SIZE,
                        top: (GRID_SIZE / 2) * CELL_SIZE,
                        transform: 'translate(-50%, -50%)',
                        border: '2px solid #b71c1c', borderRadius: '50%', zIndex: 10, width:'12px', height:'12px'
                    }} />
                </div>

                <div style={{position:'absolute', bottom: 5, right: 10, fontSize:'10px', color:'#555', fontWeight:'bold', pointerEvents:'none', zIndex: 20}}>
                    SCALE: {(zoom * 100).toFixed(0)}%
                </div>
            </div>
            <div style={PANEL_STYLES.resizeHandle} onMouseDown={startResize} />
        </div>
    </div>
  );
}

// --- СТИЛИ ---
const containerStyle = { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 150, overflow: 'hidden' };
const viewportStyle = { flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab', backgroundColor: '#fffdf5', border: "1px solid #b0a390", boxShadow: "inset 0 0 30px rgba(0,0,0,0.15)" };