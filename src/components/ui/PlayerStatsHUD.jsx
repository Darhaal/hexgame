import React from 'react';

export default function PlayerStatsHUD({ stats }) {
  if (!stats) return null;

  return (
    <div style={containerStyle}>
      <StatRow icon="🍎" value={stats.food} color="#66bb6a" label="Food" />
      <StatRow icon="💧" value={stats.water} color="#42a5f5" label="Water" />
      <StatRow icon="🛏️" value={stats.fatigue} color="#ffee58" label="Energy" />
    </div>
  );
}

function StatRow({ icon, value, color }) {
  // Гарантируем числовое значение
  const numericValue = parseFloat(value) || 0;

  const isCritical = numericValue <= 30;
  const barColor = isCritical ? "#ef5350" : color;
  // Ограничиваем проценты 0-100
  const widthPercent = Math.max(0, Math.min(100, numericValue));

  return (
    <div style={rowStyle}>
      <div style={iconBoxStyle}>{icon}</div>
      <div style={barContainerStyle}>
        <div style={barBackgroundStyle}>
            <div style={{
                ...barFillStyle,
                width: `${widthPercent}%`,
                backgroundColor: barColor,
                boxShadow: isCritical ? "0 0 5px #ef5350" : "none",
                // Убрана анимация для мгновенного обновления без рывков
            }}></div>
        </div>
        {/* Округляем текст для читаемости (показываем только целые числа) */}
        <div style={textOverlayStyle}>{Math.floor(numericValue)} / 100</div>
      </div>
    </div>
  );
}

// --- СТИЛИ ---

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%'
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const iconBoxStyle = {
  fontSize: '18px',
  width: '24px',
  textAlign: 'center',
  lineHeight: 1
};

const barContainerStyle = {
    flex: 1,
    position: 'relative',
    height: '18px',
};

const barBackgroundStyle = {
  width: '100%',
  height: '100%',
  background: '#e0e0e0', // Светло-серый слот (вдавленный)
  border: '1px solid #bdc3c7',
  borderRadius: '4px',
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  left: 0,
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
};

const barFillStyle = {
  height: '100%',
  // willChange убран, так как анимации больше нет
};

const textOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#333',
    textShadow: '0 0 2px rgba(255,255,255,0.8)',
    pointerEvents: 'none',
    fontFamily: 'monospace'
};