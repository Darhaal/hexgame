"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { PANEL_STYLES } from "../../styles/panelStyles";

export default function SkillsWindow({ onClose }) {
  const { skills, upgradeSkill, windowSize, updateWindowSize, windowPosition, updateWindowPosition } = useGame();
  
  // Drag logic (copy-paste for stability)
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
                <div style={PANEL_STYLES.headerTitle}>КВАЛИФИКАЦИЯ</div>
                <button onClick={onClose} style={PANEL_STYLES.closeBtn}>✕</button>
            </div>

            <div style={{...PANEL_STYLES.contentPaper, padding: '20px', flexDirection:'column', overflowY:'auto'}}>
                {Object.entries(skills).map(([key, skill]) => (
                    <div key={key} style={{border:'1px solid #aaa', padding:'10px', marginBottom:'10px', background:'rgba(255,255,255,0.5)'}}>
                        <div style={{display:'flex', justifyContent:'space-between', fontWeight:'bold'}}>
                            <span>{skill.icon || '🔹'} {skill.name || key}</span>
                            <span>LVL {skill.level}</span>
                        </div>
                        <div style={{fontSize:'12px', marginTop:'5px'}}>{skill.description || "..."}</div>
                        <div style={{width:'100%', background:'#ccc', height:'6px', marginTop:'8px', borderRadius:'3px'}}>
                            <div style={{width:`${skill.xp}%`, background:'#5d4037', height:'100%', borderRadius:'3px'}}></div>
                        </div>
                        <div style={{textAlign:'right', fontSize:'10px', marginTop:'2px'}}>{skill.xp} / 100 XP</div>
                    </div>
                ))}
            </div>

            <div style={PANEL_STYLES.resizeHandle} onMouseDown={startResize}></div>
        </div>
    </div>
  );
}