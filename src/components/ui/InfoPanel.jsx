import React from 'react';
import PaperClock from './PaperClock';
import PlayerStatsHUD from './PlayerStatsHUD';

export default function InfoPanel({ gameTimeMinutes, stats }) {
  return (
    <div style={panelContainerStyle}>
      {/* Внутренняя светлая область */}
      <div style={innerContentStyle}>
        
        {/* Часы */}
        <div style={clockWrapperStyle}>
          <PaperClock gameTimeMinutes={gameTimeMinutes} />
        </div>

        {/* Разделитель */}
        <div style={separatorStyle}></div>

        {/* Статистика */}
        <div style={statsWrapperStyle}>
          <PlayerStatsHUD stats={stats} />
        </div>
        
      </div>
    </div>
  );
}

// --- СТИЛИ ---

const panelContainerStyle = {
  position: 'absolute', 
  top: 20, 
  right: 20, 
  zIndex: 50,
  display: 'flex', 
  flexDirection: 'column', 
  alignItems: 'center',
  width: '270px', // УВЕЛИЧЕННЫЙ РАЗМЕР, чтобы вместить увеличенные часы (220px)
  
  // Текстура дерева
  backgroundImage: `url('/textures/wood_dark.jpg')`, 
  backgroundSize: 'cover',
  backgroundColor: '#4E342E',
  
  borderRadius: '12px', 
  border: '4px solid #2d1b0e', 
  boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 2px 5px rgba(255,255,255,0.1)',
  padding: '16px',
};

const innerContentStyle = {
  width: '100%',
  // Бежевый фон (бумага)
  background: '#fdfbf7', 
  borderRadius: '8px',
  border: '2px solid #5D4037', // Внутренний кантик
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.15)'
};

const clockWrapperStyle = {
  // Часы занимают всю доступную ширину
  marginBottom: '10px',
  display: 'flex',
  justifyContent: 'center',
  width: '100%'
};

const statsWrapperStyle = {
  width: '100%',
  marginTop: '8px'
};

const separatorStyle = {
    width: '90%', 
    height: '2px', 
    background: '#8D6E63', 
    margin: '4px 0',
    opacity: 0.4
};