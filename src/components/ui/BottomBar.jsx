"use client";

import React from 'react';
import { useGame } from "../../context/GameContext"; // Импортируем контекст, чтобы управлять локацией напрямую

export default function BottomBar({
  onOpenInventory,
  onOpenCharacter,
  onOpenSkills,
  activeWindow,
  onClose
}) {
  const { setIsLocationOpen, isLocationOpen } = useGame();

  const handleLocationClick = () => {
      if (isLocationOpen) {
          setIsLocationOpen(false); // Закрыть если открыта
      } else {
          if (onClose) onClose(); // Закрыть другие окна
          setIsLocationOpen(true); // Открыть локацию
      }
  };

  const handleClick = (windowId, openFn) => {
    if (activeWindow === windowId) {
      if (onClose) onClose();
    } else {
      setIsLocationOpen(false); // Закрываем локацию при открытии меню
      if (openFn) openFn();
    }
  };

  // Определяем активную кнопку
  const currentActive = isLocationOpen ? 'location' : activeWindow;

  return (
    <div style={barContainerStyle}>
      {/* Левая группа */}
      <div style={groupStyle}>
          <MenuButton
            icon="📍" label="ЛОКАЦИЯ"
            isActive={currentActive === 'location'}
            onClick={handleLocationClick}
          />
          <MenuButton
            icon="🎒" label="ВЕЩИ"
            isActive={currentActive === 'inventory'}
            onClick={() => handleClick('inventory', onOpenInventory)}
          />
      </div>

      {/* Центр */}
      <div style={logoStyle}>
          <div style={{fontSize:'14px', fontWeight:'900', color:'#e3dac9'}}>ТИХАЯ ЗАВОДЬ</div>
          <div style={{fontSize:'9px', color:'#777'}}>СИМУЛЯТОР</div>
      </div>

      {/* Правая группа */}
      <div style={groupStyle}>
          <MenuButton
            icon="👤" label="ПРОФИЛЬ"
            isActive={currentActive === 'character'}
            onClick={() => handleClick('character', onOpenCharacter)}
          />
          <MenuButton
            icon="⭐" label="НАВЫКИ"
            isActive={currentActive === 'skills'}
            onClick={() => handleClick('skills', onOpenSkills)}
          />
      </div>
    </div>
  );
}

function MenuButton({ icon, label, onClick, isActive }) {
    return (
        <button
          onClick={onClick}
          style={{
            ...btnStyle,
            backgroundColor: isActive ? '#3e4441' : 'transparent',
            color: isActive ? '#fff' : '#8c9c95',
            border: isActive ? '1px solid #5d6d65' : '1px solid transparent'
          }}
        >
            <span style={{fontSize: '20px', marginBottom:'2px'}}>{icon}</span>
            <span style={{fontSize: '10px', fontWeight:'bold'}}>{label}</span>
        </button>
    );
}

const barContainerStyle = {
    position: 'absolute', bottom: 15, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: '20px',
    padding: '8px 20px',
    backgroundColor: '#2F3532',
    border: '2px solid #1a1e1c',
    borderRadius: '4px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
    pointerEvents: 'auto',
    zIndex: 100
};

const groupStyle = { display: 'flex', gap: '5px' };

const logoStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '0 15px', borderLeft: '1px solid #444', borderRight: '1px solid #444',
    fontFamily: "'Courier New', monospace"
};

const btnStyle = {
    background: 'transparent',
    borderRadius: '4px', width: '60px', height: '50px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.1s', fontFamily: "'Courier New', monospace"
};