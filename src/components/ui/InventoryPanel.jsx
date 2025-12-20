"use client";

import { useState, useEffect } from "react";

// --- ДАННЫЕ (РЫБАЛКА) ---
const ITEMS_DB = {
  "rod_basic": { name: "Удочка (Бамбук)", type: "Снасти", weight: 0.5, icon: "🎣", description: "Простая поплавочная удочка. Надежная.", perishTime: 0 },
  "worms": { name: "Черви", type: "Наживка", weight: 0.1, icon: "🪱", description: "Навозные. Рыба клюет.", perishTime: 1200 },
  "bread": { name: "Хлеб", type: "Наживка", weight: 0.2, icon: "🍞", description: "Мякиш. Для мирной рыбы.", perishTime: 600 },
  "vodka": { name: "Фляга", type: "Напиток", weight: 0.5, icon: "🍶", description: "Согревает и радует.", perishTime: 0 },
  "knife": { name: "Нож перочинный", type: "Инструмент", weight: 0.1, icon: "🔪", description: "Для мелких работ.", perishTime: 0 },
  "fish_perch": { name: "Окунь", type: "Улов", weight: 0.3, icon: "🐟", description: "Речной хищник.", perishTime: 120 },
};

const SKILLS_DB = {
  "fishing": { name: "Рыбная ловля", icon: "🎣" },
  "cooking": { name: "Кулинария", icon: "🍳" },
  "survival": { name: "Выживание", icon: "🌲" },
  "crafting": { name: "Мастерство", icon: "🔨" }
};

const getItemData = (id) => ITEMS_DB[id] || { name: "Предмет", type: "Разное", weight: 0, icon: "📦", description: "...", perishTime: 0 };

export default function InventoryPanel({
  inventory = [],
  skills = {},
  character = {},
  onUseItem,
  initialTab = 'inventory',
  onClose
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const selectedInstance = selectedSlotIndex !== null ? inventory[selectedSlotIndex] : null;
  const selectedData = selectedInstance ? getItemData(selectedInstance.itemId) : null;

  const getTabTitle = () => {
      switch(activeTab) {
          case 'inventory': return "ИНВЕНТАРЬ";
          case 'character': return "ПРОФИЛЬ РЫБОЛОВА";
          case 'skills': return "НАВЫКИ И ОПЫТ";
          case 'journal': return "ЗАМЕТКИ";
          default: return "МЕНЮ";
      }
  };

  return (
    <div style={overlayStyle}>
      <div style={folderBodyStyle}>

        {/* Заголовок страницы */}
        <div style={headerContainerStyle}>
            <div style={headerTitleStyle}>{getTabTitle()}</div>
            <button onClick={onClose} style={closeBtnStyle} title="Закрыть">
                ✕
            </button>
        </div>

        {/* Контент */}
        <div style={paperContentStyle}>
            <div style={contentGridStyle}>
                {/* Левая колонка */}
                <div style={leftColStyle}>

                    {activeTab === 'inventory' && (
                        <div style={invListContainerStyle}>
                            {inventory.length > 0 ? inventory.map((item, idx) => {
                                const data = item ? getItemData(item.itemId) : null;
                                const isSelected = selectedSlotIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedSlotIndex(idx)}
                                        style={{
                                            ...invRowStyle,
                                            backgroundColor: isSelected ? 'rgba(78, 52, 46, 0.1)' : 'transparent',
                                            borderLeft: isSelected ? '4px solid #5d4037' : '4px solid transparent',
                                            borderBottom: '1px solid #dcd6c5'
                                        }}
                                    >
                                        <div style={{width: '40px', fontSize: '24px', textAlign: 'center'}}>
                                            {data ? data.icon : <span style={{opacity:0.2}}>📦</span>}
                                        </div>
                                        <div style={{flex: 1, fontWeight: data ? '600' : 'normal', color: data ? '#2b221b' : '#999'}}>
                                            {data ? data.name : "Пустой слот"}
                                        </div>
                                        {item && <div style={qtyTagStyle}>1 шт</div>}
                                    </div>
                                );
                            }) : (
                                <div style={{textAlign:'center', padding:'40px', color:'#888'}}>В рюкзаке пока пусто...</div>
                            )}
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div style={invListContainerStyle}>
                            {Object.entries(skills).map(([key, skill]) => {
                                const meta = SKILLS_DB[key];
                                if(!meta) return null;
                                return (
                                    <div key={key} style={skillRowStyle}>
                                        <div style={{fontSize: '28px', marginRight: '15px'}}>{meta.icon}</div>
                                        <div style={{flex: 1}}>
                                            <div style={{display:'flex', justifyContent:'space-between', marginBottom: '8px'}}>
                                                <span style={{fontWeight:'bold', color: '#5d4037'}}>{meta.name}</span>
                                                <span style={{fontSize:'12px'}}>УРОВЕНЬ {skill.level}</span>
                                            </div>
                                            <div style={progressBgStyle}>
                                                <div style={{...progressFillStyle, width: `${skill.xp}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    {activeTab === 'character' && (
                        <div style={{padding: '20px'}}>
                            <div style={{display:'flex', gap:'25px', marginBottom: '30px', alignItems: 'center'}}>
                                <div style={avatarBoxStyle}>👤</div>
                                <div>
                                    <div style={{fontWeight:'bold', fontSize:'22px', color: '#2b221b'}}>{character.name || "Рыболов"}</div>
                                    <div style={{color: '#6d5645', marginTop:'4px'}}>Любитель рыбной ловли</div>
                                </div>
                            </div>
                            <div style={dividerStyle}>ЭКИПИРОВКА</div>
                            <div style={invListContainerStyle}>
                                <div>🧥 Штормовка брезентовая</div>
                                <div>👢 Сапоги резиновые</div>
                                <div>👒 Панама светлая</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'journal' && (
                        <div style={{padding: '20px'}}>
                            <div style={dividerStyle}>ХРОНИКА СОБЫТИЙ</div>
                            <div style={invListContainerStyle}>— Прибыл на берег. Погода располагает к хорошему клеву.</div>
                            <div style={invListContainerStyle}>— Подготовил снасти, проверил наживку.</div>
                        </div>
                    )}

                </div>

                {/* Правая колонка */}
                <div style={rightColStyle}>
                    <div style={descHeaderStyle}>ДЕТАЛИ</div>
                    {selectedData ? (
                        <>
                            <div style={bigIconStyle}>{selectedData.icon}</div>
                            <div style={itemTitleStyle}>{selectedData.name}</div>
                            <div style={itemTypeStyle}>{selectedData.type} • {selectedData.weight} кг</div>
                            <div style={itemDescBoxStyle}>
                                {selectedData.description}
                            </div>
                            <button onClick={onUseItem} style={actionButtonStyle}>
                                ПРИМЕНИТЬ
                            </button>
                        </>
                    ) : (
                        <div style={{textAlign:'center', color:'#8c7b65', marginTop:'60px', fontStyle:'italic', padding: '0 20px'}}>
                            Выберите предмет для получения подробной информации.
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- STYLES (Обновленные под TilePanel / Коричневая гамма) ---
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' };
const folderBodyStyle = {
    pointerEvents: 'auto',
    width: '800px', height: '600px',
    backgroundColor: '#4a4036', // Коричневая база (как TilePanel)
    backgroundImage: `
      repeating-linear-gradient(45deg, #4a4036 0, #4a4036 2px, #3e352d 2px, #3e352d 4px)
    `,
    border: '4px solid #2d241b',
    boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
    display: 'flex', flexDirection: 'column',
    padding: '10px',
    position: 'relative'
};
const screwStyle = { position: 'absolute', color: '#8c7b65', fontSize: '16px', userSelect: 'none', opacity: 0.7, zIndex: 3 };

const headerContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 10px 20px', borderBottom: '2px solid #2d241b' };
const headerTitleStyle = { color: '#e3dac9', fontWeight: '900', fontSize: '24px', letterSpacing: '2px', fontFamily: "'Courier New', monospace", textShadow: '0 1px 2px rgba(0,0,0,0.8)' };

const closeBtnStyle = {
    width: '40px', height: '40px',
    background: 'radial-gradient(circle, #b71c1c 0%, #7f0000 100%)',
    border: '2px solid #500000',
    borderRadius: '50%',
    color: '#fff', fontSize: '16px', fontWeight: 'bold',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 4px 5px rgba(0,0,0,0.5), inset 0 2px 2px rgba(255,255,255,0.2)'
};

const paperContentStyle = {
    flex: 1,
    backgroundColor: '#e3dac9', // Та же бумага, что и в TilePanel
    backgroundImage: `linear-gradient(#cfc6b8 1px, transparent 1px), linear-gradient(90deg, #cfc6b8 1px, transparent 1px)`,
    backgroundSize: '20px 20px',
    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.3)',
    border: '1px solid #b0a390',
    marginTop: '10px',
    display: 'flex', flexDirection: 'column',
    position: 'relative', overflow: 'hidden'
};

const folderStampStyle = {
    position: 'absolute', top: 15, right: 20,
    border: '3px solid #5d4037', color: '#5d4037',
    padding: '5px 10px', fontSize: '12px', fontWeight: '900',
    transform: 'rotate(-5deg)', opacity: 0.6,
    pointerEvents: 'none'
};

const contentGridStyle = { display: 'flex', height: '100%', paddingTop: '50px' };
const leftColStyle = { flex: 2, borderRight: '2px solid #b0a390', padding: '0 20px 20px 20px', overflowY: 'auto' };
const rightColStyle = { flex: 1, padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

const invListContainerStyle = { display: 'flex', flexDirection: 'column' };
const invRowStyle = { display: 'flex', alignItems: 'center', padding: '10px', cursor: 'pointer', fontFamily: "'Courier New', monospace", transition: 'background 0.1s' };
const qtyTagStyle = { border: '1px solid #5d4037', padding: '2px 6px', fontSize: '11px', color: '#5d4037', fontWeight: 'bold' };

const skillRowStyle = { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px dashed #8c7b65', fontFamily: "'Courier New', monospace" };
const progressBgStyle = { height: '8px', background: 'rgba(0,0,0,0.1)', border: '1px solid #8c7b65' };
const progressFillStyle = { height: '100%', background: '#5d4037' };

const avatarBoxStyle = { width: '80px', height: '100px', border: '1px solid #5d4037', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', background: 'rgba(0,0,0,0.05)' };
const dividerStyle = { borderBottom: '2px double #5d4037', fontWeight: 'bold', color: '#5d4037', marginBottom: '10px', paddingBottom: '2px' };

const descHeaderStyle = { width: '100%', borderBottom: '2px solid #5d4037', textAlign: 'center', fontWeight: 'bold', marginBottom: '20px', color: '#5d4037' };
const bigIconStyle = { fontSize: '60px', marginBottom: '10px', filter: 'grayscale(0.5) sepia(0.5)' };
const itemTitleStyle = { fontWeight: 'bold', fontSize: '16px', textTransform: 'uppercase', textAlign: 'center', marginBottom: '5px', fontFamily: "'Courier New', monospace", color: '#2b221b' };
const itemTypeStyle = { fontSize: '11px', color: '#665', marginBottom: '15px', fontFamily: "'Courier New', monospace'" };
const itemDescBoxStyle = { padding: '10px', background: 'rgba(255,255,255,0.4)', border: '1px dashed #8c7b65', width: '100%', boxSizing: 'border-box', fontStyle: 'italic', fontSize: '12px', lineHeight: '1.4', marginBottom: 'auto', color: '#3e2723' };
const actionButtonStyle = { width: '100%', padding: '12px', background: '#f0e6d2', color: '#3e2723', border: '1px solid #8c7b65', borderBottom: '3px solid #5d4037', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px', fontFamily: "'Courier New', monospace", fontSize: '14px' };