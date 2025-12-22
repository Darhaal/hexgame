"use client";

import { useState, useEffect, useRef } from "react";

// --- ДАННЫЕ (РЫБАЛКА) ---
const ITEMS_DB = {
  "rod_basic": { name: "Удочка (Бамбук)", type: "Снасти", weight: 0.5, icon: "🎣", description: "Простая поплавочная удочка. Надежная.", perishTime: 0 },
  "worms": { name: "Черви (Навозные)", type: "Наживка", weight: 0.1, icon: "🪱", description: "Свежие, активные. Лещ берет охотно.", perishTime: 1200 },
  "bread": { name: "Хлебный мякиш", type: "Наживка", weight: 0.2, icon: "🍞", description: "Сдобренный анисом. Для карася.", perishTime: 600 },
  "vodka": { name: "Фляга 'Заветная'", type: "Напиток", weight: 0.5, icon: "🍶", description: "Согревает душу и тело. НЗ.", perishTime: 0 },
  "knife": { name: "Нож складной", type: "Инструмент", weight: 0.1, icon: "🔪", description: "Очистить рыбу, нарезать леску.", perishTime: 0 },
  "fish_perch": { name: "Окунь речной", type: "Улов", weight: 0.3, icon: "🐟", description: "Хищник. Пойман на блесну.", perishTime: 120 },
};

const SKILLS_DB = {
  "fishing": { name: "Ловля поплавком", icon: "🎣" },
  "cooking": { name: "Уха и копчение", icon: "🍳" },
  "survival": { name: "Туризм", icon: "🌲" },
  "crafting": { name: "Ремонт снастей", icon: "🔨" }
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

  // Состояния для размера и позиции
  const [size, setSize] = useState({ width: 900, height: 650 });
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Смещение от центра

  // Состояния взаимодействия
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartOffset = useRef({ x: 0, y: 0 });

  // Анимация
  const [isVisible, setIsVisible] = useState(false);
  const [pageTurn, setPageTurn] = useState(0);

  // --- ВОССТАНОВЛЕНИЕ СОСТОЯНИЯ ---
  useEffect(() => {
    try {
        const savedSize = localStorage.getItem('inventory_panel_size');
        const savedPos = localStorage.getItem('inventory_panel_pos');
        if (savedSize) setSize(JSON.parse(savedSize));
        if (savedPos) setPosition(JSON.parse(savedPos));
    } catch (e) {
        console.warn("Ошибка загрузки состояния инвентаря", e);
    }

    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // --- СОХРАНЕНИЕ ---
  const saveState = (newSize, newPos) => {
      try {
          if(newSize) localStorage.setItem('inventory_panel_size', JSON.stringify(newSize));
          if(newPos) localStorage.setItem('inventory_panel_pos', JSON.stringify(newPos));
      } catch (e) { console.warn(e); }
  };

  useEffect(() => {
    setPageTurn(-90);
    const timer1 = setTimeout(() => {
        setActiveTab(initialTab);
        setPageTurn(0);
    }, 150);
    return () => clearTimeout(timer1);
  }, [initialTab]);

  const handleTabChange = (newTab) => {
      if (activeTab === newTab) return;
      setPageTurn(-90);
      setTimeout(() => {
          setActiveTab(newTab);
          setPageTurn(0);
      }, 300);
  };

  // --- ОБРАБОТКА DRAG & RESIZE ---
  const handleMouseDownHeader = (e) => {
      if (e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      setIsDragging(true);
      dragStartOffset.current = {
          x: e.clientX - position.x,
          y: e.clientY - position.y
      };
  };

  const handleMouseDownResize = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
          setPosition({
              x: e.clientX - dragStartOffset.current.x,
              y: e.clientY - dragStartOffset.current.y
          });
      }

      if (isResizing) {
        const maxWidth = window.innerWidth - 40;
        const maxHeight = window.innerHeight - 40;

        setSize(prev => ({
          width: Math.min(maxWidth, Math.max(600, prev.width + e.movementX)),
          height: Math.min(maxHeight, Math.max(400, prev.height + e.movementY))
        }));
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
          setIsDragging(false);
          setIsResizing(false);
          saveState(size, position);
      }
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, size, position]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 500);
  };

  const selectedInstance = selectedSlotIndex !== null ? inventory[selectedSlotIndex] : null;
  const selectedData = selectedInstance ? getItemData(selectedInstance.itemId) : null;

  const getTabTitle = () => {
      switch(activeTab) {
          case 'inventory': return "ОПИСЬ СНАРЯЖЕНИЯ";
          case 'character': return "РЫБОЛОВНЫЙ БИЛЕТ";
          case 'skills': return "РАЗРЯДНАЯ КНИЖКА";
          case 'journal': return "ДНЕВНИК НАБЛЮДЕНИЙ";
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
                transform: `
                    translate3d(${position.x}px, ${position.y}px, 0)
                    ${isVisible
                        ? 'scale(1) rotate(0deg) translate3d(0,0,0)'
                        : 'scale(0.2) rotate(-15deg) translate3d(300px, 500px, 0)'
                    }
                `,
                transformOrigin: 'bottom right',
                opacity: isVisible ? 1 : 0,
                transition: (isDragging || isResizing)
                    ? 'none'
                    : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.1), opacity 0.4s ease'
            }}
        >
            <div style={{
                position: 'absolute', inset: 0,
                boxShadow: isVisible ? '0 25px 60px rgba(0,0,0,0.6)' : 'none',
                pointerEvents: 'none',
                transition: 'box-shadow 0.6s ease',
                borderRadius: '2px'
            }}></div>

            <div style={{...boltStyle, top: 6, left: 6}}>+</div>
            <div style={{...boltStyle, top: 6, right: 6}}>+</div>
            <div style={{...boltStyle, bottom: 6, left: 6}}>+</div>

            <div
                style={{
                    ...headerContainerStyle,
                    cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDownHeader}
            >
                <div style={{display:'flex', alignItems:'center', gap:'15px', pointerEvents: 'none'}}>
                    <span style={docNumberStyle}>РЫБНАДЗОР № 5</span>
                    <div style={headerTitleStyle}>{getTabTitle()}</div>
                </div>

                <div style={{display:'flex', gap: '8px'}}>
                     {['inventory', 'character', 'skills', 'journal'].map(tab => (
                         <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            style={{
                                ...tabButtonStyle,
                                backgroundColor: activeTab === tab ? '#c23b22' : '#3e352d',
                                color: activeTab === tab ? '#fff' : '#8c7b65',
                                borderBottom: activeTab === tab ? 'none' : '2px solid #2d241b',
                                transform: activeTab === tab ? 'translateY(4px)' : 'translateY(0)',
                                opacity: activeTab === tab ? 1 : 0.8
                            }}
                         >
                            {tab === 'inventory' && 'СНАСТИ'}
                            {tab === 'character' && 'БИЛЕТ'}
                            {tab === 'skills' && 'ОПЫТ'}
                            {tab === 'journal' && 'ЗАПИСИ'}
                         </button>
                     ))}
                </div>

                <button onClick={handleClose} style={closeBtnStyle} title="Убрать в карман">
                    ✕
                </button>
            </div>

            <div style={{
                ...paperContentStyle,
                transform: `rotateX(${pageTurn}deg)`,
                opacity: Math.max(0, 1 - Math.abs(pageTurn) / 60),
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
            }}>

                <div style={contentGridStyle}>

                    {/* Левая колонка (ФИКСИРОВАННАЯ ШИРИНА 60%) */}
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
                                                backgroundColor: isSelected ? 'rgba(93, 64, 55, 0.15)' : 'transparent',
                                                borderLeft: isSelected ? '4px solid #c23b22' : '4px solid transparent',
                                            }}
                                        >
                                            <div style={{width: '30px', textAlign:'center', fontSize: '20px'}}>{data?.icon}</div>
                                            <div style={{flex: 1, fontWeight: isSelected ? 'bold' : 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{data?.name || "Пусто"}</div>
                                            {item && <div style={qtyTagStyle}>1 шт.</div>}
                                        </div>
                                    );
                                }) : (
                                    <div style={emptyStateStyle}>Рюкзак пуст. Пора копать червей.</div>
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
                                                    <span>РАЗРЯД {skill.level}</span>
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
                                    <div style={photoFrameStyle}>ФОТО 3x4</div>
                                    <div>
                                        <div style={{fontSize:'20px', fontWeight:'900', color:'#2b221b', textTransform:'uppercase'}}>
                                            {character.name || "РЫБАК И.И."}
                                        </div>
                                        <div style={{marginTop:'5px', color:'#5d4037', fontSize:'12px'}}>
                                            Статус: Любитель<br/>
                                            Общество: "Тихая Заводь"<br/>
                                            Стаж: с 1986 года
                                        </div>
                                    </div>
                                    <div style={stampStyle}>ВЗНОСЫ УПЛАЧЕНЫ</div>
                                </div>
                                <div style={{fontSize:'12px', color:'#3e2723'}}>
                                    <p>ЛЮБИМАЯ СНАСТЬ: Поплавочная удочка.</p>
                                    <p>РЕКОРДНЫЙ УЛОВ: Щука (3.5 кг).</p>
                                    <p>МЕСТО ПРИПИСКИ: Лодочная станция №2.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'journal' && (
                            <div style={{padding: '15px', fontStyle: 'italic', color: '#3e2723'}}>
                                <p style={{borderBottom:'1px solid #cfc6b8', paddingBottom:'5px', fontWeight:'bold'}}>// АРХИВ ЗАПИСЕЙ</p>
                                <p style={{marginTop:'10px'}}>12.05 — Прибыл на вечернюю зорьку. Ветра нет. Комары лютуют.</p>
                                <p style={{marginTop:'10px'}}>13.05 — Подкормил место жмыхом. Жду леща. Сосед справа вытащил карася с ладонь.</p>
                            </div>
                        )}
                    </div>

                    {/* Правая колонка (ФИКСИРОВАННАЯ ШИРИНА 40%) */}
                    <div style={rightColStyle}>
                         <div style={detailsHeaderStyle}>ИНФОРМАЦИЯ</div>
                         {selectedData ? (
                            <>
                                <div style={itemPreviewContainerStyle}>
                                    <div style={{fontSize: '64px'}}>{selectedData.icon}</div>
                                </div>

                                <div style={itemNameStyle}>{selectedData.name}</div>

                                <div style={propTableStyle}>
                                    <div style={propRowStyle}>
                                        <span>Категория:</span>
                                        <span style={{fontWeight:'bold'}}>{selectedData.type}</span>
                                    </div>
                                    <div style={propRowStyle}>
                                        <span>Масса:</span>
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
                                 ВЫБЕРИТЕ ПРЕДМЕТ ДЛЯ ОСМОТРА
                             </div>
                         )}
                    </div>
                </div>
            </div>

            <div
                onMouseDown={handleMouseDownResize}
                style={resizeHandleStyle}
                title="Изменить размер"
            >
                ◢
            </div>

        </div>
    </div>
  );
}

// --- СТИЛИ ---

const overlayContainerStyle = {
    position: 'fixed',
    inset: 0,
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    perspective: '1500px'
};

const folderBodyStyle = {
    pointerEvents: 'auto',
    backgroundColor: "#4a4036",
    backgroundImage: `
        linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 5%, rgba(0,0,0,0) 95%, rgba(0,0,0,0.6) 100%),
        repeating-linear-gradient(45deg, #4a4036 0, #4a4036 2px, #3e352d 2px, #3e352d 4px)
    `,
    border: "4px solid #2d241b",
    borderTop: "2px solid #5d4037",
    display: "flex",
    flexDirection: "column",
    padding: "12px",
    position: "relative",
    boxSizing: 'border-box',
    fontFamily: "'Courier New', monospace",
    minWidth: '600px',
    minHeight: '400px',
    backfaceVisibility: 'hidden',
    willChange: 'transform, opacity, width, height'
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
    height: '40px',
    userSelect: 'none'
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
    fontSize: '10px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '8px 10px',
    borderRadius: '2px 2px 0 0',
    transition: 'all 0.2s',
    fontFamily: "'Courier New', monospace",
    letterSpacing: '1px',
    pointerEvents: 'auto'
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
    flexDirection: 'column',
    perspective: '1000px'
};

const contentGridStyle = {
    display: 'flex',
    flex: 1,
    height: '100%',
    overflow: 'hidden'
};

// --- ФИКСАЦИЯ ШИРИНЫ КОЛОНОК ---
const leftColStyle = {
    flex: '0 0 60%', // Жестко 60% ширины
    maxWidth: '60%', // Не даем расти
    borderRight: '2px solid #b0a390',
    overflowY: 'auto',
    padding: '0',
    scrollbarWidth: 'thin',
    scrollbarColor: '#8c7b65 transparent',
    backgroundColor: 'rgba(255,255,255,0.1)'
};

const rightColStyle = {
    flex: '1', // Занимает оставшееся место (40%)
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderLeft: '1px solid #fff',
    overflow: 'hidden' // Чтобы не ломалось при ресайзе
};

const listContainerStyle = { display: 'flex', flexDirection: 'column' };

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
    fontWeight: 'bold',
    marginLeft: 'auto' // Прижимаем к правому краю
};

const emptyStateStyle = {
    textAlign: 'center',
    marginTop: '60px',
    color: '#8c7b65',
    fontStyle: 'italic',
    fontSize: '14px'
};

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
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
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

const resizeHandleStyle = {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '24px',
    height: '24px',
    cursor: 'se-resize',
    color: '#8c7b65',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 10,
    userSelect: 'none'
};