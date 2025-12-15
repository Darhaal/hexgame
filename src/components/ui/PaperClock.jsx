import React from 'react';
import { GAME_DAY_MINUTES, formatGameTime } from "../../engine/time/timeModels";

export default function PaperClock({ gameTimeMinutes }) {
  // 1 день = 360 градусов.
  const rotation = (gameTimeMinutes / GAME_DAY_MINUTES) * 360;

  return (
    <div style={containerStyle}>
      {/* Корпус в стиле приборной панели */}
      <div style={dashboardFrameStyle}>

        {/* Текстура бумаги на фоне */}
        <div style={paperBgStyle}></div>

        {/* Индикатор Дня и Ночи (Сектор) */}
        {/* Этот контейнер вращается. Он должен быть центрирован относительно оси вращения (середины нижней грани маски) */}
        <div style={{
             ...rotatingLayerStyle,
             transform: `translateX(-50%) rotate(-${rotation.toFixed(2)}deg)`
        }}>
             <div style={stripInnerStyle}></div>
        </div>

        {/* Шкала (Вращается диск) */}
        <div style={{
            ...rotatingLayerStyle,
            transform: `translateX(-50%) rotate(-${rotation.toFixed(2)}deg)`,
            transition: 'none'
        }}>
          {Array.from({length: 24}).map((_, i) => {
            const angle = (i / 24) * 360;
            // Основные цифры: 0, 3, 6, 9, 12...
            const isMajor = i % 3 === 0;
            const isCardinal = i % 6 === 0; // 0, 6, 12, 18 - самые большие

            // Убрана логика смены цвета (теперь всегда темный для контраста)
            const textColor = '#2c3e50';
            const tickColor = '#2c3e50';

            return (
              <div key={i} style={{
                  ...tickContainerStyle,
                  transform: `rotate(${angle}deg)`
              }}>
                {/* Засечка */}
                <div style={{
                    ...tickMarkStyle,
                    height: isMajor ? '10px' : '6px',
                    width: isMajor ? '2px' : '1px',
                    background: tickColor
                }}></div>

                {/* Цифра */}
                <span style={{
                    display: 'block',
                    position: 'absolute',
                    top: '14px',
                    left: '50%',
                    transform: `translate(-50%, 0) rotate(-${angle}deg) rotate(${rotation}deg)`, // Компенсация вращения
                    // Меняем размер для основных и второстепенных цифр
                    fontSize: isCardinal ? '16px' : (isMajor ? '12px' : '9px'),
                    fontWeight: isMajor ? 'bold' : 'normal',
                    color: textColor,
                    fontFamily: 'monospace',
                    opacity: isMajor ? 1 : 0.7 // Маленькие цифры чуть прозрачнее
                }}>
                  {i}
                </span>
              </div>
            );
          })}
        </div>

        {/* Стрелка (Красная игла) */}
        <div style={needleStyle}></div>

        {/* Центральный болт */}
        <div style={centerBoltStyle}></div>

        {/* Блик стекла */}
        <div style={glassOverlayStyle}></div>
      </div>

      {/* Цифровое табло внизу */}
      <div style={digitalBoxStyle}>
        {formatGameTime(gameTimeMinutes)}
      </div>
    </div>
  );
}

// --- СТИЛИ ---

const containerStyle = {
  position: 'absolute', top: 20, right: 20, zIndex: 50,
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.4))'
};

const dashboardFrameStyle = {
  width: 200, height: 100, // Ровно половина круга
  overflow: 'hidden', position: 'relative',
  borderRadius: '100px 100px 0 0', // Радиус равен высоте
  background: '#f0f0f0',
  border: '6px solid #34495e',
  borderBottom: '4px solid #2c3e50',
  boxSizing: 'border-box'
};

const paperBgStyle = {
  position: 'absolute', inset: 0,
  backgroundColor: '#f5f5f5',
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
  opacity: 1
};

// Общий стиль для вращающихся слоев (диск, индикатор).
const rotatingLayerStyle = {
    position: 'absolute',
    top: 0, left: '50%', // Центруем по горизонтали
    width: '200px', height: '200px', // Полный круг
    borderRadius: '50%',
    transformOrigin: 'center center', // Вращаем вокруг своего центра
    // Сдвигаем на 50% влево (из-за left:50%) и вращаем
    // В рендере добавляется transform: translateX(-50%) rotate(...)
};

const stripInnerStyle = {
    width: '100%', height: '100%', borderRadius: '50%',
    // Жесткий сектор ночи (синий цвет):
    // 00:00 (0deg) - 06:00 (90deg) -> Ночь
    // 06:00 (90deg) - 21:00 (315deg) -> День (Прозрачно)
    // 21:00 (315deg) - 00:00 (360deg) -> Ночь
    background: `conic-gradient(
      rgba(41, 128, 185, 0.3) 0deg 90deg,     /* 00:00 - 06:00 (Ночь - Синий) */
      transparent 90deg 315deg,               /* 06:00 - 21:00 (День) */
      rgba(41, 128, 185, 0.3) 315deg 360deg   /* 21:00 - 00:00 (Ночь - Синий) */
    )`
};

const tickContainerStyle = {
    position: 'absolute', top: 0, left: '50%', width: 2, height: '50%',
    transformOrigin: 'bottom center',
    display: 'flex', justifyContent: 'center'
};

const tickMarkStyle = {
    marginTop: '2px'
};

const needleStyle = {
    position: 'absolute', bottom: 0, left: '50%',
    width: 3, height: 85,
    background: '#c0392b', // Красная стрелка
    transform: 'translateX(-50%)',
    borderRadius: '2px 2px 0 0',
    boxShadow: '1px 1px 3px rgba(0,0,0,0.3)',
    zIndex: 10
};

const centerBoltStyle = {
    position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
    width: 24, height: 24, borderRadius: '50%',
    background: '#34495e',
    border: '2px solid #2c3e50',
    zIndex: 20
};

const glassOverlayStyle = {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)',
    pointerEvents: 'none',
    zIndex: 30
};

const digitalBoxStyle = {
    marginTop: -2,
    background: '#34495e',
    color: '#ecf0f1',
    padding: '4px 12px',
    borderRadius: '0 0 6px 6px',
    fontFamily: 'monospace',
    fontSize: '14px',
    fontWeight: 'bold',
    border: '2px solid #2c3e50',
    borderTop: 'none',
    zIndex: 40
};