"use client";

import { useState, useEffect, useRef } from "react";

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

  // Состояния для размера окна и анимации
  const [size, setSize] = useState({ width: 900, height: 650 });
  const [isResizing, setIsResizing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // Состояние для анимации смены контента (перелистывание страниц)
  const [contentOpacity, setContentOpacity] = useState(1);

  // --- ВОССТАНОВЛЕНИЕ РАЗМЕРА ---
  useEffect(() => {
    // Пытаемся восстановить сохраненный размер при загрузке
    try {
        const savedSize = localStorage.getItem('inventory_panel_size');
        if (savedSize) {
            setSize(JSON.parse(savedSize));
        }
    } catch (e) {
        console.warn("Не удалось загрузить размер панели", e);
    }

    // Небольшая задержка для корректного старта CSS-транзишна
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- СОХРАНЕНИЕ РАЗМЕРА ---
  const saveSize = (newSize) => {
      try {
          localStorage.setItem('inventory_panel_size', JSON.stringify(newSize));
      } catch (e) {
          console.warn("Не удалось сохранить размер панели", e);
      }
  };

  useEffect(() => {
    // Эффект "перелистывания" при смене вкладки
    setContentOpacity(0);
    const timer = setTimeout(() => {
        setActiveTab(initialTab);
        setContentOpacity(1);
    }, 150); // Быстрое затухание и появление
    return () => clearTimeout(timer);
  }, [initialTab]);

  const handleTabChange = (newTab) => {
      if (activeTab === newTab) return;
      setContentOpacity(0);
      setTimeout(() => {
          setActiveTab(newTab);
          setContentOpacity(1);
      }, 150);
  };

  // --- ЛОГИКА ИЗМЕНЕНИЯ РАЗМЕРА ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        setSize(prev => ({
          width: Math.max(600, prev.width + e.movementX),
          height: Math.max(400, prev.height + e.movementY)
        }));
      }
    };

    const handleMouseUp = () => {
      if (isResizing) {
          setIsResizing(false);
          saveSize(size); // Сохраняем размер при отпускании мыши
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, size]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500); // Ждем завершения анимации
  };

  const selectedInstance = selectedSlotIndex !== null ? inventory[selectedSlotIndex] : null;
  const selectedData = selectedInstance ? getItemData(selectedInstance.itemId) : null;

  const getTabTitle = () => {
      switch(activeTab) {
          case 'inventory': return "ИНВЕНТАРНАЯ ВЕДОМОСТЬ";
          case 'character': return "ЛИЧНОЕ ДЕЛО";
          case 'skills': return "КВАЛИФИКАЦИЯ";
          case 'journal': return "ПОЛЕВОЙ ЖУРНАЛ";
          default: return "МЕНЮ";
      }
  };

  return (
    <div style={overlayContainerStyle}>
        <div
            style={{
                ...folderBodyStyle,
                width: `${size.width}px`,
                height: `${size.height}px`,

                // --- ОБНОВЛЕННАЯ АНИМАЦИЯ (В КАРМАН/В УГОЛ) ---
                // Точка трансформации - правый нижний угол (откуда достаем/куда убираем)
                transformOrigin: 'bottom right',

                transform: isVisible
                    ? 'translate3d(0, 0, 0) scale(1) rotate(0deg)'
                    // Уходит вправо-вниз, сильно уменьшается и поворачивается
                    : 'translate3d(200px, 400px, 0) scale(0.2) rotate(-15deg)',

                opacity: isVisible ? 1 : 0,

                // Используем bezier для ощущения "тяжести" предмета при доставании
                transition: isResizing
                    ? 'none'
                    : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1), opacity 0.4s ease'
            }}
        >
            {/* Тень для объема */}
            <div style={{
                position: 'absolute', inset: 0,
                boxShadow: isVisible ? '0 20px 50px rgba(0,0,0,0.5)' : 'none',
                pointerEvents: 'none',
                transition: 'box-shadow 0.6s ease'
            }}></div>

            {/* Декоративные болты */}
            <div style={{...boltStyle, top: 6, left: 6}}>+</div>
            <div style={{...boltStyle, top: 6, right: 6}}>+</div>
            <div style={{...boltStyle, bottom: 6, left: 6}}>+</div>

            {/* Шапка (Корешок) */}
            <div style={headerContainerStyle}>
                <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
                    <span style={docNumberStyle}>№ 04-22/Б</span>
                    <div style={headerTitleStyle}>{getTabTitle()}</div>
                </div>

                <div style={{display:'flex', gap: '10px'}}>
                     {/* Вкладки */}
                     {['inventory', 'character', 'skills', 'journal'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            style={{
                                ...tabButtonStyle,
                                backgroundColor: activeTab === tab ? '#c23b22' : '#3e352d',
                                color: activeTab === tab ? '#fff' : '#8c7b65',
                                borderBottom: activeTab === tab ? 'none' : '2px solid #2d241b',
                                transform: activeTab === tab ? 'translateY(2px)' : 'translateY(0)', // Эффект нажатия
                            }}
                         >
                            {tab === 'inventory' && 'РЮКЗАК'}
                            {tab === 'character' && 'ПРОФИЛЬ'}
                            {tab === 'skills' && 'НАВЫКИ'}
                            {tab === 'journal' && 'ЖУРНАЛ'}
                         </button>
                     ))}
                </div>

                <button onClick={handleClose} style={closeBtnStyle} title="Закрыть папку">
                    ✕
                </button>
            </div>

            {/* Бумажный контент с анимацией смены страниц */}
            <div style={{
                ...paperContentStyle,
                opacity: contentOpacity,
                transform: `translateX(${contentOpacity === 1 ? '0' : '-10px'})`, // Легкий сдвиг при смене
                transition: 'opacity 0.2s ease, transform 0.2s ease'
            }}>

                {/* Внутренний грид */}
                <div style={contentGridStyle}>

                    {/* Левая колонка (Список) */}
                    <div style={leftColStyle}>
                        {activeTab === 'inventory' && (
                            <div style={listContainerStyle}>
                                {inventory.length > 0 ? inventory.map((item, idx) => {
                                    const data = item ? getItemData(item.itemId) : null;
                                    const isSelected = selectedSlotIndex === idx;
                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedSlotIndex(idx)}
                                            style={{
                                                ...listItemStyle,
                                                backgroundColor: isSelected ? 'rgba(93, 64, 55, 0.1)' : 'transparent',
                                                borderLeft: isSelected ? '4px solid #c23b22' : '4px solid transparent',
                                            }}
                                        >
                                            <div style={{width: '30px', textAlign:'center', fontSize: '18px'}}>{data?.icon}</div>
                                            <div style={{flex: 1, fontWeight: isSelected ? 'bold' : 'normal'}}>{data?.name || "Пустой слот"}</div>
                                            {item && <div style={qtyTagStyle}>1 шт.</div>}
                                        </div>
                                    );
                                }) : (
                                    <div style={emptyStateStyle}>Имущество отсутствует.</div>
                                )}
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div style={listContainerStyle}>
                                {Object.entries(skills).map(([key, skill]) => {
                                    const meta = SKILLS_DB[key];
                                    if(!meta) return null;
                                    return (
                                        <div key={key} style={skillRowStyle}>
                                            <div style={{fontSize: '24px', marginRight: '15px'}}>{meta.icon}</div>
                                            <div style={{flex: 1}}>
                                                <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}>
                                                    <span style={{fontWeight:'bold'}}>{meta.name}</span>
                                                    <span>КВЛ. {skill.level}</span>
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
                                <div style={{display:'flex', gap:'20px', alignItems:'flex-start', borderBottom:'1px dashed #8c7b65', paddingBottom:'20px', marginBottom:'20px'}}>
                                    <div style={photoFrameStyle}>ФОТО</div>
                                    <div>
                                        <div style={{fontSize:'20px', fontWeight:'900', color:'#2b221b', textTransform:'uppercase'}}>
                                            {character.name || "НЕИЗВЕСТНЫЙ"}
                                        </div>
                                        <div style={{marginTop:'5px', color:'#5d4037', fontSize:'12px'}}>
                                            Год рождения: 1986<br/>
                                            Статус: Гражданский<br/>
                                            Приписан: База "Восток"
                                        </div>
                                    </div>
                                    <div style={stampStyle}>ДОПУЩЕН</div>
                                </div>
                                <div style={{fontSize:'12px', color:'#3e2723'}}>
                                    <p>ОСОБЫЕ ПРИМЕТЫ: Отсутствуют.</p>
                                    <p>МЕДИЦИНСКИЕ ПОКАЗАНИЯ: В норме.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'journal' && (
                            <div style={{padding: '15px', fontStyle: 'italic', color: '#3e2723'}}>
                                <p style={{borderBottom:'1px solid #cfc6b8', paddingBottom:'5px', fontWeight:'bold'}}>// ПОСЛЕДНИЕ ЗАПИСИ</p>
                                <p style={{marginTop:'10px'}}>12.05 — Прибыл в сектор. Оборудование в норме. Погода благоприятная.</p>
                                <p style={{marginTop:'10px'}}>13.05 — Обнаружил следы стоянки. Костер старый.</p>
                            </div>
                        )}
                    </div>

                    {/* Правая колонка (Детали) */}
                    <div style={rightColStyle}>
                         <div style={detailsHeaderStyle}>КАРТОЧКА ОБЪЕКТА</div>
                         {selectedData ? (
                            <>
                                <div style={itemPreviewContainerStyle}>
                                    <div style={{fontSize: '64px'}}>{selectedData.icon}</div>
                                </div>

                                <div style={itemNameStyle}>{selectedData.name}</div>

                                <div style={propTableStyle}>
                                    <div style={propRowStyle}>
                                        <span>Тип:</span>
                                        <span style={{fontWeight:'bold'}}>{selectedData.type}</span>
                                    </div>
                                    <div style={propRowStyle}>
                                        <span>Вес:</span>
                                        <span style={{fontWeight:'bold'}}>{selectedData.weight} кг</span>
                                    </div>
                                </div>

                                <div style={descriptionBoxStyle}>
                                    {selectedData.description}
                                </div>

                                <div style={{marginTop:'auto', width:'100%'}}>
                                    <button onClick={onUseItem} style={actionButtonStyle}>
                                        ИСПОЛЬЗОВАТЬ
                                    </button>
                                </div>
                            </>
                         ) : (
                             <div style={emptyDetailStyle}>
                                 ВЫБЕРИТЕ ЭЛЕМЕНТ ИЗ СПИСКА ДЛЯ ПРОСМОТРА ИНФОРМАЦИИ
                             </div>
                         )}
                    </div>
                </div>
            </div>

            {/* Ручка для изменения размера (Resize Handle) */}
            <div
                onMouseDown={handleMouseDown}
                style={resizeHandleStyle}
                title="Изменить размер"
            >
                ◢
            </div>

        </div>
    </div>
  );
}

// --- СТИЛИ (POST-SOVIET MINIMALISM / TILEPANEL MATCH) ---

const overlayContainerStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    perspective: '1500px' // ВАЖНО: Добавляет 3D перспективу сцене
};

const folderBodyStyle = {
    pointerEvents: 'auto',
    backgroundColor: "#4a4036", // Темно-коричневый (как TilePanel)
    backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.6) 100%),
        repeating-linear-gradient(45deg, #4a4036 0, #4a4036 2px, #3e352d 2px, #3e352d 4px)
    `,
    border: "4px solid #2d241b",
    borderTop: "2px solid #5d4037",
    // Тень задается теперь внутри самого блока через boxShadow для большей производительности
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    position: "relative",
    boxSizing: 'border-box',
    fontFamily: "'Courier New', monospace",
    minWidth: '600px',
    minHeight: '400px',
    backfaceVisibility: 'hidden', // Скрывает заднюю часть при вращении
    willChange: 'transform, opacity' // Оптимизация браузера
};

const boltStyle = {
    position: 'absolute',
    color: '#2d241b',
    fontSize: '12px',
    fontWeight: 'bold',
    zIndex: 2,
    pointerEvents: 'none',
    opacity: 0.5
};

const headerContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    padding: '0 5px',
    height: '40px'
};

const docNumberStyle = {
    fontSize: '10px',
    color: '#8c7b65',
    border: '1px solid #5d4037',
    padding: '2px 4px',
    opacity: 0.7
};

const headerTitleStyle = {
    color: '#e3dac9',
    fontSize: '18px',
    fontWeight: '900',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    textShadow: '0 2px 2px rgba(0,0,0,0.8)'
};

const tabButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '11px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '2px 2px 0 0',
    transition: 'all 0.1s', // Быстрая реакция на ховер
    fontFamily: "'Courier New', monospace",
    letterSpacing: '1px'
};

const closeBtnStyle = {
    background: 'none',
    border: '2px solid #5d4037',
    color: '#e3dac9',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
    borderRadius: '2px',
    marginLeft: '10px'
};

// Бумажный лист внутри (как в TilePanel)
const paperContentStyle = {
    flex: 1,
    backgroundColor: "#e3dac9",
    backgroundImage: `
        linear-gradient(#cfc6b8 1px, transparent 1px),
        linear-gradient(90deg, #cfc6b8 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px",
    boxShadow: "inset 0 0 30px rgba(0,0,0,0.15), 0 0 5px rgba(0,0,0,0.5)",
    border: "1px solid #b0a390",
    position: "relative",
    overflow: "hidden",
    display: 'flex',
    flexDirection: 'column'
};

const contentGridStyle = {
    display: 'flex',
    flex: 1,
    height: '100%',
    overflow: 'hidden'
};

const leftColStyle = {
    flex: 2,
    borderRight: '2px solid #b0a390',
    overflowY: 'auto',
    padding: '0',
    scrollbarWidth: 'thin',
    scrollbarColor: '#8c7b65 transparent',
    backgroundColor: 'rgba(255,255,255,0.1)'
};

const rightColStyle = {
    flex: 1.2, // Чуть шире для карточки
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.2)', // Эффект более светлой бумаги справа
    borderLeft: '1px solid #fff'
};

// Стили списка
const listContainerStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const listItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #cfc6b8',
    color: '#2b221b',
    fontSize: '13px',
    transition: 'background 0.1s'
};

const qtyTagStyle = {
    fontSize: '10px',
    color: '#5d4037',
    border: '1px solid #5d4037',
    padding: '1px 5px',
    borderRadius: '2px',
    fontWeight: 'bold'
};

const emptyStateStyle = {
    textAlign: 'center',
    marginTop: '60px',
    color: '#8c7b65',
    fontStyle: 'italic',
    fontSize: '14px'
};

// Навыки
const skillRowStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px dashed #8c7b65',
    color: '#3e2723'
};

const progressBgStyle = {
    height: '8px',
    background: 'rgba(0,0,0,0.1)',
    border: '1px solid #8c7b65',
    borderRadius: '2px'
};

const progressFillStyle = {
    height: '100%',
    background: '#5d4037',
    borderRadius: '1px'
};

// Карточка персонажа
const photoFrameStyle = {
    width: '80px',
    height: '100px',
    border: '2px solid #5d4037',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#5d4037',
    backgroundColor: '#d7ccc0',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)'
};

const stampStyle = {
    border: '3px solid #c23b22',
    color: '#c23b22',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '900',
    transform: 'rotate(-15deg)',
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: '2px'
};

// Детали справа
const detailsHeaderStyle = {
    fontSize: '12px',
    color: '#8c7b65',
    fontWeight: 'bold',
    borderBottom: '2px solid #8c7b65',
    paddingBottom: '5px',
    marginBottom: '15px',
    textAlign: 'center',
    letterSpacing: '2px'
};

const itemPreviewContainerStyle = {
    width: '100%',
    height: '120px',
    border: '1px solid #b0a390',
    backgroundColor: 'rgba(0,0,0,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px'
};

const itemNameStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2b221b',
    marginBottom: '10px',
    textTransform: 'uppercase',
    textAlign: 'center'
};

const propTableStyle = {
    width: '100%',
    marginBottom: '15px',
    fontSize: '12px',
    color: '#5d4037'
};

const propRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: '1px dashed #cfc6b8',
    padding: '4px 0'
};

const descriptionBoxStyle = {
    fontSize: '12px',
    lineHeight: '1.5',
    fontStyle: 'italic',
    color: '#3e2723',
    padding: '10px',
    backgroundColor: '#f0e6d2',
    border: '1px solid #cfc6b8',
    marginBottom: '15px'
};

const actionButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#5d4037',
    color: '#e3dac9',
    border: 'none',
    borderBottom: '3px solid #3e2723',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Courier New', monospace",
    textTransform: 'uppercase',
    letterSpacing: '1px',
    transition: 'background 0.2s',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const emptyDetailStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#8c7b65',
    fontSize: '12px',
    padding: '20px',
    border: '2px dashed #cfc6b8'
};

// Уголок для ресайза
const resizeHandleStyle = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '20px',
    height: '20px',
    cursor: 'se-resize',
    color: '#8c7b65',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 10,
    userSelect: 'none'
};