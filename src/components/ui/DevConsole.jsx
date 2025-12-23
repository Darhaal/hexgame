"use client";

import { useState, useEffect } from "react";
import { getAllItems } from "../../data/itemsData";
import { getWeather, setOverrideWeather } from "../../engine/weather/WeatherSystem";
import { getGameDate } from "../../engine/time/DateSystem";

export default function DevConsole({
    onAddSteps, onReset, onToggleDebug, onSetVehicle, onAddStat, onSpawnItem, gameTime, onSave
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('weather');
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [dateInfo, setDateInfo] = useState(null);
  // Используем ключ для принудительного обновления интерфейса при кликах
  const [refreshKey, setRefreshKey] = useState(0);

  // Обновление инфо: Либо при тике времени, либо при ручном обновлении (refreshKey)
  // Также добавляем интервал для "Живого мониторинга" (чтобы видеть плавные изменения)
  useEffect(() => {
      if (!isOpen) return;

      const updateInfo = () => {
          if (gameTime !== undefined) {
              setWeatherInfo(getWeather(gameTime));
              setDateInfo(getGameDate(gameTime));
          }
      };

      // Сразу обновляем при открытии или изменении ключа
      updateInfo();

      // Запускаем таймер для обновления "в реальном времени" (каждые 100мс),
      // чтобы видеть как меняется ветер или температура, даже если время в игре идет медленно
      const interval = setInterval(updateInfo, 100);

      return () => clearInterval(interval);
  }, [isOpen, gameTime, refreshKey]);

  const addTime = (min) => onAddSteps(min);

  const handleSetWeather = (type) => {
      setOverrideWeather(type);
      // Обновляем контекст игры (перерисовка мира)
      onAddSteps(0);
      // Мгновенно обновляем данные в самой консоли
      setRefreshKey(prev => prev + 1);
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
  const allItems = getAllItems ? getAllItems() : [];
  const filteredItems = spawnFilter === 'all' ? allItems : allItems.filter(i => i.type === spawnFilter);

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
            {activeTab === 'weather' && weatherInfo && (
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
                            {/* Выделяем ветер цветом, если он сильный, для удобства тестов */}
                            <span style={{color: weatherInfo.wind > 8 ? '#ef5350' : '#ccc'}}>{weatherInfo.wind} м/с</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Давление:</span>
                            <span>{weatherInfo.pressure} мм</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Влажность:</span>
                            <span>{weatherInfo.humidity}%</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Туман:</span>
                            <span>{weatherInfo.fogDensity > 0 ? `${Math.round(weatherInfo.fogDensity*100)}%` : '0%'}</span>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <span>Свет (Light):</span>
                            <span>{Math.round(weatherInfo.lightLevel * 100)}%</span>
                        </div>
                    </div>

                    <div style={labelStyle}>УСТАНОВИТЬ ПОГОДУ (FORCE)</div>
                    <div style={gridStyle}>
                        <CmdButton label="☀️ ЯСНО" onClick={() => handleSetWeather('clear')} color="#fbc02d"/>
                        <CmdButton label="☁️ ПАСМУРНО" onClick={() => handleSetWeather('fog')} color="#b0bec5"/>
                        <CmdButton label="🌧️ ДОЖДЬ" onClick={() => handleSetWeather('rain')} color="#4fc3f7"/>
                        <CmdButton label="⛈️ ЛИВЕНЬ" onClick={() => handleSetWeather('heavy_rain')} color="#0288d1"/>
                        <CmdButton label="⚡ ГРОЗА" onClick={() => handleSetWeather('storm')} color="#ef5350"/>
                        <CmdButton label="❄️ СНЕГ" onClick={() => handleSetWeather('snow')} color="#fff"/>
                        <CmdButton label="💨 ВЕТЕР (ТЕСТ)" onClick={() => handleSetWeather('windy')} color="#90caf9"/>
                        <CmdButton label="🤖 АВТО (СБРОС)" onClick={() => handleSetWeather('auto')} color="#69f0ae" style={{gridColumn: 'span 2'}}/>
                    </div>
                </div>
            )}

            {activeTab === 'time' && (
                <div style={colStyle}>
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

            {activeTab === 'stats' && (
                <div style={colStyle}>
                    <div style={gridStyle}>
                        <CmdButton label="🍖 ПОЛНАЯ СЫТОСТЬ" color="#e6a749" onClick={() => onAddStat('food', 100)} />
                        <CmdButton label="💧 ПОЛНАЯ ВОДА" color="#4fc3f7" onClick={() => onAddStat('water', 100)} />
                        <CmdButton label="⚡ ЭНЕРГИЯ MAX" color="#aed581" onClick={() => onAddStat('fatigue', 100)} />
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

// Стили: панель теперь полупрозрачная (0.95 -> 0.85) и с backdrop-filter для размытия фона игры
const floatingBtnStyle = {position: 'fixed', top: 10, left: 10, zIndex: 9000, background: 'rgba(0,0,0,0.8)', color: '#ef5350', border: '1px solid #ef5350', padding: '5px 10px', borderRadius: '4px', cursor:'pointer', fontWeight:'bold'};
const panelStyle = { position: 'fixed', top: 10, left: 10, width: '340px', height: '550px', background: 'rgba(20,20,20,0.85)', backdropFilter: 'blur(5px)', border: '1px solid #444', zIndex: 9000, display: 'flex', flexDirection: 'column', fontFamily: 'monospace', borderRadius: '4px', boxShadow:'0 0 20px rgba(0,0,0,0.8)' };
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