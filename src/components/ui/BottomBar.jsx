"use client";

import React from 'react';

export default function BottomBar({
  onOpenInventory,
  onOpenCharacter,
  onOpenSkills,
  onOpenJournal,
  activeTab,
  onClose
}) {

  const handleClick = (tabName, openFn) => {
    if (activeTab === tabName) {
      if (onClose) onClose();
    } else {
      if (openFn) openFn();
    }
  };

  return (
    <div style={barContainerStyle}>
      <div style={innerFrameStyle}>

        {/* Левая секция */}
        <div style={sectionStyle}>
          <MenuButton
            icon="🎒"
            label="РЮКЗАК"
            isActive={activeTab === 'inventory'}
            onClick={() => handleClick('inventory', onOpenInventory)}
          />
          <div style={separatorStyle}></div>
          <MenuButton
            icon="👤"
            label="РЫБОЛОВ"
            isActive={activeTab === 'character'}
            onClick={() => handleClick('character', onOpenCharacter)}
          />
        </div>

        {/* Центральный логотип */}
        <div style={logoWrapperStyle}>
           <div style={logoMainStyle}>ТИХАЯ ЗАВОДЬ</div>
           <div style={logoSubStyle}>КЛУБ ЛЮБИТЕЛЕЙ РЫБАЛКИ</div>
        </div>

        {/* Правая секция */}
        <div style={sectionStyle}>
          <MenuButton
            icon="⭐"
            label="НАВЫКИ"
            isActive={activeTab === 'skills'}
            onClick={() => handleClick('skills', onOpenSkills)}
          />
          <div style={separatorStyle}></div>
          <MenuButton
            icon="📓"
            label="ЗАМЕТКИ"
            isActive={activeTab === 'journal'}
            onClick={() => handleClick('journal', onOpenJournal)}
          />
        </div>

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
            backgroundColor: isActive ? '#5d4037' : 'transparent',
            color: isActive ? '#fff' : '#8c7b65',
          }}
        >
            <div style={{
              fontSize: '24px',
              marginBottom: '4px',
              filter: isActive ? 'none' : 'grayscale(1) opacity(0.6)'
            }}>{icon}</div>
            <div style={labelStyle}>{label}</div>
        </button>
    );
}
// --- СТИЛИ (Соответствие TilePanel) ---

const barContainerStyle = {
    position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
    width: '750px', height: '80px',
    zIndex: 100, pointerEvents: 'auto',
    perspective: '1000px'
};

const innerFrameStyle = {
    width: '100%', height: '100%',
    // Коричневая гамма (как TilePanel)
    backgroundColor: "#4a4036",
    backgroundImage: `
      linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%),
      repeating-linear-gradient(45deg, #4a4036 0, #4a4036 2px, #3e352d 2px, #3e352d 4px)
    `,
    border: '4px solid #2d241b',
    borderRadius: '4px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
    position: 'relative'
};

const sectionStyle = {
    display: 'flex', alignItems: 'center', gap: '5px'
};

const separatorStyle = {
    width: '2px', height: '40px', background: '#2d241b', margin: '0 10px',
    borderRight: '1px solid #5d4037'
};

const logoWrapperStyle = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: '#3e352d', padding: '5px 20px', borderRadius: '2px',
    border: '2px solid #2d241b',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
};

const logoMainStyle = { color: '#e3dac9', fontWeight: '900', fontSize: '18px', letterSpacing: '2px', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontFamily: "'Courier New', monospace" };
const logoSubStyle = { color: '#8c7b65', fontWeight: 'bold', fontSize: '10px', letterSpacing: '4px', marginTop: '-2px', fontFamily: "'Courier New', monospace" };

const btnStyle = {
    background: 'transparent', border: '1px solid transparent',
    borderRadius: '4px', width: '80px', height: '60px', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    transition: 'all 0.1s',
    outline: 'none'
};

const iconStyle = { fontSize: '24px', marginBottom: '4px', transition: 'filter 0.2s' };
const labelStyle = { fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', fontFamily: "'Courier New', monospace" };