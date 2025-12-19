import React from 'react';
import { GAME_DAY_MINUTES, formatGameTime } from "../../engine/time/timeModels";

export default function PaperClock({ gameTimeMinutes }) {
  const rotation = (gameTimeMinutes / GAME_DAY_MINUTES) * 360;

  return (
    <div style={wrapperStyle}>
      <div style={dashboardFrameStyle}>

        {/* Текстура бумаги */}
        <div style={paperBgStyle}></div>

        {/* Индикатор Дня и Ночи */}
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
            const isMajor = i % 3 === 0;
            const isCardinal = i % 6 === 0;
            const textColor = '#2c3e50';
            const tickColor = '#2c3e50';

            return (
              <div key={i} style={{
                  ...tickContainerStyle,
                  transform: `rotate(${angle}deg)`
              }}>
                <div style={{
                    ...tickMarkStyle,
                    height: isMajor ? '10px' : '6px',
                    width: isMajor ? '3px' : '1px',
                    background: tickColor
                }}></div>
                {isMajor && (
                    <span style={{
                        display: 'block',
                        position: 'absolute',
                        top: '18px',
                        left: '50%',
                        transform: `translate(-50%, 0) rotate(-${angle}deg) rotate(${rotation}deg)`,
                        fontSize: isCardinal ? '16px' : '12px',
                        fontWeight: 'bold',
                        color: textColor,
                        fontFamily: 'monospace',
                        textShadow: 'none'
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
        <div style={glassOverlayStyle}></div>
      </div>

      {/* Цифровое табло */}
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
  width: 220, height: 110, // Увеличенный размер
  overflow: 'hidden', position: 'relative',
  borderRadius: '110px 110px 0 0',
  background: '#f5f5f5',
  border: '5px solid #3E2723',
  borderBottom: '3px solid #2c3e50',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
};

const paperBgStyle = {
  position: 'absolute', inset: 0,
  backgroundColor: '#fdfbf7',
  opacity: 1
};

const dayNightStripStyle = {
    position: 'absolute', top: 0, left: '50%', width: '220px', height: '220px',
    borderRadius: '50%', pointerEvents: 'none',
    transformOrigin: 'center center'
};

const stripInnerStyle = {
    width: '100%', height: '100%', borderRadius: '50%',
    background: `conic-gradient(
      rgba(41, 128, 185, 0.4) 0deg 90deg,
      transparent 90deg 315deg,
      rgba(41, 128, 185, 0.4) 315deg 360deg
    )`
};

const dialStyle = {
  position: 'absolute', top: 0, left: '50%', width: '220px', height: '220px',
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
    width: 3, height: 95,
    background: '#c0392b',
    transform: 'translateX(-50%)',
    zIndex: 10,
    boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'
};

const centerBoltStyle = {
    position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
    width: 20, height: 20, borderRadius: '50%',
    background: '#3E2723', border: '1px solid #2c3e50', zIndex: 20
};

const glassOverlayStyle = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)',
    pointerEvents: 'none', borderRadius: '110px 110px 0 0', zIndex: 30
};

const digitalBoxStyle = {
    marginTop: -4,
    background: '#2c3e50',
    color: '#ecf0f1',
    padding: '4px 16px',
    borderRadius: '0 0 6px 6px',
    fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold',
    border: '2px solid #3E2723', borderTop: 'none',
    zIndex: 40,
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
};