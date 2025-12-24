"use client";

import React from 'react';
import InfoPanel from './InfoPanel';

// Теперь RightPanel "тупой" компонент - он просто рисует то, что ему передали сверху.
// Вся логика расчета погоды (с учетом тайла) находится в GameUI.
export default function RightPanel({ gameTime, stats, weather }) {

  // Заглушка, если погода еще не загрузилась
  const w = weather || { temp: 0, wind: 0, pressure: 760, humidity: 50, condition: 'clear' };

  // Округляем значения для красивого вывода
  const displayTemp = Math.round(w.temp);
  const displayWind = Number(w.wind).toFixed(1);
  const displayPressure = Math.round(w.pressure);
  const displayHumidity = Math.round(w.humidity);

  return (
    <div style={containerStyle}>
      {/* Передаем погоду дальше в InfoPanel для часов и иконки */}
      <InfoPanel gameTimeMinutes={gameTime} stats={stats} weather={w} />

      <div style={envPanelStyle}>
        <div style={headerStyle}>МЕТЕОСВОДКА</div>

        <EnvRow
            icon="🌡️"
            label="ТЕМПЕРАТУРА"
            value={`${displayTemp > 0 ? '+' : ''}${displayTemp}°C`}
            color={displayTemp > 0 ? "#ffb74d" : "#90caf9"}
        />
        <EnvRow
            icon="💨"
            label="ВЕТЕР"
            value={`${displayWind} м/с`}
            color={w.wind > 8 ? "#ef5350" : "#90caf9"}
        />
        <EnvRow
            icon="🌊"
            label="ДАВЛЕНИЕ"
            value={`${displayPressure} мм`}
            color={w.pressure < 745 || w.pressure > 775 ? "#e57373" : "#a5d6a7"}
        />
        <EnvRow
            icon="💧"
            label="ВЛАЖНОСТЬ"
            value={`${displayHumidity}%`}
            color={w.humidity > 80 ? "#4fc3f7" : "#b0bec5"}
        />
      </div>

      <div style={statusPanelStyle}>
        <div style={headerStyle}>САМОЧУВСТВИЕ</div>
        <div style={statusRowStyle}>
            {stats.fatigue < 30 ? <span style={{color: '#ef5350'}}>• Усталость</span> : <span style={{color: '#8bc34a'}}>• Бодр</span>}
        </div>
        <div style={statusRowStyle}>
            {w.temp < -10 ? <span style={{color: '#64b5f6'}}>• Холодно</span> :
             w.temp > 30 ? <span style={{color: '#ffb74d'}}>• Жарко</span> :
             <span style={{color: '#90a4ae'}}>• Комфорт</span>}
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

const containerStyle = { position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', gap: '15px', width: '260px', pointerEvents: 'auto', zIndex: 60 };
const envPanelStyle = { backgroundColor: '#2F3532', border: '2px solid #1a1e1c', borderRadius: '4px', padding: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', gap: '6px' };
const statusPanelStyle = { ...envPanelStyle, minHeight: '60px' };
const headerStyle = { fontSize: '10px', color: '#5d6d65', borderBottom: '1px solid #3e4441', paddingBottom: '2px', marginBottom: '4px', letterSpacing: '1px', fontWeight: 'bold' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#222624', padding: '4px 8px', borderRadius: '2px', border: '1px solid #333' };
const statusRowStyle = { fontSize: '11px', fontFamily: 'monospace', padding: '2px 0' };