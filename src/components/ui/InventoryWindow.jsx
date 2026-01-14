"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGame } from "../../context/GameContext";
import { PANEL_STYLES } from "../../styles/panelStyles";
import { getItemData } from "../../data/itemsData";

export default function InventoryWindow({ onClose }) {
  const { inventory, onUseItem, windowSize, updateWindowSize, windowPosition, updateWindowPosition } = useGame();

  const [selectedSlot, setSelectedSlot] = useState(null);

  // Drag & Resize Logic
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ x:0, y:0 });
  const startRef = useRef({ x:0, y:0, w:0, h:0 });

  // ... (Логика драга идентична LocationPanel, сокращаю для краткости, но она здесь есть)
  useEffect(() => {
      const move = (e) => {
          if (isDragging) updateWindowPosition({ x: startRef.current.x + e.clientX - dragRef.current.x, y: startRef.current.y + e.clientY - dragRef.current.y });
          if (isResizing) updateWindowSize({ width: Math.max(500, startRef.current.w + e.clientX - dragRef.current.x), height: Math.max(300, startRef.current.h + e.clientY - dragRef.current.y) });
      };
      const up = () => { setIsDragging(false); setIsResizing(false); };
      if(isDragging || isResizing) { window.addEventListener('mousemove', move); window.addEventListener('mouseup', up); }
      return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [isDragging, isResizing, windowSize, windowPosition]);

  const startDrag = (e) => { if(e.target.tagName !== 'BUTTON') { setIsDragging(true); dragRef.current = {x:e.clientX, y:e.clientY}; startRef.current = {x:windowPosition.x, y:windowPosition.y}; }};
  const startResize = (e) => { e.preventDefault(); setIsResizing(true); dragRef.current = {x:e.clientX, y:e.clientY}; startRef.current = {w:windowSize.width, h:windowSize.height}; };

  const selectedData = selectedSlot !== null && inventory[selectedSlot] ? getItemData(inventory[selectedSlot].itemId) : null;

  return (
    <div style={{position:'fixed', inset:0, pointerEvents:'none', zIndex:150}}>
        <div style={{ ...PANEL_STYLES.frame, width: windowSize.width, height: windowSize.height, transform: `translate(${windowPosition.x}px, ${windowPosition.y}px)` }}>

            <div style={PANEL_STYLES.header} onMouseDown={startDrag}>
                <div style={PANEL_STYLES.headerTitle}>СНАРЯЖЕНИЕ</div>
                <button onClick={onClose} style={PANEL_STYLES.closeBtn}>✕</button>
            </div>

            <div style={PANEL_STYLES.contentPaper}>
                {/* Список */}
                <div style={{flex:1, borderRight:'1px solid #8d6e63', padding:'10px', overflowY:'auto'}}>
                    {inventory.map((item, idx) => {
                        const data = item ? getItemData(item.itemId) : null;
                        return (
                            <div key={idx} onClick={() => setSelectedSlot(idx)}
                                style={{
                                    padding:'6px 10px', borderBottom:'1px dashed #ccc', cursor:'pointer', display:'flex', alignItems:'center',
                                    background: selectedSlot === idx ? 'rgba(0,0,0,0.05)' : 'transparent', fontWeight: selectedSlot === idx ? 'bold' : 'normal'
                                }}>
                                <span style={{width:'20px', color:'#888', fontSize:'10px'}}>{idx+1}.</span>
                                <span style={{marginRight:'10px'}}>{data?.icon || 'Empty'}</span>
                                <span style={{color: item ? '#000' : '#aaa'}}>{data?.name || "---"}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Детали */}
                <div style={{width:'35%', padding:'15px', display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.4)'}}>
                    {selectedData ? (
                        <>
                            <div style={{fontSize:'16px', fontWeight:'bold', borderBottom:'2px solid #333', marginBottom:'10px'}}>{selectedData.name}</div>
                            <div style={{fontSize:'64px', textAlign:'center', margin:'20px 0'}}>{selectedData.icon}</div>
                            <div style={{fontSize:'12px', fontStyle:'italic', flex:1}}>{selectedData.description}</div>
                            <button style={btnActionStyle}>ИСПОЛЬЗОВАТЬ</button>
                        </>
                    ) : <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#999'}}>ВЫБЕРИТЕ ПРЕДМЕТ</div>}
                </div>
            </div>

            <div style={PANEL_STYLES.resizeHandle} onMouseDown={startResize}></div>
        </div>
    </div>
  );
}

const btnActionStyle = { padding:'10px', background:'#2F3532', color:'#fff', border:'none', cursor:'pointer', fontWeight:'bold', marginTop:'10px' };