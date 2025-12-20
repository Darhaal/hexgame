"use client";

import React from 'react';
// Убрали внешние импорты, так как они вызывают ошибку разрешения в этой среде
// import PaperClock from './PaperClock';
// import PlayerStatsHUD from './PlayerStatsHUD';
import { GAME_DAY_MINUTES, formatGameTime } from "../../engine/time/timeModels";

// --- ВСТРОЕННЫЙ КОМПОНЕНТ PaperClock ---
function PaperClock({ gameTimeMinutes }) {
  const rotation = (gameTimeMinutes / GAME_DAY_MINUTES) * 360;

  return (
    <div style={clockWrapperStyle}>
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

// --- Стили PaperClock ---
const clockWrapperStyle = {
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

// --- ВСТРОЕННЫЙ КОМПОНЕНТ PlayerStatsHUD ---
function PlayerStatsHUD({ stats }) {
  if (!stats) return null;

  return (
    <div style={hudContainerStyle}>
      <StatRow icon="🍖" value={stats.food} color="#e6a749" label="СЫТ" />
      <StatRow icon="💧" value={stats.water} color="#4fc3f7" label="ВОДА" />
      <StatRow icon="⚡" value={stats.fatigue} color="#aed581" label="ЭНРГ" />
    </div>
  );
}

function StatRow({ icon, value, color, label }) {
  const numericValue = parseFloat(value) || 0;
  const isCritical = numericValue <= 30;
  const barColor = isCritical ? "#ef5350" : color;
  const widthPercent = Math.max(0, Math.min(100, numericValue));

  return (
    <div style={hudRowStyle}>
      <div style={hudLabelContainerStyle}>
          <div style={hudIconBoxStyle}>{icon}</div>
          <span style={hudLabelTextStyle}>{label}</span>
      </div>

      <div style={hudBarContainerStyle}>
        {/* Шкала с делениями */}
        <div style={hudGridOverlayStyle}></div>

        <div style={hudBarBackgroundStyle}>
            <div style={{
                ...hudBarFillStyle,
                width: `${widthPercent}%`,
                backgroundColor: barColor,
                boxShadow: isCritical ? "0 0 8px #ef5350" : "none",
            }}></div>
        </div>
      </div>

      <div style={hudValueTextStyle}>{Math.floor(numericValue)}</div>
    </div>
  );
}

// --- Стили PlayerStatsHUD ---
const hudContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%'
};

const hudRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#1a1e1c',
  padding: '4px',
  borderRadius: '2px',
  border: '1px solid #333'
};

const hudLabelContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '50px',
    justifyContent: 'space-between'
};

const hudIconBoxStyle = {
  fontSize: '14px',
  lineHeight: 1
};

const hudLabelTextStyle = {
    fontSize: '9px',
    color: '#888',
    fontFamily: 'monospace',
    fontWeight: 'bold'
};

const hudBarContainerStyle = {
    flex: 1,
    position: 'relative',
    height: '10px',
    background: '#111',
    borderRadius: '1px',
    border: '1px solid #444',
    overflow: 'hidden'
};

const hudGridOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    backgroundImage: 'linear-gradient(90deg, transparent 19%, rgba(0,0,0,0.5) 20%)',
    backgroundSize: '10% 100%', // Деления каждые 10%
    pointerEvents: 'none'
};

const hudBarBackgroundStyle = {
  width: '100%',
  height: '100%',
};

const hudBarFillStyle = {
  height: '100%',
  transition: 'width 0.3s ease',
  boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 2px rgba(0,0,0,0.2)' // Объем
};

const hudValueTextStyle = {
    width: '25px',
    textAlign: 'right',
    fontSize: '10px',
    color: '#eee',
    fontFamily: 'monospace'
};

// --- ОСНОВНОЙ КОМПОНЕНТ InfoPanel ---

// Принимает className или style для гибкости
export default function InfoPanel({ gameTimeMinutes, stats, style }) {
  return (
    <div style={{ ...panelContainerStyle, ...style }}>
      {/* Болты крепления */}
      <div style={{ ...boltStyle, top: 5, left: 5 }}>x</div>
      <div style={{ ...boltStyle, top: 5, right: 5 }}>x</div>
      <div style={{ ...boltStyle, bottom: 5, left: 5 }}>x</div>
      <div style={{ ...boltStyle, bottom: 5, right: 5 }}>x</div>

      {/* Основной блок */}
      <div style={innerContentStyle}>
        {/* Блок времени с рамкой */}
        <div style={clockFrameStyle}>
          <div style={labelStyle}>ВРЕМЯ</div>
          <PaperClock gameTimeMinutes={gameTimeMinutes} />
        </div>

        {/* Разделительная линия (гравировка) */}
        <div style={separatorStyle}></div>

        {/* Блок состояния */}
        <div style={statsWrapperStyle}>
          <div style={labelStyle}>СОСТОЯНИЕ</div>
          <PlayerStatsHUD stats={stats} />
        </div>
      </div>
    </div>
  );
}

// --- СТИЛИ InfoPanel ---

const panelContainerStyle = {
  // Убрали absolute positioning, чтобы он вел себя нормально внутри flex-контейнера
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%', // Занимает всю ширину родителя

  // Текстура "Крашеный металл"
  backgroundColor: '#2F3532',
  border: '2px solid #1a1e1c',
  borderRadius: '4px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
  padding: '12px',
  boxSizing: 'border-box'
};

const boltStyle = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#151515',
    boxShadow: 'inset 0 0 2px rgba(0,0,0,1)',
    color: '#333',
    fontSize: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    cursor: 'default',
    zIndex: 2
};

const innerContentStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: '#222624',
  border: '1px solid #444',
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)',
  padding: '10px',
  borderRadius: '2px',
  boxSizing: 'border-box'
};

const clockFrameStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '10px',
  paddingBottom: '5px'
};

const statsWrapperStyle = {
  width: '100%',
  marginTop: '5px'
};

const labelStyle = {
    fontSize: '10px',
    color: '#8c9c95',
    fontFamily: 'monospace',
    letterSpacing: '2px',
    marginBottom: '4px',
    width: '100%',
    textAlign: 'left',
    borderBottom: '1px solid #333'
};

const separatorStyle = {
    width: '100%',
    height: '2px',
    background: '#111',
    borderBottom: '1px solid #333',
    margin: '5px 0',
};