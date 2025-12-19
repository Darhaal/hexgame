"use client";

import { useState, useEffect, useRef } from "react";

// Добавлены пропсы isOpen и onToggle
export default function TilePanel({ tile, isOpen, onToggle, onSleep, onEat, onDrink }) {
  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  // Локальное состояние для плавного закрытия
  // Если тайл пропадает (игрок пошел), мы хотим закрыть панель, но не убивать DOM сразу,
  // чтобы анимация проигралась.
  // Но если tile стал null, нам нечего показывать внутри.
  // Поэтому запоминаем последний тайл для отображения контента во время закрытия.
  const [lastTile, setLastTile] = useState(tile);

  useEffect(() => {
    if (tile) {
      setLastTile(tile);
    }
  }, [tile]);

  // Используем lastTile для рендера, если tile null
  const displayTile = tile || lastTile;

  // Клик вне панели для закрытия (только закрывает, не открывает)
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Если панель открыта, и клик не по ней и не по кнопке
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        // Вызываем внешний хендлер
        if (onToggle) onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const togglePanel = () => {
    // Разрешаем переключать только если есть АКТИВНЫЙ тайл (игрок стоит)
    if (!tile) return;
    if (onToggle) onToggle();
  };

  const isHome = displayTile && displayTile.q === 0 && displayTile.r === 0;

  // Если у нас нет даже последнего тайла (самый старт игры), ничего не рендерим.
  if (!displayTile) return null;

  // Вычисляем реальное состояние открытия:
  // Панель открыта ТОЛЬКО если isOpen=true И есть активный tile.
  // Если tile=null (игрок идет), панель должна быть закрыта визуально, даже если isOpen=true в родителе.
  const isVisuallyOpen = isOpen && tile !== null;

  // Кнопка видна, только если есть активный тайл (игрок стоит)
  const isButtonVisible = tile !== null;

  return (
    <>
      <aside
        ref={panelRef}
        style={{
          ...panelContainerStyle,
          // Если нет активного тайла, панель уезжает (-100%)
          transform: isVisuallyOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: isVisuallyOpen ? "5px 0 25px rgba(0,0,0,0.6)" : "none",
        }}
      >
        <div style={innerContentStyle}>
          <div style={headerStyle}>
            <h2 style={titleStyle}>
              {isHome ? "🏠 Home" : (displayTile.name || `Tile ${displayTile.q},${displayTile.r}`)}
            </h2>
            <div style={subTitleStyle}>
              Coordinates: {displayTile.q}, {displayTile.r} <br/>
              Type: {displayTile.type}
            </div>
          </div>

          <div style={scrollContentStyle}>
            {isHome && (
              <div style={actionGroupStyle}>
                <div style={infoBoxStyle}>
                  Safe haven. Replenish your supplies and rest fully here.
                </div>

                <button onClick={onSleep} style={actionBtnStyle}>
                  <span style={emojiStyle}>🛏️</span>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>Sleep</div>
                    <div style={btnDescStyle}>+8h, Restore Energy</div>
                  </div>
                </button>

                <button onClick={onEat} style={actionBtnStyle}>
                  <span style={emojiStyle}>🍎</span>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>Eat Meal</div>
                    <div style={btnDescStyle}>+50 Food</div>
                  </div>
                </button>

                <button onClick={onDrink} style={actionBtnStyle}>
                  <span style={emojiStyle}>💧</span>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>Drink Water</div>
                    <div style={btnDescStyle}>+50 Water</div>
                  </div>
                </button>
              </div>
            )}

            {!isHome && (displayTile.type === "base" || displayTile.type === "village") && (
              <div style={actionGroupStyle}>
                <div style={infoBoxStyle}>
                  A safe place to stop for a while.
                </div>
                <button onClick={onSleep} style={actionBtnStyle}>
                  <span style={emojiStyle}>⛺</span>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>Rest</div>
                    <div style={btnDescStyle}>+1h, Small recovery</div>
                  </div>
                </button>
              </div>
            )}

            {!isHome && displayTile.type !== "base" && displayTile.type !== "village" && (
                 <div style={infoBoxStyle}>
                    Just a wild land. Nothing to do here.
                 </div>
            )}
          </div>
        </div>
      </aside>

      {/* Кнопка-toggle сбоку */}
      <div
        ref={toggleRef}
        onClick={togglePanel}
        style={{
            ...toggleBtnStyle,
            left: isVisuallyOpen ? "400px" : "0",
            borderLeft: isVisuallyOpen ? "none" : "2px solid #2d1b0e",
            // ВАЖНО: Убран transform контейнера
            boxSizing: "border-box",
            opacity: isButtonVisible ? 1 : 0,
            pointerEvents: isButtonVisible ? 'all' : 'none'
        }}
      >
        {/* Вращаем только стрелочку */}
        <span style={{
            display: "inline-block",
            transition: "transform 0.3s ease",
            transform: isVisuallyOpen ? "rotate(0deg)" : "rotate(180deg)"
        }}>
          ◀
        </span>
      </div>
    </>
  );
}

// --- СТИЛИ ---

const panelContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "400px",
  height: "100vh",

  // Текстура дерева
  backgroundImage: `url('/textures/wood_dark.jpg')`,
  backgroundSize: 'cover',
  backgroundColor: '#4E342E',

  zIndex: 50,
  paddingRight: "16px",
  paddingBottom: "16px",
  paddingTop: "16px",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease",
  boxSizing: 'border-box'
};

const innerContentStyle = {
  width: '100%',
  height: '100%',
  background: '#fdfbf7', // Бумага
  border: 'none',
  borderRadius: '4px',
  padding: '12px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.15)',
  overflow: 'hidden'
};

const headerStyle = {
    borderBottom: '2px solid #8D6E63',
    paddingBottom: '10px',
    marginBottom: '10px',
    opacity: 0.9
};

const titleStyle = {
    margin: '0 0 5px 0',
    fontSize: '24px',
    color: '#3E2723',
    fontWeight: 'bold'
};

const subTitleStyle = {
    color: '#5D4037',
    fontSize: '13px',
    fontFamily: 'monospace',
    lineHeight: '1.4'
};

const scrollContentStyle = {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '10px'
};

const actionGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
};

const infoBoxStyle = {
  backgroundColor: '#EFEBE9',
  padding: '12px',
  borderRadius: '6px',
  color: '#4E342E',
  fontSize: '14px',
  lineHeight: '1.5',
  borderLeft: '4px solid #8D6E63',
  fontStyle: 'italic'
};

const actionBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#fff',
  border: '1px solid #D7CCC8',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  textAlign: 'left'
};

const emojiStyle = { fontSize: '26px' };

const btnTextStyle = { display: 'flex', flexDirection: 'column' };

const btnTitleStyle = { fontWeight: 'bold', color: '#3E2723', fontSize: '15px' };

const btnDescStyle = { fontSize: '12px', color: '#795548' };

const toggleBtnStyle = {
    position: 'absolute',
    top: '50%',
    width: '24px',
    height: '60px',
    marginTop: '-30px',
    backgroundColor: '#4E342E',
    border: '2px solid #2d1b0e',
    // borderLeft динамически переключается в компоненте
    borderRadius: '0 8px 8px 0',
    color: '#D7CCC8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 51,
    // transition теперь без transform для контейнера
    transition: 'left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease',
    fontSize: '12px',
    boxShadow: '4px 0 10px rgba(0,0,0,0.3)',
    boxSizing: 'border-box' // Важно чтобы границы не увеличивали размер
};