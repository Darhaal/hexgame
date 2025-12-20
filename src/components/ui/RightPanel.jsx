"use client";

import React from 'react';
import InfoPanel from './InfoPanel';

export default function RightPanel({ gameTime, stats }) {
  return (
    <div style={containerStyle}>
      {/* Показатели времени и состояния */}
      <InfoPanel gameTimeMinutes={gameTime} stats={stats} />

      {/* Окружающая среда */}
      <div style={envPanelStyle}>
        <div style={headerStyle}>МЕТЕОСВОДКА</div>

        <EnvRow icon="🌡️" label="ВОЗДУХ" value="+18°C" color="#ffb74d" />
        <EnvRow icon="💨" label="ВЕТЕР" value="3 м/с" color="#90caf9" />
        <EnvRow icon="🌊" label="ДАВЛЕНИЕ" value="760 мм" color="#a5d6a7" />
        <EnvRow icon="💧" label="ВЛАЖНОСТЬ" value="45%" color="#b0bec5" />
      </div>

      {/* Статус персонажа */}
      <div style={statusPanelStyle}>
        <div style={headerStyle}>САМОЧУВСТВИЕ</div>
        <div style={statusRowStyle}>
            <span style={{color: '#8bc34a'}}>• Бодр и полон сил</span>
        </div>
        <div style={statusRowStyle}>
            <span style={{color: '#90a4ae'}}>• Спокоен</span>
        </div>
      </div>
    </div>
  );
}

function EnvRow({ icon, label, value, color }) {
    return (
        <div style={rowStyle}>
            <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
                <span style={{fontSize: '14px'}}>{icon}</span>
                <span style={{fontSize: '10px', color: '#aaa', fontWeight: '600', textTransform: 'uppercase'}}>{label}</span>
            </div>
            <span style={{fontSize: '12px', color: color, fontWeight: 'bold'}}>{value}</span>
        </div>
    )
}

// --- СТИЛИ ---

const containerStyle = {
    position: 'absolute',
    top: 20,
    right: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px', // Отступ между блоками
    width: '260px',
    pointerEvents: 'auto',
    zIndex: 60
};

const envPanelStyle = {
    backgroundColor: '#2F3532',
    border: '2px solid #1a1e1c',
    borderRadius: '4px',
    padding: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
};

const statusPanelStyle = {
    ...envPanelStyle,
    minHeight: '80px'
};

const headerStyle = {
    fontSize: '10px',
    color: '#5d6d65',
    borderBottom: '1px solid #3e4441',
    paddingBottom: '2px',
    marginBottom: '4px',
    letterSpacing: '1px',
    fontWeight: 'bold'
};

const rowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#222624',
    padding: '4px 8px',
    borderRadius: '2px',
    border: '1px solid #333'
};

const statusRowStyle = {
    fontSize: '11px',
    fontFamily: 'monospace',
    padding: '2px 0'
};