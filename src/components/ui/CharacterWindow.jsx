"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { PANEL_STYLES } from "../../styles/panelStyles";

export default function CharacterWindow({ onClose }) {
  const { character, windowSize, updateWindowSize, windowPosition, updateWindowPosition } = useGame();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ x:0, y:0 });
  const startRef = useRef({ x:0, y:0, w:0, h:0 });

  useEffect(() => {
      const move = (e) => {
          if (isDragging) updateWindowPosition({ x: startRef.current.x + e.clientX - dragRef.current.x, y: startRef.current.y + e.clientY - dragRef.current.y });
          if (isResizing) updateWindowSize({ width: Math.max(400, startRef.current.w + e.clientX - dragRef.current.x), height: Math.max(300, startRef.current.h + e.clientY - dragRef.current.y) });
      };
      const up = () => { setIsDragging(false); setIsResizing(false); };
      if(isDragging || isResizing) { window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); }
      return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging, isResizing, windowSize, windowPosition]);

  const startDrag = (e) => { if(e.target.tagName !== 'BUTTON') { setIsDragging(true); dragRef.current = {x:e.clientX, y:e.clientY}; startRef.current = {x:windowPosition.x, y:windowPosition.y}; }};
  const startResize = (e) => { e.preventDefault(); setIsResizing(true); dragRef.current = {x:e.clientX, y:e.clientY}; startRef.current = {w:windowSize.width, h:windowSize.height}; };

  return (
    <div style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:150}}>
        <div style={{ ...PANEL_STYLES.frame, width: windowSize.width, height: windowSize.height, transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)` }}>

            <div style={PANEL_STYLES.header} onMouseDown={startDrag}>
                <div style={PANEL_STYLES.headerTitle}>ЛИЧНОЕ ДЕЛО</div>
                <button onClick={onClose} style={PANEL_STYLES.closeBtn}>✕</button>
            </div>

            <div style={{...PANEL_STYLES.contentPaper, flexDirection: 'column', padding: '20px'}}>
                <div style={{display:'flex', gap:'20px', borderBottom:'1px solid #aaa', paddingBottom:'20px'}}>
                    <div style={{width:'100px', height:'120px', border:'1px solid #333', display:'flex', alignItems:'center', justifyContent:'center', background:'#e0e0e0'}}>ФОТО</div>
                    <div>
                        <h2 style={{marginTop:0}}>{character.name || "НЕИЗВЕСТНЫЙ"}</h2>
                        <div style={{lineHeight:'1.8'}}>
                            <div>Звание: Любитель</div>
                            <div>Возраст: 35</div>
                            <div>Группа крови: II+</div>
                        </div>
                    </div>
                </div>
                <div style={{marginTop:'20px'}}>
                    <h3>ЗАМЕТКИ</h3>
                    <p style={{fontStyle:'italic'}}>Характер нордический. В связях, порочащих его, замечен не был.</p>
                </div>
            </div>

            <div style={PANEL_STYLES.resizeHandle} onMouseDown={startResize}></div>
        </div>
    </div>
  );
}