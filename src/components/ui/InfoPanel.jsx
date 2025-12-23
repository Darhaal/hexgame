"use client";

import React from 'react';
import { getWeather } from "../../engine/weather/WeatherSystem";
import PaperClock from './PaperClock';
import PlayerStatsHUD from './PlayerStatsHUD';

export default function InfoPanel({ gameTimeMinutes, stats, style, weather }) {
  // Используем переданную погоду или считаем сами
  const w = weather || getWeather(gameTimeMinutes);

  const getWeatherIcon = (cond) => {
      switch(cond) {
          case 'clear': return '☀️';
          case 'partly_cloudy': return '🌤️';
          case 'cloudy': return '☁️';
          case 'rain': return '🌧️';
          case 'drizzle': return '🌦️';
          case 'heavy_rain': return '⛈️';
          case 'snow': return '❄️';
          case 'storm': return '🌩️';
          case 'fog': return '🌫️';
          case 'windy': return '🌬️';
          default: return '☀️';
      }
  };

  return (
    <div style={{ ...panelContainerStyle, ...style }}>
      <div style={{ ...boltStyle, top: 5, left: 5 }}>x</div>
      <div style={{ ...boltStyle, top: 5, right: 5 }}>x</div>
      <div style={{ ...boltStyle, bottom: 5, left: 5 }}>x</div>
      <div style={{ ...boltStyle, bottom: 5, right: 5 }}>x</div>

      <div style={innerContentStyle}>
        {/* Погода */}
        <div style={weatherWidgetStyle}>
            <div style={{fontSize: '24px'}}>{getWeatherIcon(w.condition)}</div>
            <div style={{display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                <span style={{fontSize: '16px', fontWeight: 'bold', color: w.temp > 0 ? '#ffb74d' : '#90caf9'}}>
                    {w.temp > 0 ? '+' : ''}{w.temp}°C
                </span>
                <span style={{fontSize: '10px', color: '#8c9c95'}}>{w.condition.toUpperCase()}</span>
            </div>
        </div>

        <div style={separatorStyle}></div>

        {/* Часы */}
        <div style={clockFrameStyle}>
          {/* ПЕРЕДАЕМ ПРАВИЛЬНЫЕ ПРОПСЫ */}
          <PaperClock
             gameTimeMinutes={gameTimeMinutes}
             dateStr={w.dateStr}
          />
        </div>

        <div style={separatorStyle}></div>

        <div style={statsWrapperStyle}>
          <div style={labelStyle}>СОСТОЯНИЕ</div>
          <PlayerStatsHUD stats={stats} />
        </div>
      </div>
    </div>
  );
}

// Styles
const panelContainerStyle = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', backgroundColor: '#2F3532', border: '2px solid #1a1e1c', borderRadius: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)', padding: '12px', boxSizing: 'border-box' };
const boltStyle = { position: 'absolute', width: '8px', height: '8px', borderRadius: '50%', background: '#151515', boxShadow: 'inset 0 0 2px rgba(0,0,0,1)', color: '#333', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', cursor: 'default', zIndex: 2 };
const innerContentStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#222624', border: '1px solid #444', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)', padding: '10px', borderRadius: '2px', boxSizing: 'border-box' };
const weatherWidgetStyle = { width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 5px 5px 5px' };
const clockFrameStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '5px' };
const statsWrapperStyle = { width: '100%', marginTop: '5px' };
const labelStyle = { fontSize: '10px', color: '#8c9c95', fontFamily: 'monospace', letterSpacing: '2px', marginBottom: '4px', width: '100%', textAlign: 'left', borderBottom: '1px solid #333' };
const separatorStyle = { width: '100%', height: '2px', background: '#111', borderBottom: '1px solid #333', margin: '5px 0' };