import React from 'react';
import { GAME_DAY_MINUTES, formatGameTime } from "../../engine/time/timeModels";

export default function PaperClock({ gameTimeMinutes }) {
  const rotation = (gameTimeMinutes / GAME_DAY_MINUTES) * 360;

  return (
    <div style={wrapperStyle}>
      <div style={dashboardFrameStyle}>

        {/* Фон циферблата */}
        <div style={dialFaceStyle}></div>

        {/* Индикатор Дня и Ночи (Секторный) */}
        <div style={{
             ...dayNightStripStyle,
             transform: `translateX(-50%) rotate(-${rotation.toFixed(2)}deg)`
        }}>
             <div style={stripInnerStyle}></div>
        </div>

        {/* Шкала */}
        <div style={{
            ...dialStyle,
            transform: `translateX(-50%) rotate(-${rotation.toFixed(2)}deg)`,
            transition: 'none'
        }}>
          {Array.from({length: 24}).map((_, i) => {
            const angle = (i / 24) * 360;
            const isMajor = i % 3 === 0; // Каждые 3 часа
            const isCardinal = i % 6 === 0; // 0, 6, 12, 18

            return (
              <div key={i} style={{
                  ...tickContainerStyle,
                  transform: `rotate(${angle}deg)`
              }}>
                <div style={{
                    ...tickMarkStyle,
                    height: isMajor ? '8px' : '4px',
                    width: isMajor ? '2px' : '1px',
                    background: isCardinal ? '#c23b22' : '#333' // Красные риски на главных часах
                }}></div>
                {isMajor && (
                    <span style={{
                        display: 'block',
                        position: 'absolute',
                        top: '12px',
                        left: '50%',
                        transform: `translate(-50%, 0) rotate(-${angle}deg) rotate(${rotation}deg)`,
                        fontSize: isCardinal ? '14px' : '10px',
                        fontWeight: 'bold',
                        color: '#222',
                        fontFamily: 'monospace'
                    }}>
                      {i}
                    </span>
                )}
              </div>
            );
          })}
        </div>

        <div style={needleStyle}></div>
        <div style={centerBoltStyle}></div>

        {/* Стекло с бликом */}
        <div style={glassOverlayStyle}></div>
      </div>

      {/* Цифровое табло (ЖК экран) */}
      <div style={digitalBoxStyle}>
        {formatGameTime(gameTimeMinutes)}
      </div>
    </div>
  );
}

// --- СТИЛИ ---

const wrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    width: '100%'
};

const dashboardFrameStyle = {
  width: 200, height: 100, // Чуть компактнее
  overflow: 'hidden', position: 'relative',
  borderRadius: '100px 100px 0 0',
  background: '#dcd6c5', // Старая эмаль
  border: '4px solid #1a1e1c',
  borderBottom: '2px solid #1a1e1c',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)'
};

const dialFaceStyle = {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(circle at 50% 100%, #f2efe4 0%, #bfb8a6 100%)', // Пожелтевший циферблат
};

const dayNightStripStyle = {
    position: 'absolute', top: 0, left: '50%', width: '200px', height: '200px',
    borderRadius: '50%', pointerEvents: 'none',
    transformOrigin: 'center center',
    opacity: 0.3
};

const stripInnerStyle = {
    width: '100%', height: '100%', borderRadius: '50%',
    background: `conic-gradient(
      #1a237e 0deg 90deg,
      transparent 90deg 315deg,
      #1a237e 315deg 360deg
    )` // Синий сектор ночи
};

const dialStyle = {
  position: 'absolute', top: 0, left: '50%', width: '200px', height: '200px',
  borderRadius: '50%', transformOrigin: 'center center'
};

const tickContainerStyle = {
    position: 'absolute', top: 0, left: '50%', width: 2, height: '50%',
    transformOrigin: 'bottom center',
    display: 'flex', justifyContent: 'center'
};

const tickMarkStyle = { marginTop: '2px' };

const needleStyle = {
    position: 'absolute', bottom: 0, left: '50%',
    width: 2, height: 85,
    background: '#c23b22', // Красная стрелка
    transform: 'translateX(-50%)',
    zIndex: 10,
    boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
};

const centerBoltStyle = {
    position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
    width: 12, height: 12, borderRadius: '50%',
    background: '#111', border: '1px solid #555', zIndex: 20
};

const glassOverlayStyle = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)',
    pointerEvents: 'none', borderRadius: '100px 100px 0 0', zIndex: 30,
    boxShadow: 'inset 0 5px 10px rgba(255,255,255,0.3)'
};

const digitalBoxStyle = {
    marginTop: 4,
    background: '#4a5d43', // Зеленый ЖК фон
    color: '#111', // Черные цифры (как на калькуляторе Электроника)
    padding: '2px 10px',
    borderRadius: '2px',
    fontFamily: 'monospace', fontSize: '16px', fontWeight: 'bold',
    border: '2px inset #3a4b3d',
    zIndex: 40,
    textShadow: '0 0 2px rgba(0,0,0,0.2)',
    letterSpacing: '2px'
};