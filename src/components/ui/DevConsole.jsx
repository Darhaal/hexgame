"use client";

import { useState, useEffect } from "react";
import { getAllItems } from "../../data/itemsData";
import { getWeather } from "../../engine/weather/WeatherSystem";
import { getGameDate } from "../../engine/time/DateSystem";

export default function DevConsole({
    onAddSteps,
    onReset,
    onToggleDebug,
    onSetVehicle,
    onAddStat,
    onSpawnItem,
    gameTime,
    onSave
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);

  useEffect(() => {
      if (isOpen && gameTime !== undefined) {
          setWeatherInfo(getWeather(gameTime));
          setDateInfo(getGameDate(gameTime));
      }
  }, [isOpen, gameTime]);

  const addTime = (min) => onAddSteps(min);

  // --- ПОИСК ПОГОДЫ ---
  const findWeather = (type) => {
      let steps = 0;
      const limit = 24 * 90; // Ищем до 90 дней (сезон)
      let searchTime = gameTime;
      let foundTime = null;
      let maxIntensity = 0;

      while (steps < limit) {
          searchTime += 60;
          steps++;
          const w = getWeather(searchTime);

          let match = false;
          // Ищем ПИКОВУЮ погоду
          if (type === 'rain' && w.condition === 'rain' && w.intensity > 0.6) match = true;
          if (type === 'storm' && w.condition === 'storm') match = true;
          if (type === 'snow' && w.condition === 'snow' && w.intensity > 0.6) match = true;
          if (type === 'fog' && w.isFoggy) match = true;
          if (type === 'clear' && w.condition === 'clear' && w.cloudIntensity < 0.1) match = true;
          // Ищем сильный ветер (> 10 м/с)
          if (type === 'wind' && w.wind > 10) match = true;

          if (match) {
              // Пытаемся найти самый сильный момент в ближайшие 2 часа
              if (w.intensity >= maxIntensity) {
                  maxIntensity = w.intensity;
                  foundTime = searchTime;
              } else if (foundTime) {
                  break;
              }
              if (type === 'clear' || type === 'fog' || type === 'wind') {
                  foundTime = searchTime;
                  break;
              }
          }
      }

      if (foundTime) {
          onAddSteps(foundTime - gameTime);
      } else {
          alert(`Не найдено: "${type}". Возможно, не сезон?`);
      }
  };

  // --- СМЕНА СЕЗОНА (Прыжок к месяцу) ---
  const jumpToMonth = (targetMonthIndex) => {
      // 0 = Январь, ...
      const current = dateInfo.monthIndex;
      let monthsToAdd = targetMonthIndex - current;
      if (monthsToAdd <= 0) monthsToAdd += 12; // Всегда в будущее

      // Примерно 30 дней в месяце
      const minutesToAdd = monthsToAdd * 30 * 24 * 60;
      // Корректируем, чтобы попасть в начало месяца (1 число)
      // Это грубый прыжок, но для дебага пойдет
      onAddSteps(minutesToAdd - (dateInfo.day * 24 * 60));
  };

  const [spawnFilter, setSpawnFilter] = useState('all');
  const allItems = getAllItems();
  const categories = {
      'all': 'ВСЕ', 'gear': 'СНАСТИ', 'bait': 'НАЖИВКА',
      'food_raw': 'РЫБА', 'food': 'ЕДА', 'tool': 'ИНСТРУМЕНТЫ', 'drink': 'ВОДА'
  };
  const filteredItems = spawnFilter === 'all' ? allItems : allItems.filter(i => i.type === spawnFilter);

  const handleManualSave = () => {
      onAddSteps(0);
      if (onSave) onSave();
      const btn = document.getElementById('dev-save-btn');
      if(btn) {
          const oldText = btn.innerText;
          btn.innerText = "✅ OK";
          btn.style.background = "#43a047";
          setTimeout(() => { btn.innerText = oldText; btn.style.background = "#2e7d32"; }, 1000);
      }
  };

  if (!isOpen) {
      return (
          <button
            onClick={() => setIsOpen(true)}
            style={{
                position: 'fixed', top: 10, left: 10, zIndex: 9000,
                background: 'rgba(0,0,0,0.8)', color: '#4fc3f7', border: '1px solid #333',
                padding: '5px 10px', borderRadius: '4px', cursor: 'pointer',
                fontFamily: 'monospace', fontSize: '12px', fontWeight: 'bold'
            }}
          >
            🔧 DEV
          </button>
      );
  }

  return (
    <div style={panelStyle}>
        <div style={headerStyle}>
            <span>🔧 ADMIN CONSOLE</span>
            <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>✕</button>
        </div>

        <div style={tabsRowStyle}>
            <TabButton label="🌤️ ПОГОДА" id="weather" active={activeTab} onClick={setActiveTab} />
            <TabButton label="⏳ ВРЕМЯ" id="time" active={activeTab} onClick={setActiveTab} />
            <TabButton label="❤️ СТАТЫ" id="stats" active={activeTab} onClick={setActiveTab} />
            <TabButton label="🎁 ПРЕДМЕТЫ" id="spawn" active={activeTab} onClick={setActiveTab} />
            <TabButton label="💾 СИСТЕМА" id="system" active={activeTab} onClick={setActiveTab} />
        </div>

        <div style={contentStyle}>

            {activeTab === 'weather' && weatherInfo && (
                <div style={colStyle}>
                    <div style={infoBlockStyle}>
                        <div style={{color: '#4fc3f7', fontWeight:'bold', borderBottom:'1px solid #333', paddingBottom:'4px', marginBottom:'4px'}}>
                            {weatherInfo.monthName.toUpperCase()}
                        </div>
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'5px'}}>
                            <div>Погода: <span style={{color:'#fff'}}>{weatherInfo.condition.toUpperCase()}</span></div>
                            <div>Интенс.: <span style={{color:'#fff'}}>{(weatherInfo.intensity * 100).toFixed(0)}%</span></div>
                            <div>Облака: <span style={{color:'#fff'}}>{(weatherInfo.cloudIntensity * 100).toFixed(0)}%</span></div>
                            <div>Темп.: <span style={{color: weatherInfo.temp > 0 ? '#ffb74d' : '#90caf9'}}>{weatherInfo.temp > 0 ? '+' : ''}{weatherInfo.temp}°C</span></div>
                            <div>Ветер: <span style={{color:'#fff'}}>{weatherInfo.wind} м/с</span></div>
                            <div>Давление: <span style={{color:'#fff'}}>{weatherInfo.pressure}</span></div>
                        </div>
                    </div>

                    <div style={labelStyle}>СМЕНИТЬ СЕЗОН (ПЕРЕМОТКА)</div>
                    <div style={{display:'flex', gap:'4px'}}>
                        <CmdButton label="ЗИМА (ЯНВ)" onClick={() => jumpToMonth(0)} color="#90caf9"/>
                        <CmdButton label="ВЕСНА (АПР)" onClick={() => jumpToMonth(3)} color="#a5d6a7"/>
                        <CmdButton label="ЛЕТО (ИЮЛ)" onClick={() => jumpToMonth(6)} color="#ffcc80"/>
                        <CmdButton label="ОСЕНЬ (ОКТ)" onClick={() => jumpToMonth(9)} color="#bcaaa4"/>
                    </div>

                    <div style={labelStyle}>НАЙТИ ПОГОДУ</div>
                    <div style={gridStyle}>
                        <CmdButton label="☀️ ЯСНО" color="#fbc02d" onClick={() => findWeather('clear')} />
                        <CmdButton label="🌧️ ДОЖДЬ" color="#4fc3f7" onClick={() => findWeather('rain')} />
                        <CmdButton label="⛈️ ГРОЗА" color="#ef5350" onClick={() => findWeather('storm')} />
                        <CmdButton label="❄️ СНЕГ" color="#fff" onClick={() => findWeather('snow')} />
                        <CmdButton label="🌫️ ТУМАН" color="#bdbdbd" onClick={() => findWeather('fog')} />
                        <CmdButton label="💨 ВЕТЕР" color="#81d4fa" onClick={() => findWeather('wind')} />
                    </div>
                </div>
            )}

            {/* --- Вкладка ВРЕМЯ --- */}
            {activeTab === 'time' && dateInfo && (
                <div style={colStyle}>
                    <div style={infoBlockStyle}>
                        <div style={{fontSize:'18px', color:'#a5d6a7', fontWeight:'bold', textAlign:'center'}}>{dateInfo.timeString}</div>
                        <div style={{fontSize:'12px', textAlign:'center', color:'#ccc'}}>{dateInfo.dateString}</div>
                    </div>
                    <div style={labelStyle}>УПРАВЛЕНИЕ ВРЕМЕНЕМ</div>
                    <div style={gridStyle}>
                        <CmdButton label="-1 ЧАС" onClick={() => addTime(-60)} />
                        <CmdButton label="+1 ЧАС" onClick={() => addTime(60)} />
                        <CmdButton label="+1 ДЕНЬ" onClick={() => addTime(1440)} />
                        <CmdButton label="+1 НЕДЕЛЯ" onClick={() => addTime(10080)} />
                    </div>
                </div>
            )}

            {/* --- Вкладка СТАТИСТИКА --- */}
            {activeTab === 'stats' && (
                <div style={colStyle}>
                    <div style={labelStyle}>ЗДОРОВЬЕ</div>
                    <div style={gridStyle}>
                        <CmdButton label="🍖 СЫТОСТЬ (100)" color="#e6a749" onClick={() => onAddStat('food', 100)} />
                        <CmdButton label="💧 ВОДА (100)" color="#4fc3f7" onClick={() => onAddStat('water', 100)} />
                        <CmdButton label="⚡ ЭНЕРГИЯ (100)" color="#aed581" onClick={() => onAddStat('fatigue', 100)} />
                        <CmdButton label="💀 ИСТОЩЕНИЕ" color="#5d4037" onClick={() => { onAddStat('food', -100); onAddStat('water', -100); }} />
                    </div>
                    <div style={labelStyle}>ТРАНСПОРТ</div>
                    <div style={gridStyle}>
                        <CmdButton label="🚶 ПЕШКОМ" onClick={() => onSetVehicle("none")} />
                        <CmdButton label="🚣 ЛОДКА" onClick={() => onSetVehicle("boat")} />
                        <CmdButton label="🐎 ЛОШАДЬ" onClick={() => onSetVehicle("horse")} />
                    </div>
                </div>
            )}

            {/* --- Вкладка ПРЕДМЕТЫ --- */}
            {activeTab === 'spawn' && (
                <div style={colStyle}>
                    <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginBottom:'8px'}}>
                        {Object.keys(categories).map(k => (
                            <button key={k} onClick={() => setSpawnFilter(k)} style={{...filterBtnStyle, background: spawnFilter === k ? '#4fc3f7' : '#333', color: spawnFilter === k ? '#000' : '#aaa'}}>
                                {categories[k]}
                            </button>
                        ))}
                    </div>
                    <div style={itemListStyle}>
                        {filteredItems.map(item => (
                            <div key={item.id} onClick={() => onSpawnItem(item.id)} style={itemRowStyle}>
                                <span style={{fontSize:'16px'}}>{item.icon}</span>
                                <span>{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- Вкладка СИСТЕМА --- */}
            {activeTab === 'system' && (
                <div style={colStyle}>
                    <div style={labelStyle}>СОХРАНЕНИЕ ДАННЫХ</div>
                    <CmdButton id="dev-save-btn" label="💾 СОХРАНИТЬ ИГРУ" color="#fff" onClick={handleManualSave} style={{background:'#2e7d32', border:'1px solid #43a047'}} />
                    <div style={{fontSize:'10px', color:'#666', marginBottom:'20px'}}>Сохраняет: позицию, инвентарь, время (дату/погоду), статистику.</div>
                    <div style={labelStyle}>СБРОС МИРА</div>
                    <CmdButton label="🔥 WIPE SAVE (ПОЛНЫЙ СБРОС)" color="#ffcdd2" onClick={onReset} style={{background:'#b71c1c', border:'1px solid #e57373'}} />
                </div>
            )}

        </div>
    </div>
  );
}

// --- КОМПОНЕНТЫ UI ---
function TabButton({ label, id, active, onClick }) {
    const isActive = active === id;
    return (
        <button onClick={() => onClick(id)} style={{ background: isActive ? '#333' : 'transparent', color: isActive ? '#4fc3f7' : '#666', border: 'none', borderBottom: isActive ? '2px solid #4fc3f7' : '2px solid transparent', padding: '10px 5px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', flex: 1, transition: 'all 0.2s', outline: 'none' }}>
            {label}
        </button>
    )
}

function CmdButton({ label, color = '#ccc', onClick, id, style }) {
    return (
        <button id={id} onClick={onClick} style={{ background: '#222', border: '1px solid #444', color: color, padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', transition: 'all 0.1s', ...style }} onMouseOver={(e) => { if(!style?.background) e.currentTarget.style.background = '#333'; }} onMouseOut={(e) => { if(!style?.background) e.currentTarget.style.background = '#222'; }}>
            {label}
        </button>
    )
}

const panelStyle = { position: 'fixed', top: 10, left: 10, width: '360px', height: '550px', background: 'rgba(18, 18, 18, 0.98)', border: '1px solid #333', borderRadius: '6px', display: 'flex', flexDirection: 'column', zIndex: 9000, boxShadow: '0 20px 50px rgba(0,0,0,0.8)', fontFamily: 'monospace' };
const headerStyle = { padding: '12px', background: '#111', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#4fc3f7', fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px' };
const closeBtnStyle = { background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '16px', fontWeight:'bold' };
const tabsRowStyle = { display: 'flex', borderBottom: '1px solid #333', background: '#151515' };
const contentStyle = { flex: 1, overflowY: 'auto', padding: '15px' };
const colStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const infoBlockStyle = { background: '#222', padding: '15px', borderRadius: '4px', border: '1px solid #333', fontSize: '11px', color: '#aaa', display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '10px', color: '#555', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' };
const filterBtnStyle = { border: '1px solid #444', borderRadius: '3px', padding: '4px 8px', fontSize: '9px', cursor: 'pointer', flex: 1, fontWeight: 'bold' };
const itemListStyle = { display: 'grid', gridTemplateColumns: '1fr', gap: '2px', maxHeight: '380px', overflowY: 'auto', border: '1px solid #333', padding: '2px', background: '#111' };
const itemRowStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#1a1a1a', cursor: 'pointer', borderRadius: '2px', fontSize: '11px', color: '#ccc', borderBottom: '1px solid #222' };