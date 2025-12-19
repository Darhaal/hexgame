"use client";

import { useState } from "react";
import { getItemData } from "../../data/itemsData";
import { SKILLS_DATA } from "../../data/skillsData";

export default function InventoryPanel({
  inventory,
  skills,
  character,
  onUseItem,
  gameTime,
  onRenameCharacter,
  onUpgradeSkill
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);
  const [tempName, setTempName] = useState(character?.name || "");

  const toggleInventory = () => setIsOpen(!isOpen);

  // --- ЛОГИКА ИНВЕНТАРЯ ---
  const selectedInstance = selectedSlotIndex !== null ? inventory[selectedSlotIndex] : null;
  const selectedData = selectedInstance ? getItemData(selectedInstance.itemId) : null;

  const getFreshness = (instance, data) => {
      if (!data.perishTime) return "Вечный";
      const ageMinutes = gameTime - instance.createdAt;
      const remainingMinutes = data.perishTime - ageMinutes;
      if (remainingMinutes <= 0) return "Испорчено";
      const hours = Math.floor(remainingMinutes / 60);
      return `${hours} ч.`;
  };

  // --- ЛОГИКА НАСТРОЕК ---
  const handleNameSave = () => {
      if (onRenameCharacter && tempName.trim() !== "") {
          onRenameCharacter(tempName);
      }
  };

  return (
    <>
      {/* КНОПКА-РЮКЗАК */}
      <div
        onClick={toggleInventory}
        style={{
            ...backpackBtnStyle,
            transform: isOpen ? "scale(0.9)" : "scale(1)"
        }}
        title="Open Menu"
      >
        🎒
      </div>

      {isOpen && (
        <div style={containerWrapperStyle}>

            {/* БОКОВЫЕ ВКЛАДКИ (Слева) */}
            <div style={sideTabsContainerStyle}>
                <button
                    onClick={() => setActiveTab('inventory')}
                    style={getTabStyle(activeTab === 'inventory')}
                    title="Инвентарь"
                >🎒</button>
                <button
                    onClick={() => setActiveTab('character')}
                    style={getTabStyle(activeTab === 'character')}
                    title="Персонаж"
                >👤</button>
                <button
                    onClick={() => setActiveTab('skills')}
                    style={getTabStyle(activeTab === 'skills')}
                    title="Навыки"
                >⚡</button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={getTabStyle(activeTab === 'settings')}
                    title="Настройки"
                >⚙️</button>
                <button
                    onClick={() => setIsOpen(false)}
                    style={{...getTabStyle(false), marginTop: 'auto', color: '#ef5350', borderColor: '#ef5350'}}
                    title="Закрыть"
                >✕</button>
            </div>

            {/* ОСНОВНАЯ ПАНЕЛЬ */}
            <div style={panelContainerStyle}>

                <div style={headerStyle}>
                    <span>{getTabTitle(activeTab)}</span>
                </div>

                <div style={contentAreaStyle}>

                    {/* --- ИНВЕНТАРЬ --- */}
                    {activeTab === 'inventory' && (
                    <div style={inventoryLayoutGrid}>
                        {/* Левая часть: Детали */}
                        <div style={detailsPanelStyle}>
                        {selectedInstance && selectedData ? (
                            <>
                            <div style={itemBigIconStyle}>{selectedData.icon}</div>
                            <h3 style={itemNameStyle}>{selectedData.name}</h3>
                            <div style={itemTypeStyle}>{selectedData.type.toUpperCase()}</div>

                            <div style={statsContainerStyle}>
                                <div style={statRowStyle}>
                                    <span>Вес:</span>
                                    <span style={{fontWeight: 'bold'}}>{selectedData.weight} кг</span>
                                </div>
                                <div style={statRowStyle}>
                                    <span>Годность:</span>
                                    <span style={{fontWeight: 'bold', color: getFreshness(selectedInstance, selectedData) === "Испорчено" ? '#c62828' : '#2e7d32'}}>
                                        {getFreshness(selectedInstance, selectedData)}
                                    </span>
                                </div>
                            </div>

                            <p style={itemDescStyle}>{selectedData.description}</p>

                            <button
                                style={useBtnStyle}
                                onClick={() => onUseItem && onUseItem(selectedInstance, selectedSlotIndex)}
                            >
                                ИСПОЛЬЗОВАТЬ
                            </button>
                            </>
                        ) : (
                            <div style={emptyDetailsStyle}>Выберите предмет</div>
                        )}
                        </div>

                        {/* Правая часть: Сетка (50 слотов) */}
                        <div style={gridContainerStyle}>
                        {inventory.map((itemInstance, index) => {
                            const data = itemInstance ? getItemData(itemInstance.itemId) : null;
                            const isSelected = selectedSlotIndex === index;
                            return (
                                <div
                                key={index}
                                onClick={() => setSelectedSlotIndex(index)}
                                style={{
                                    ...slotStyle,
                                    // Оранжевая рамка если выбран, иначе серая
                                    borderColor: isSelected ? '#F9A825' : '#BCAAA4',
                                    // Белый фон
                                    backgroundColor: isSelected ? '#FFF' : '#FFFFFF',
                                    boxShadow: isSelected ? 'inset 0 0 5px rgba(0,0,0,0.1)' : 'none',
                                    borderWidth: isSelected ? '2px' : '1px'
                                }}
                                >
                                {data && <div style={slotIconStyle}>{data.icon}</div>}
                                </div>
                            );
                        })}
                        {/* Добиваем до 50 визуально, если массив меньше */}
                        {Array.from({ length: Math.max(0, 50 - inventory.length) }).map((_, i) => (
                            <div key={`extra-${i}`} style={{...slotStyle, opacity: 0.5}}></div>
                        ))}
                        </div>
                    </div>
                    )}

                    {/* --- ПЕРСОНАЖ --- */}
                    {activeTab === 'character' && (
                        <div style={characterTabStyle}>
                            <div style={charInfoBlockStyle}>
                                <div style={avatarPlaceholderStyle}>👤</div>
                                <h2 style={{color: '#3E2723', margin: '10px 0'}}>{character?.name || "Unknown"}</h2>
                                <div style={charStatTextStyle}>Здоровье: 100%</div>
                                <div style={charStatTextStyle}>Уровень: 1</div>
                            </div>

                            <div style={equipmentGridStyle}>
                                <div style={equipSlotLabelStyle}>Голова</div>
                                <div style={equipSlotStyle}>🧢</div>

                                <div style={equipSlotLabelStyle}>Тело</div>
                                <div style={equipSlotStyle}>👕</div>

                                <div style={equipSlotLabelStyle}>Ноги</div>
                                <div style={equipSlotStyle}>👖</div>

                                <div style={equipSlotLabelStyle}>Обувь</div>
                                <div style={equipSlotStyle}>🥾</div>

                                <div style={equipSlotLabelStyle}>Оружие</div>
                                <div style={equipSlotStyle}>🗡️</div>

                                <div style={equipSlotLabelStyle}>Слот</div>
                                <div style={equipSlotStyle}>🛡️</div>
                            </div>
                        </div>
                    )}

                    {/* --- НАВЫКИ --- */}
                    {activeTab === 'skills' && (
                        <div style={skillsTabStyle}>
                            <h3 style={{color: '#3E2723', borderBottom: '1px solid #BCAAA4', paddingBottom: '5px'}}>Навыки выживания</h3>
                            <div style={skillsListStyle}>
                                {Object.entries(skills).map(([key, skill]) => {
                                    const meta = SKILLS_DATA[key];
                                    if(!meta) return null;
                                    const progress = (skill.xp % 100);
                                    return (
                                        <div key={key} style={skillRowStyle}>
                                            <div style={skillIconStyle}>{meta.icon}</div>
                                            <div style={{flex: 1}}>
                                                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                                                    <span style={{fontWeight:'bold', color: '#3E2723'}}>{meta.name}</span>
                                                    <span style={{fontSize:'12px', color:'#5D4037'}}>Ур. {skill.level}</span>
                                                </div>
                                                <div style={progressBarContainerStyle}>
                                                    <div style={{...progressBarFillStyle, width: `${progress}%`}}></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <button onClick={onUpgradeSkill} style={{...useBtnStyle, marginTop: '20px'}}>
                                ТРЕНИРОВКА (+XP)
                            </button>
                        </div>
                    )}

                    {/* --- НАСТРОЙКИ --- */}
                    {activeTab === 'settings' && (
                        <div style={settingsTabStyle}>
                            <h3 style={{color: '#3E2723'}}>Настройки профиля</h3>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px'}}>
                                <label style={{fontSize: '12px', color: '#5D4037'}}>Имя выжившего</label>
                                <input
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    style={inputStyle}
                                />
                                <button onClick={handleNameSave} style={useBtnStyle}>СОХРАНИТЬ</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
      )}
    </>
  );
}

function getTabTitle(tab) {
    switch(tab) {
        case 'inventory': return 'РЮКЗАК';
        case 'character': return 'ПЕРСОНАЖ';
        case 'skills': return 'НАВЫКИ';
        case 'settings': return 'НАСТРОЙКИ';
        default: return '';
    }
}

// --- СТИЛИ ---

const backpackBtnStyle = {
  position: 'absolute',
  bottom: '30px',
  right: '30px',
  width: '70px',
  height: '70px',
  backgroundColor: '#5D4037', // Кожа
  border: '4px solid #3E2723',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '36px',
  cursor: 'pointer',
  zIndex: 60,
  boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
  transition: 'transform 0.1s ease',
  userSelect: 'none'
};

const containerWrapperStyle = {
    position: 'absolute',
    bottom: '110px',
    right: '30px',
    display: 'flex',
    alignItems: 'flex-start',
    zIndex: 60,
    gap: '0' // Вкладки прижаты к панели
};

const sideTabsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    paddingTop: '20px'
};

const getTabStyle = (isActive) => ({
    width: '50px',
    height: '50px',
    // Белый цвет для активной, дерево для неактивной
    backgroundColor: isActive ? '#FFFFFF' : '#4E342E',
    backgroundImage: isActive ? 'none' : `url('/textures/wood_dark.jpg')`,
    backgroundSize: 'cover',
    color: isActive ? '#3E2723' : '#D7CCC8',
    border: '2px solid #5D4037',
    // Убираем правую границу у активной, чтобы сливалась
    borderRight: isActive ? 'none' : '2px solid #5D4037',
    borderRadius: '8px 0 0 8px',
    cursor: 'pointer',
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
    // Сдвигаем активную немного вправо, чтобы перекрыть границу панели
    transform: isActive ? 'translateX(2px)' : 'none',
    boxShadow: isActive ? 'none' : '-2px 2px 5px rgba(0,0,0,0.3)',
    zIndex: isActive ? 2 : 1
});

const panelContainerStyle = {
  width: '700px',
  height: '500px',

  // БЕЛЫЙ ФОН
  backgroundColor: '#FFFFFF',

  // ДЕРЕВЯННАЯ РАМКА
  border: '12px solid transparent',
  borderImage: 'url("/textures/wood_dark.jpg") 30 round',

  boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const headerStyle = {
  backgroundColor: '#FFFFFF', // Белый хедер
  color: '#3E2723',
  padding: '10px 20px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  borderBottom: '2px solid #BCAAA4',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '18px'
};

const contentAreaStyle = {
    flex: 1,
    padding: '20px',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFFFF'
};

// --- СТИЛИ ИНВЕНТАРЯ ---
const inventoryLayoutGrid = {
    display: 'flex',
    height: '100%',
    gap: '15px'
};

const detailsPanelStyle = {
  width: '220px',
  backgroundColor: '#FAFAFA', // Очень светлый серый
  borderRadius: '4px',
  border: '1px solid #BCAAA4',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  color: '#3E2723'
};

const gridContainerStyle = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
  gridAutoRows: '60px',
  gap: '8px',
  overflowY: 'auto',
  paddingRight: '5px',
  alignContent: 'start',
  scrollbarWidth: 'thin',
  scrollbarColor: '#8D6E63 transparent'
};

const slotStyle = {
  border: '1px solid #BCAAA4',
  borderRadius: '4px',
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.1s',
  backgroundColor: '#FFFFFF'
};

const slotIconStyle = {
  fontSize: '32px',
  userSelect: 'none',
  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
};

const itemBigIconStyle = { fontSize: '72px', marginBottom: '10px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' };
const itemNameStyle = { margin: '5px 0', fontSize: '18px', color: '#3E2723', textTransform: 'uppercase', lineHeight: '1.2', fontWeight: 'bold' };
const itemTypeStyle = { fontSize: '11px', color: '#795548', marginBottom: '15px', letterSpacing: '1px', borderBottom: '1px solid #BCAAA4', width: '100%', paddingBottom: '5px' };
const statsContainerStyle = { width: '100%', marginBottom: '15px', fontSize: '13px', color: '#5D4037', background: '#F5F5F5', padding: '8px', borderRadius: '4px', border: '1px solid #EEEEEE' };
const statRowStyle = { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' };
const itemDescStyle = { fontSize: '13px', lineHeight: '1.5', color: '#4E342E', flex: 1, textAlign: 'left', fontStyle: 'italic', marginBottom: '10px' };
const useBtnStyle = { width: '100%', padding: '10px', marginTop: 'auto', backgroundColor: '#FFFFFF', color: '#3E2723', border: '1px solid #3E2723', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textTransform: 'uppercase', letterSpacing: '1px' };
const emptyDetailsStyle = { color: '#BDBDBD', fontSize: '14px', fontStyle: 'italic', marginTop: '60%' };

// --- СТИЛИ ПЕРСОНАЖА ---
const characterTabStyle = {
    display: 'flex',
    height: '100%',
    gap: '20px'
};

const charInfoBlockStyle = {
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRight: '1px solid #E0E0E0',
    paddingRight: '20px'
};

const avatarPlaceholderStyle = {
    width: '120px',
    height: '120px',
    backgroundColor: '#F5F5F5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    border: '4px solid #E0E0E0'
};

const charStatTextStyle = {
    fontSize: '14px',
    color: '#5D4037',
    margin: '2px 0'
};

const equipmentGridStyle = {
    flex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    alignContent: 'center'
};

const equipSlotStyle = {
    height: '60px',
    width: '60px',
    backgroundColor: '#FAFAFA',
    border: '2px dashed #BCAAA4',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    margin: '0 auto'
};

const equipSlotLabelStyle = {
    textAlign: 'center',
    fontSize: '11px',
    color: '#795548',
    marginBottom: '2px'
};

// --- СТИЛИ НАВЫКОВ ---
const skillsTabStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
};

const skillsListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginTop: '15px'
};

const skillRowStyle = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #E0E0E0'
};

const skillIconStyle = {
    fontSize: '24px',
    marginRight: '15px',
    width: '32px',
    textAlign: 'center'
};

const progressBarContainerStyle = {
    height: '8px',
    backgroundColor: '#E0E0E0',
    borderRadius: '4px',
    overflow: 'hidden'
};

const progressBarFillStyle = {
    height: '100%',
    backgroundColor: '#66bb6a',
    transition: 'width 0.3s'
};

// --- СТИЛИ НАСТРОЕК ---
const settingsTabStyle = {
    padding: '20px'
};

const inputStyle = {
    padding: '10px',
    border: '1px solid #BCAAA4',
    borderRadius: '4px',
    backgroundColor: '#fff',
    fontSize: '14px',
    color: '#3E2723',
    outline: 'none'
};