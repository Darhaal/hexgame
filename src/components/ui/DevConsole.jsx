"use client";

import { useState } from "react";
import { findNextWeatherOccurrence } from "../../engine/weather/WeatherSystem";
import { OBJECTS_DB } from "../../data/objectsData";
import { useGame } from "../../context/GameContext";

export default function DevConsole({
    onAddSteps, onReset, onToggleDebug, onSetVehicle, onAddStat, onSpawnItem,
    gameTime, onSave,
    weather,
    onUpdateStats
}) {
  const { spawnWorldObject, isDeleteMode, setDeleteMode } = useGame();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('objects'); // По умолчанию новая вкладка
  const [isSearching, setIsSearching] = useState(false);
  const [preferredTime, setPreferredTime] = useState('any');

  // Старые списки предметов
  const allItems = [
      { id: 'apple', name: 'Яблоко', type: 'food', icon: '🍎' },
      { id: 'water_flask', name: 'Фляга', type: 'food', icon: '💧' },
      { id: 'wood', name: 'Дерево', type: 'resource', icon: '🪵' },
      { id: 'stone', name: 'Камень', type: 'resource', icon: '🪨' },
      { id: 'axe', name: 'Топор', type: 'tool', icon: '🪓' },
      { id: 'rod_basic', name: 'Удочка', type: 'gear', icon: '🎣' },
      { id: 'worms', name: 'Черви', type: 'bait', icon: '🪱' },
      { id: 'vodka', name: 'Водка', type: 'food', icon: '🍶' },
      { id: 'knife', name: 'Нож', type: 'tool', icon: '🔪' },
  ];

  const vehicles = [
      { id: 'none', name: 'Пешком' },
      { id: 'boat', name: 'Лодка' },
      { id: 'horse', name: 'Лошадь' }
  ];

  const getGameDateInfo = (minutes) => {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;
      return { day: days + 1, hours, minutes: mins, timeString: `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}` };
  };

  const addTime = (min) => {
      onAddSteps(min);
      if (min > 0 && onUpdateStats) onUpdateStats(min);
  };

  const handleJumpToWeather = (targetType) => {
      if (isSearching) return;
      setIsSearching(true);
      setTimeout(() => {
          const targetTime = findNextWeatherOccurrence(gameTime, targetType, preferredTime);
          if (targetTime) {
              const diff = targetTime - gameTime;
              if (diff > 0) addTime(diff);
          } else {
              alert(`Погода "${targetType}" не найдена в ближайший год.`);
          }
          setIsSearching(false);
      }, 50);
  };

  const weatherInfo = weather || { condition: 'unknown', temp: 0, wind: 0, pressure: 0, humidity: 0, lightLevel: 1 };

  if (!isOpen) return <button onClick={() => setIsOpen(true)} style={floatingBtnStyle}>🔧</button>;

  return (
    <div style={panelStyle}>
        <div style={headerStyle}>
            <span>🔧 GOD MODE</span>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
        </div>

        <div style={tabsRowStyle}>
            <TabButton label="OBJ" id="objects" active={activeTab} onClick={setActiveTab} />
            <TabButton label="WEA" id="weather" active={activeTab} onClick={setActiveTab} />
            <TabButton label="ITM" id="spawn" active={activeTab} onClick={setActiveTab} />
            <TabButton label="VEH" id="vehicles" active={activeTab} onClick={setActiveTab} />
            <TabButton label="SYS" id="system" active={activeTab} onClick={setActiveTab} />
        </div>

        <div style={contentStyle}>

            {/* --- Вкладка ОБЪЕКТОВ МИРА (Новая) --- */}
            {activeTab === 'objects' && (
                <div style={colStyle}>
                    <div style={labelStyle}>TOOLS</div>
                    <button
                        onClick={() => setDeleteMode(!isDeleteMode)}
                        style={{
                            ...actionBtnStyle,
                            backgroundColor: isDeleteMode ? '#b71c1c' : '#222',
                            color: isDeleteMode ? '#fff' : '#ccc',
                            border: isDeleteMode ? '1px solid #ff5252' : '1px solid #444',
                            textAlign: 'center', fontWeight: 'bold'
                        }}
                    >
                        {isDeleteMode ? "⚠️ DELETE MODE ON (RMB OFF)" : "🗑️ ENABLE DELETE MODE"}
                    </button>

                    <div style={labelStyle}>SPAWN WORLD OBJECT</div>
                    <div style={{display:'grid', gridTemplateColumns: '1fr', gap:'5px'}}>
                        {Object.values(OBJECTS_DB).map(obj => (
                            <button
                                key={obj.id}
                                onClick={() => spawnWorldObject(obj.id)}
                                style={actionBtnStyle}
                            >
                                <span style={{marginRight:'6px'}}>{obj.icon}</span>
                                {obj.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Вкладка ПОГОДЫ (Старая) --- */}
            {activeTab === 'weather' && (
                <div style={colStyle}>
                    <div style={infoBlockStyle}>
                        <div>COND: <span style={{color:'#4fc3f7'}}>{weatherInfo.condition?.toUpperCase()}</span></div>
                        <div>TEMP: {Math.round(weatherInfo.temp)}°C | WIND: {Number(weatherInfo.wind).toFixed(1)}</div>
                    </div>
                    <div style={labelStyle}>JUMP TO WEATHER</div>
                    <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
                        <button onClick={() => setPreferredTime('any')} style={getTimeBtnStyle(preferredTime === 'any')}>ANY</button>
                        <button onClick={() => setPreferredTime('day')} style={getTimeBtnStyle(preferredTime === 'day')}>DAY</button>
                        <button onClick={() => setPreferredTime('night')} style={getTimeBtnStyle(preferredTime === 'night')}>NIGHT</button>
                    </div>
                    {isSearching ? <div style={{color:'#4fc3f7', textAlign:'center'}}>Scanning...</div> : (
                        <div style={gridStyle}>
                            <CmdButton label="☀️ CLEAR" onClick={() => handleJumpToWeather('clear')} color="#fbc02d"/>
                            <CmdButton label="☁️ OVERCAST" onClick={() => handleJumpToWeather('overcast')} color="#90a4ae"/>
                            <CmdButton label="🌧️ RAIN" onClick={() => handleJumpToWeather('rain')} color="#4fc3f7"/>
                            <CmdButton label="⚡ STORM" onClick={() => handleJumpToWeather('storm')} color="#ef5350"/>
                            <CmdButton label="🌫️ FOG" onClick={() => handleJumpToWeather('fog')} color="#b0bec5"/>
                            <CmdButton label="❄️ SNOW" onClick={() => handleJumpToWeather('snow')} color="#fff"/>
                        </div>
                    )}
                    <div style={labelStyle}>TIME</div>
                    <div style={{display:'flex', gap:'5px'}}>
                        <CmdButton label="+1H" onClick={() => addTime(60)} />
                        <CmdButton label="+6H" onClick={() => addTime(360)} />
                        <CmdButton label="+1D" onClick={() => addTime(1440)} />
                    </div>
                </div>
            )}

            {/* --- Вкладка ПРЕДМЕТОВ (Старая) --- */}
            {activeTab === 'spawn' && (
                <div style={colStyle}>
                   <div style={labelStyle}>ADD TO INVENTORY</div>
                   <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap:'5px'}}>
                        {allItems.map(item => (
                            <button key={item.id} onClick={() => onSpawnItem(item.id)} style={actionBtnStyle}>
                                {item.icon} {item.name}
                            </button>
                        ))}
                   </div>
                </div>
            )}

            {/* --- Вкладка ТРАНСПОРТА (Старая/Восстановленная) --- */}
            {activeTab === 'vehicles' && (
                <div style={colStyle}>
                    <div style={labelStyle}>SET ACTIVE VEHICLE</div>
                    <div style={{display:'grid', gridTemplateColumns: '1fr', gap:'5px'}}>
                        {vehicles.map(v => (
                            <button key={v.id} onClick={() => onSetVehicle(v.id)} style={actionBtnStyle}>
                                {v.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Вкладка СИСТЕМА (Старая) --- */}
            {activeTab === 'system' && (
                <div style={colStyle}>
                    <div style={labelStyle}>STATS</div>
                    <CmdButton label="❤️ HEAL ALL" color="#66bb6a" onClick={() => { onAddStat('food', 100); onAddStat('water', 100); onAddStat('fatigue', 100); }} />
                    <div style={labelStyle}>GAME</div>
                    <CmdButton label="💾 SAVE" onClick={onSave} color="#4fc3f7" />
                    <CmdButton label="🔥 WIPE SAVE" onClick={onReset} color="#ef5350" />
                </div>
            )}
        </div>
    </div>
  );
}

// --- Helper Components & Styles ---
const TabButton = ({ label, id, active, onClick }) => (
    <button onClick={() => onClick(id)} style={{flex: 1, background: active === id ? '#333' : 'transparent', color: active === id ? '#4fc3f7' : '#666', border: 'none', padding: '8px', cursor: 'pointer', fontSize:'10px', fontWeight: active === id ? 'bold':'normal', borderBottom: active === id ? '2px solid #4fc3f7' : 'none'}}>{label}</button>
);
const CmdButton = ({ label, onClick, color='#ccc', style }) => (
    <button onClick={onClick} style={{background: '#222', border: '1px solid #444', color: color, padding: '8px', cursor: 'pointer', fontSize:'10px', borderRadius: '3px', fontWeight:'bold', textTransform:'uppercase', ...style}}>{label}</button>
);
const getTimeBtnStyle = (isActive) => ({ flex: 1, background: isActive ? '#0288d1' : '#222', color: isActive ? '#fff' : '#888', border: '1px solid #444', padding: '6px', cursor: 'pointer', fontSize: '10px', borderRadius: '3px' });

const floatingBtnStyle = {position: 'fixed', top: 10, left: 10, zIndex: 9000, background: 'rgba(0,0,0,0.8)', color: '#ef5350', border: '1px solid #ef5350', padding: '5px 10px', borderRadius: '4px', cursor:'pointer', fontWeight:'bold'};
const panelStyle = { position: 'fixed', top: 10, left: 10, width: '320px', height: '500px', background: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(5px)', border: '1px solid #444', zIndex: 9000, display: 'flex', flexDirection: 'column', fontFamily: 'monospace', borderRadius: '4px', boxShadow:'0 0 20px rgba(0,0,0,0.8)' };
const headerStyle = { padding: '10px', background: 'rgba(26,26,26,0.9)', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', color: '#ef5350', fontWeight:'bold', letterSpacing:'1px' };
const closeBtnStyle = { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize:'16px' };
const tabsRowStyle = { display: 'flex', borderBottom: '1px solid #333', background: 'rgba(21,21,21,0.5)' };
const contentStyle = { flex: 1, overflowY: 'auto', padding: '15px' };
const colStyle = { display: 'flex', flexDirection: 'column', gap: '10px' };
const infoBlockStyle = { background: 'rgba(17,17,17,0.6)', padding: '10px', fontSize: '11px', color: '#bbb', border:'1px solid #333', borderRadius:'4px', lineHeight:'1.5' };
const labelStyle = { fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', marginTop:'5px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' };
const itemListStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: '4px', maxHeight:'400px', overflowY:'auto' };
const itemRowStyle = { padding: '6px', background: 'rgba(26,26,26,0.8)', cursor: 'pointer', fontSize: '11px', color: '#ccc', border:'1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center' };
const actionBtnStyle = { background: '#222', border: '1px solid #444', color: '#ccc', padding: '8px', cursor: 'pointer', fontSize: '11px', textAlign: 'left', borderRadius: '2px', display:'flex', alignItems:'center' };