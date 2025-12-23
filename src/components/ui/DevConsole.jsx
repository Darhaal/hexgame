"use client";

import { useState } from "react";
// Добавляем импорт новой функции поиска
import { findNextWeatherOccurrence } from "../../engine/weather/WeatherSystem";

export default function DevConsole({
    onAddSteps, onReset, onToggleDebug, onSetVehicle, onAddStat, onSpawnItem,
    gameTime, onSave,
    weather
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');

  // Состояния поиска
  const [isSearching, setIsSearching] = useState(false);
  const [preferredTime, setPreferredTime] = useState('any'); // 'any', 'day', 'night'

  // Заглушка для предметов (так как файл itemsData недоступен)
  const allItems = [
      { id: 'apple', name: 'Яблоко', type: 'food', icon: '🍎' },
      { id: 'water_flask', name: 'Фляга', type: 'food', icon: '💧' },
      { id: 'wood', name: 'Дерево', type: 'resource', icon: '🪵' },
      { id: 'stone', name: 'Камень', type: 'resource', icon: '🪨' },
      { id: 'axe', name: 'Топор', type: 'tool', icon: '🪓' },
      { id: 'rod', name: 'Удочка', type: 'gear', icon: '🎣' },
      { id: 'worm', name: 'Червь', type: 'bait', icon: '🪱' }
  ];

  const getGameDateInfo = (minutes) => {
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor((minutes % 1440) / 60);
      const mins = minutes % 60;
      return { day: days + 1, hours, minutes: mins, timeString: `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}` };
  };

  const addTime = (min) => onAddSteps(min);

  // --- НОВАЯ ЛОГИКА: ПЕРЕМОТКА ВРЕМЕНИ К ПОГОДЕ ---
  const handleJumpToWeather = (targetType) => {
      if (isSearching) return;
      setIsSearching(true);

      // Используем setTimeout, чтобы UI успел обновиться и показать "Ищем..."
      setTimeout(() => {
          // Ищем, когда наступит такая погода (до 1 года вперед)
          const targetTime = findNextWeatherOccurrence(gameTime, targetType, preferredTime);

          if (targetTime) {
              const diff = targetTime - gameTime;
              if (diff > 0) {
                  onAddSteps(diff); // Перематываем
              }
          } else {
              const timeText = preferredTime === 'any' ? '' : (preferredTime === 'day' ? ' (Днем)' : ' (Ночью)');
              alert(`Погода "${targetType}"${timeText} не найдена в ближайший год (365 дней).`);
          }
          setIsSearching(false);
      }, 50);
  };

  const handleManualSave = () => {
      onAddSteps(0);
      if (onSave) onSave();
      const btn = document.getElementById('dev-save-btn');
      if(btn) {
          btn.innerText = "✅ OK";
          btn.style.background = "#43a047";
          setTimeout(() => { btn.innerText = "💾 SAVE"; btn.style.background = "#2e7d32"; }, 1000);
      }
  };

  const [spawnFilter, setSpawnFilter] = useState('all');
  const filteredItems = spawnFilter === 'all' ? allItems : allItems.filter(i => i.type === spawnFilter);
  const weatherInfo = weather || { condition: 'unknown', temp: 0, wind: 0, pressure: 0, humidity: 0, lightLevel: 1 };

  if (!isOpen) return <button onClick={() => setIsOpen(true)} style={floatingBtnStyle}>🔧</button>;

  return (
    <div style={panelStyle}>
        <div style={headerStyle}>
            <span>🔧 GOD MODE</span>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
        </div>

        <div style={tabsRowStyle}>
            <TabButton label="🌤️ ПОГОДА" id="weather" active={activeTab} onClick={setActiveTab} />
            <TabButton label="⏳ ВРЕМЯ" id="time" active={activeTab} onClick={setActiveTab} />
            <TabButton label="🎁 ВЕЩИ" id="spawn" active={activeTab} onClick={setActiveTab} />
            <TabButton label="❤️ СТАТЫ" id="stats" active={activeTab} onClick={setActiveTab} />
            <TabButton label="💾 СИСТЕМА" id="system" active={activeTab} onClick={setActiveTab} />
        </div>

        <div style={contentStyle}>
            {activeTab === 'weather' && (
                <div style={colStyle}>
                    <div style={infoBlockStyle}>
                        <div style={{color: '#fff', fontWeight:'bold', borderBottom:'1px solid #444', marginBottom:'5px'}}>МОНИТОР (LIVE)</div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Тип:</span>
                            <span style={{color: '#4fc3f7', fontWeight:'bold'}}>{weatherInfo.condition?.toUpperCase()}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Температура:</span>
                            <span style={{color: weatherInfo.temp > 0 ? '#ffb74d' : '#90caf9'}}>{weatherInfo.temp}°C</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Ветер:</span>
                            <span style={{color: weatherInfo.wind > 8 ? '#ef5350' : '#ccc'}}>{weatherInfo.wind} м/с</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Свет:</span>
                            <span>{Math.round(weatherInfo.lightLevel * 100)}%</span>
                        </div>
                    </div>

                    <div style={labelStyle}>НАЙТИ И ПЕРЕМОТАТЬ (AUTO JUMP)</div>

                    {/* ФИЛЬТР ВРЕМЕНИ СУТОК */}
                    <div style={{display:'flex', gap:'5px', marginBottom:'10px'}}>
                        <button onClick={() => setPreferredTime('any')} style={getTimeBtnStyle(preferredTime === 'any')}>ВСЕ</button>
                        <button onClick={() => setPreferredTime('day')} style={getTimeBtnStyle(preferredTime === 'day')}>☀️ ДЕНЬ</button>
                        <button onClick={() => setPreferredTime('night')} style={getTimeBtnStyle(preferredTime === 'night')}>🌙 НОЧЬ</button>
                    </div>

                    {isSearching ? (
                        <div style={{padding:'20px', textAlign:'center', color:'#4fc3f7'}}>
                            ⌛ Сканирую 365 дней...
                        </div>
                    ) : (
                        <div style={gridStyle}>
                            <CmdButton label="☀️ ЯСНО" onClick={() => handleJumpToWeather('clear')} color="#fbc02d"/>
                            <CmdButton label="⛅ ОБЛАЧНО" onClick={() => handleJumpToWeather('partly_cloudy')} color="#cfd8dc"/>
                            <CmdButton label="☁️ ПАСМУРНО" onClick={() => handleJumpToWeather('overcast')} color="#90a4ae"/>
                            <CmdButton label="🌫️ ТУМАН" onClick={() => handleJumpToWeather('fog')} color="#b0bec5"/>
                            <CmdButton label="🌁 ДЫМКА" onClick={() => handleJumpToWeather('mist')} color="#cfd8dc"/>
                            <CmdButton label="💧 МОРОСЬ" onClick={() => handleJumpToWeather('drizzle')} color="#81d4fa"/>
                            <CmdButton label="🌧️ ДОЖДЬ" onClick={() => handleJumpToWeather('rain')} color="#4fc3f7"/>
                            <CmdButton label="⛈️ ЛИВЕНЬ" onClick={() => handleJumpToWeather('heavy_rain')} color="#0288d1"/>
                            <CmdButton label="⚡ ГРОЗА" onClick={() => handleJumpToWeather('storm')} color="#ef5350"/>
                            <CmdButton label="❄️ СНЕГ" onClick={() => handleJumpToWeather('snow')} color="#fff"/>
                            <CmdButton label="🌨️ МЕТЕЛЬ" onClick={() => handleJumpToWeather('blizzard')} color="#e0e0e0"/>
                            <CmdButton label="💨 ВЕТЕР" onClick={() => handleJumpToWeather('windy')} color="#90caf9"/>
                        </div>
                    )}
                    <div style={{fontSize:'9px', color:'#666', marginTop:'5px'}}>* Ищет до 1 года вперед.</div>
                </div>
            )}

            {activeTab === 'time' && (
                <div style={colStyle}>
                    <div style={{fontSize: '12px', color: '#aaa', textAlign: 'center', marginBottom: '10px'}}>
                        {getGameDateInfo(gameTime).timeString} (День {getGameDateInfo(gameTime).day})
                    </div>
                    <CmdButton label="+1 ЧАС" onClick={() => addTime(60)} />
                    <CmdButton label="+6 ЧАСОВ (УТРО/ВЕЧЕР)" onClick={() => addTime(360)} />
                    <CmdButton label="+1 ДЕНЬ" onClick={() => addTime(1440)} />
                    <CmdButton label="+1 НЕДЕЛЯ" onClick={() => addTime(10080)} />
                </div>
            )}

            {activeTab === 'spawn' && (
                <div style={colStyle}>
                   <div style={{display:'flex', gap:'5px', marginBottom:'5px', flexWrap:'wrap'}}>
                       {Object.keys(categories).map(k => (
                           <button key={k} onClick={()=>setSpawnFilter(k)} style={{fontSize:'9px', padding:'4px', background: spawnFilter===k?'#444':'#222', color:'#ccc', border:'1px solid #333'}}>{categories[k]}</button>
                       ))}
                   </div>
                   <div style={itemListStyle}>
                        {filteredItems.map(item => (
                            <div key={item.id} onClick={() => onSpawnItem(item.id)} style={itemRowStyle}>
                                <span>{item.icon} {item.name}</span>
                                <span style={{color:'#555', fontSize:'9px'}}>{item.type}</span>
                            </div>
                        ))}
                   </div>
                </div>
            )}

            {/* Остальные табы без изменений */}
            {activeTab === 'stats' && (
                <div style={colStyle}>
                    <div style={gridStyle}>
                        <CmdButton label="🍖 ПОЛНАЯ СЫТОСТЬ" color="#e6a749" onClick={() => onAddStat('food', 100)} />
                        <CmdButton label="💧 ПОЛНАЯ ВОДА" color="#4fc3f7" onClick={() => onAddStat('water', 100)} />
                        <CmdButton label="⚡ ЭНЕРГИЯ MAX" color="#aed581" onClick={() => onAddStat('fatigue', 100)} />
                    </div>
                    <div style={labelStyle}>ТРАНСПОРТ</div>
                    <div style={gridStyle}>
                        <CmdButton label="🚶 ПЕШКОМ" onClick={() => onSetVehicle("none")} />
                        <CmdButton label="🚣 ЛОДКА" onClick={() => onSetVehicle("boat")} />
                        <CmdButton label="🐎 ЛОШАДЬ" onClick={() => onSetVehicle("horse")} />
                    </div>
                </div>
            )}

            {activeTab === 'system' && (
                <div style={colStyle}>
                    <CmdButton id="dev-save-btn" label="💾 СОХРАНИТЬ ИГРУ" onClick={handleManualSave} color="#66bb6a" />
                    <CmdButton label="🔥 ВАЙП (СБРОС МИРА)" onClick={onReset} color="#ef5350" />
                </div>
            )}
        </div>
    </div>
  );
}

const categories = { 'all': 'ВСЕ', 'gear': 'СНАСТИ', 'bait': 'НАЖИВКА', 'food': 'ЕДА', 'tool': 'ИНСТРУМЕНТЫ', 'resource': 'РЕСУРСЫ' };

const TabButton = ({ label, id, active, onClick }) => (
    <button onClick={() => onClick(id)} style={{flex: 1, background: active === id ? '#333' : 'transparent', color: active === id ? '#4fc3f7' : '#666', border: 'none', padding: '10px', cursor: 'pointer', fontSize:'10px', fontWeight: active === id ? 'bold':'normal'}}>{label}</button>
);
const CmdButton = ({ label, onClick, color='#ccc', id, style }) => (
    <button id={id} onClick={onClick} style={{background: '#222', border: '1px solid #444', color: color, padding: '12px', cursor: 'pointer', fontSize:'11px', borderRadius: '3px', fontWeight:'bold', textTransform:'uppercase', ...style}}>{label}</button>
);
// Стиль для кнопок времени (День/Ночь)
const getTimeBtnStyle = (isActive) => ({
    flex: 1,
    background: isActive ? '#0288d1' : '#222',
    color: isActive ? '#fff' : '#888',
    border: '1px solid #444',
    padding: '6px',
    cursor: 'pointer',
    fontSize: '10px',
    borderRadius: '3px'
});

const floatingBtnStyle = {position: 'fixed', top: 10, left: 10, zIndex: 9000, background: 'rgba(0,0,0,0.8)', color: '#ef5350', border: '1px solid #ef5350', padding: '5px 10px', borderRadius: '4px', cursor:'pointer', fontWeight:'bold'};
const panelStyle = { position: 'fixed', top: 10, left: 10, width: '360px', height: '600px', background: 'rgba(20,20,20,0.9)', backdropFilter: 'blur(5px)', border: '1px solid #444', zIndex: 9000, display: 'flex', flexDirection: 'column', fontFamily: 'monospace', borderRadius: '4px', boxShadow:'0 0 20px rgba(0,0,0,0.8)' };
const headerStyle = { padding: '10px', background: 'rgba(26,26,26,0.9)', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', color: '#ef5350', fontWeight:'bold', letterSpacing:'1px' };
const closeBtnStyle = { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize:'16px' };
const tabsRowStyle = { display: 'flex', borderBottom: '1px solid #333', background: 'rgba(21,21,21,0.5)' };
const contentStyle = { flex: 1, overflowY: 'auto', padding: '15px' };
const colStyle = { display: 'flex', flexDirection: 'column', gap: '12px' };
const infoBlockStyle = { background: 'rgba(17,17,17,0.6)', padding: '12px', fontSize: '11px', color: '#bbb', border:'1px solid #333', borderRadius:'4px', lineHeight:'1.6' };
const labelStyle = { fontSize: '10px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', marginTop:'5px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' };
const itemListStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: '4px', maxHeight:'400px', overflowY:'auto' };
const itemRowStyle = { padding: '6px', background: 'rgba(26,26,26,0.8)', cursor: 'pointer', fontSize: '11px', color: '#ccc', border:'1px solid #333', display:'flex', justifyContent:'space-between', alignItems:'center' };