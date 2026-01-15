"use client";

import React, { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";

const cardStyle = {
    position: 'absolute', width: '200px',
    backgroundColor: '#e3dac9', border: '1px solid #5d4037', borderRadius: '2px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
    fontFamily: "'Courier New', monospace", zIndex: 1000, pointerEvents: 'auto',
    backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`
};
const headerStyle = { backgroundColor: '#3e2723', color: '#fff', padding: '4px 8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const contentStyle = { padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' };
const btnStyle = { background: '#fff', border: '1px solid #8d6e63', padding: '6px', fontSize: '11px', fontWeight: 'bold', color: '#3e2723', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '1px 1px 0 rgba(0,0,0,0.1)', transition: 'background 0.1s' };

export default function ObjectActionMenu({ objectId, position, onClose, zoom }) {
  const { getWorldObjectById, modifyStat, setAssemblyTargetId } = useGame();
  const [objectData, setObjectData] = useState(null);

  useEffect(() => {
      if (objectId) setObjectData(getWorldObjectById(objectId));
  }, [objectId, getWorldObjectById]);

  if (!objectData) return null;

  const handleEat = () => { modifyStat('food', 20); onClose(); };
  const handleDrink = () => { modifyStat('water', 20); onClose(); };
  const handleSleep = () => { modifyStat('fatigue', 50); onClose(); };

  const handleAssemble = () => {
      setAssemblyTargetId(objectId);
      onClose();
  };

  const renderActions = () => {
      if (objectData.type === 'structure') {
          return (
              <>
                  <button style={btnStyle} onClick={handleEat}>🍞 ПОЕСТЬ</button>
                  <button style={btnStyle} onClick={handleDrink}>💧 ПОПИТЬ</button>
                  <button style={btnStyle} onClick={handleSleep}>💤 ПОСПАТЬ</button>
              </>
          );
      }

      if (objectData.type === 'vehicle_body' || objectData.type === 'vehicle' || objectData.type === 'car') {
          return (
              <>
                  <button style={btnStyle} onClick={() => alert("Багажник пуст")}>🎒 БАГАЖНИК</button>
                  <button style={btnStyle} onClick={handleAssemble}>🛠️ СБОРКА / РЕМОНТ</button>
                  <button style={btnStyle}>🔑 СЕСТЬ ЗА РУЛЬ</button>
              </>
          );
      }
      return <button style={btnStyle} onClick={() => alert(objectData.description)}>👁️ ОСМОТРЕТЬ</button>;
  };

  return (
    <div style={{...cardStyle, left: position.x + 20, top: position.y - 20}}>
        <div style={headerStyle}>
            <span>{objectData.name}</span>
            <button onClick={onClose} style={{background:'none', border:'none', color:'#ef5350', cursor:'pointer'}}>✕</button>
        </div>
        <div style={contentStyle}>
            <div style={{fontSize:'10px', color:'#5d4037', marginBottom:'5px', fontStyle:'italic'}}>{objectData.description}</div>
            {renderActions()}
        </div>
        <div style={{position:'absolute', top:'-10px', left:'10px', width:'8px', height:'20px', border:'2px solid #555', borderRadius:'10px', zIndex:1001}}></div>
    </div>
  );
}