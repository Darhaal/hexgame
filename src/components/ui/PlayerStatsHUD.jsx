import React from 'react';

export default function PlayerStatsHUD({ stats }) {
  if (!stats) return null;

  return (
    <div style={containerStyle}>
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
    <div style={rowStyle}>
      <div style={labelContainerStyle}>
          <div style={iconBoxStyle}>{icon}</div>
          <span style={labelTextStyle}>{label}</span>
      </div>

      <div style={barContainerStyle}>
        {/* Шкала с делениями */}
        <div style={gridOverlayStyle}></div>

        <div style={barBackgroundStyle}>
            <div style={{
                ...barFillStyle,
                width: `${widthPercent}%`,
                backgroundColor: barColor,
                boxShadow: isCritical ? "0 0 8px #ef5350" : "none",
            }}></div>
        </div>
      </div>

      <div style={valueTextStyle}>{Math.floor(numericValue)}</div>
    </div>
  );
}

// --- СТИЛИ ---

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '100%'
};

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: '#1a1e1c',
  padding: '4px',
  borderRadius: '2px',
  border: '1px solid #333'
};

const labelContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '50px',
    justifyContent: 'space-between'
};

const iconBoxStyle = {
  fontSize: '14px',
  lineHeight: 1
};

const labelTextStyle = {
    fontSize: '9px',
    color: '#888',
    fontFamily: 'monospace',
    fontWeight: 'bold'
};

const barContainerStyle = {
    flex: 1,
    position: 'relative',
    height: '10px',
    background: '#111',
    borderRadius: '1px',
    border: '1px solid #444',
    overflow: 'hidden'
};

const gridOverlayStyle = {
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

const barBackgroundStyle = {
  width: '100%',
  height: '100%',
};

const barFillStyle = {
  height: '100%',
  transition: 'width 0.3s ease',
  boxShadow: 'inset 0 2px 2px rgba(255,255,255,0.2), inset 0 -2px 2px rgba(0,0,0,0.2)' // Объем
};

const valueTextStyle = {
    width: '25px',
    textAlign: 'right',
    fontSize: '10px',
    color: '#eee',
    fontFamily: 'monospace'
};