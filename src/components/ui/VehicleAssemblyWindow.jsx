"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { PANEL_STYLES } from "../../styles/panelStyles";
import { SLOTS_LAYOUT, isPartCompatible } from "../../engine/vehicle/assemblyLogic"; // [NEW] Import logic

export default function VehicleAssemblyWindow({ onClose }) {
  const {
      assemblyTargetId, setAssemblyTargetId, getWorldObjectById, getObjectsAtActiveTile,
      installPartToVehicle, uninstallPartFromVehicle,
      windowSize, windowPosition, updateWindowPosition, updateWindowSize
  } = useGame();

  const targetObj = getWorldObjectById(assemblyTargetId);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableParts, setAvailableParts] = useState([]);

  // --- DRAG & RESIZE ---
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ w: 0, h: 0 });

  // Поиск запчастей
  useEffect(() => {
      if (!targetObj) return;
      const allObjects = getObjectsAtActiveTile();

      const parts = allObjects.filter(obj => {
          if (obj.uniqueId === targetObj.uniqueId) return false;
          return ['wheel', 'engine', 'part'].includes(obj.type);
      });
      setAvailableParts(parts);
  }, [targetObj, getObjectsAtActiveTile]);

  // Handlers
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
          const dx = e.clientX - dragRef.current.x;
          const dy = e.clientY - dragRef.current.y;
          updateWindowPosition({
              x: startPosRef.current.x + dx,
              y: startPosRef.current.y + dy
          });
      }
      if (isResizing) {
        const dx = e.clientX - dragRef.current.x;
        const dy = e.clientY - dragRef.current.y;
        updateWindowSize({
          width: Math.max(800, startSizeRef.current.w + dx),
          height: Math.max(500, startSizeRef.current.h + dy)
        });
      }
    };
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, windowSize, windowPosition, updateWindowPosition, updateWindowSize]);

  const startDrag = (e) => {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      setIsDragging(true);
      dragRef.current = { x: e.clientX, y: e.clientY };
      startPosRef.current = { x: windowPosition.x, y: windowPosition.y };
  };

  const startResize = (e) => {
      e.preventDefault();
      setIsResizing(true);
      dragRef.current = { x: e.clientX, y: e.clientY };
      startSizeRef.current = { w: windowSize.width, h: windowSize.height };
  };

  if (!targetObj) return null;

  const handleClose = () => {
      setAssemblyTargetId(null);
      if (onClose) onClose();
  };

  const handleInstall = (part) => {
      if (selectedSlot) {
          installPartToVehicle(targetObj.uniqueId, part, selectedSlot);
      }
  };

  const handleUninstall = () => {
      if (selectedSlot) {
          uninstallPartFromVehicle(targetObj.uniqueId, selectedSlot);
      }
  };

  const currentPart = targetObj.parts && targetObj.parts[selectedSlot];

  return (
    <div style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:200}}>
        <div style={{
            ...PANEL_STYLES.frame,
            width: windowSize.width,
            height: windowSize.height,
            transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)`,
            zIndex: 200,
            pointerEvents: 'auto'
        }}>

            <div style={PANEL_STYLES.header} onMouseDown={startDrag}>
                <div style={PANEL_STYLES.headerTitle}>
                    СХЕМА СБОРКИ: {targetObj.name}
                </div>
                <button onClick={handleClose} style={PANEL_STYLES.closeBtn}>✕</button>
            </div>

            <div style={{...PANEL_STYLES.contentPaper, display:'flex'}}>

                {/* Левая панель: Детали */}
                <div style={{
                    width: '280px',
                    borderRight: '1px solid #8d6e63',
                    padding: '10px',
                    overflowY: 'auto',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                    <div style={{
                        fontSize:'11px', fontWeight:'bold',
                        borderBottom:'2px solid #5d4037', paddingBottom:'4px', marginBottom:'5px',
                        color: '#3e2723'
                    }}>
                        СКЛАД (НАЙДЕНО НА ЛОКАЦИИ)
                    </div>

                    {availableParts.length === 0 ? (
                        <div style={{fontSize:'10px', color:'#8d6e63', fontStyle:'italic', textAlign:'center', marginTop:'20px'}}>
                            -- Деталей не обнаружено --
                            <br/>Положите детали на землю рядом с машиной.
                        </div>
                    ) : (
                        availableParts.map(part => {
                            // [FIX] Используем helper из логики
                            const isCompatible = selectedSlot ? isPartCompatible(selectedSlot, part) : false;

                            return (
                                <div key={part.uniqueId} style={{
                                    padding: '8px',
                                    background: '#fff',
                                    border: isCompatible ? '2px solid #2e7d32' : '1px solid #b0a390',
                                    borderRadius: '2px',
                                    fontSize: '11px',
                                    boxShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                                    opacity: selectedSlot && !isCompatible ? 0.5 : 1
                                }}>
                                    <div style={{fontWeight:'bold', color:'#3e2723'}}>{part.icon} {part.name}</div>
                                    <div style={{fontSize:'9px', color:'#666'}}>ID: {part.templateId}</div>

                                    {isCompatible && (
                                        <button
                                            onClick={() => handleInstall(part)}
                                            style={{
                                                marginTop:'6px', width:'100%',
                                                background:'#5d4037', color:'#eaddcf', border:'none',
                                                cursor:'pointer', fontSize:'10px', padding:'6px', fontWeight:'bold',
                                                boxShadow: '0 2px 0 #3e2723'
                                            }}
                                        >
                                            УСТАНОВИТЬ
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Центр: Схема */}
                <div style={{flex: 1, position: 'relative', overflow: 'hidden'}}>

                    <svg
                        viewBox="0 0 300 500"
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            height: '95%', width: 'auto',
                            opacity: 0.85,
                            filter: 'sepia(0.5) contrast(1.1)'
                        }}
                    >
                        <defs>
                            <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                                <rect width="2" height="4" transform="translate(0,0)" fill="rgba(0,0,0,0.05)"></rect>
                            </pattern>
                        </defs>

                        {/* ХОДОВАЯ */}
                        <path d="M 80 50 L 80 460 L 220 460 L 220 50" fill="none" stroke="#777" strokeWidth="6" strokeLinecap="round" />
                        <line x1="80" y1="120" x2="220" y2="120" stroke="#777" strokeWidth="4" />
                        <line x1="80" y1="430" x2="220" y2="430" stroke="#777" strokeWidth="4" />
                        <line x1="40" y1="120" x2="260" y2="120" stroke="#555" strokeWidth="3" strokeDasharray="5,2" />
                        <line x1="40" y1="360" x2="260" y2="360" stroke="#555" strokeWidth="3" strokeDasharray="5,2" />
                        <line x1="150" y1="120" x2="150" y2="360" stroke="#555" strokeWidth="2" />
                        <circle cx="150" cy="360" r="10" fill="#777" />

                        {/* КУЗОВ */}
                        <path
                            d="M 60 80 Q 60 50 100 45 L 200 45 Q 240 50 240 80 L 240 460 Q 240 480 200 480 L 100 480 Q 60 480 60 460 Z"
                            fill="none" stroke="#2b221b" strokeWidth="3"
                        />
                        <path d="M 65 140 Q 150 135 235 140" fill="none" stroke="#2b221b" strokeWidth="2" />
                        <path d="M 80 50 L 80 135" fill="none" stroke="#2b221b" strokeWidth="1" />
                        <path d="M 220 50 L 220 135" fill="none" stroke="#2b221b" strokeWidth="1" />
                        <path d="M 70 145 L 230 145 L 225 160 L 75 160 Z" fill="rgba(100,200,255,0.1)" stroke="#2b221b" strokeWidth="1" />
                        <rect x="65" y="170" width="170" height="280" rx="5" fill="url(#hatch)" stroke="#2b221b" strokeWidth="1" />
                        <circle cx="75" cy="50" r="8" fill="none" stroke="#2b221b" strokeWidth="2" />
                        <circle cx="225" cy="50" r="8" fill="none" stroke="#2b221b" strokeWidth="2" />
                        <rect x="130" y="475" width="40" height="10" fill="#2b221b" />
                        <line x1="30" y1="45" x2="30" y2="480" stroke="#8d6e63" strokeWidth="1" />
                        <line x1="25" y1="45" x2="35" y2="45" stroke="#8d6e63" strokeWidth="1" />
                        <line x1="25" y1="480" x2="35" y2="480" stroke="#8d6e63" strokeWidth="1" />
                        <text x="20" y="260" fill="#8d6e63" fontSize="8" transform="rotate(-90 20,260)" textAnchor="middle" style={{fontFamily:"monospace"}}>4025</text>
                    </svg>

                    {/* Слоты */}
                    {Object.entries(SLOTS_LAYOUT).map(([key, pos]) => {
                        const isSelected = selectedSlot === key;
                        const isInstalled = targetObj.parts && targetObj.parts[key];

                        const borderColor = isSelected ? '#d32f2f' : (isInstalled ? '#2e7d32' : '#5d4037');
                        const borderStyle = isInstalled || isSelected ? 'solid' : 'dashed';
                        const bgColor = isSelected ? 'rgba(211, 47, 47, 0.1)' : (isInstalled ? 'rgba(46, 125, 50, 0.1)' : 'rgba(255,255,255,0.5)');

                        return (
                            <div
                                key={key}
                                onClick={() => setSelectedSlot(key)}
                                style={{
                                    position: 'absolute',
                                    left: `${pos.x}%`, top: `${pos.y}%`,
                                    transform: 'translate(-50%, -50%)',
                                    width: '70px', height: '70px',

                                    border: `2px ${borderStyle} ${borderColor}`,
                                    backgroundColor: bgColor,

                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.1s',
                                    zIndex: 10
                                }}
                            >
                                <div style={{fontSize:'24px', textShadow:'0 1px 2px rgba(0,0,0,0.2)'}}>
                                    {isInstalled ? '✅' : '⚙️'}
                                </div>
                                <div style={{
                                    fontSize: '9px', fontWeight:'bold', marginTop:'4px',
                                    color: '#3e2723', background: 'rgba(255,255,255,0.8)',
                                    padding: '1px 3px', borderRadius: '2px',
                                    border: '1px solid #8d6e63'
                                }}>
                                    {pos.label}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Правая панель: Инфо */}
                <div style={{
                    width: '220px',
                    borderLeft: '1px solid #8d6e63',
                    padding: '15px',
                    backgroundColor: 'rgba(255,255,255,0.4)',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <div style={{fontSize:'12px', fontWeight:'bold', marginBottom:'10px', borderBottom:'1px solid #5d4037', paddingBottom:'5px', color:'#3e2723'}}>
                        СОСТОЯНИЕ УЗЛА
                    </div>

                    {selectedSlot ? (
                        <>
                            <div style={{marginBottom:'15px', color:'#d32f2f', fontWeight:'bold', fontSize:'13px'}}>
                                {SLOTS_LAYOUT[selectedSlot].label}
                            </div>

                            {currentPart ? (
                                <div style={{
                                    background:'#fff', padding:'10px', border:'1px solid #2e7d32',
                                    boxShadow:'1px 1px 3px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{fontSize:'11px', color:'#1b5e20', fontWeight:'bold'}}>УСТАНОВЛЕНО:</div>
                                    <div style={{margin:'5px 0', fontSize:'12px', fontWeight:'bold'}}>{currentPart.templateId}</div>
                                    <div style={{fontSize:'11px', marginTop:'5px'}}>Состояние: {currentPart.condition}%</div>

                                    <div style={{marginTop:'15px', display:'flex', flexDirection:'column', gap:'5px'}}>
                                        <button
                                            onClick={handleUninstall}
                                            style={{
                                                padding:'8px', background:'#ef5350', color:'#fff',
                                                border:'none', cursor:'pointer', fontWeight:'bold', fontSize:'11px',
                                                boxShadow: '0 2px 0 #b71c1c'
                                            }}
                                        >
                                            СНЯТЬ ДЕТАЛЬ
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{
                                    padding:'15px', border:'1px dashed #8d6e63', textAlign:'center', color:'#8d6e63', fontSize:'11px', fontStyle:'italic', background:'rgba(255,255,255,0.3)'
                                }}>
                                    Узел разобран.
                                    <br/><br/>
                                    Необходим монтаж компонента типа: <b>{SLOTS_LAYOUT[selectedSlot].type.toUpperCase()}</b>
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{textAlign:'center', marginTop:'50px', color:'#888', fontSize:'12px'}}>
                            Выберите узел на схеме для работы.
                        </div>
                    )}
                </div>

            </div>

            <div style={PANEL_STYLES.resizeHandle} onMouseDown={startResize}></div>
        </div>
    </div>
  );
}