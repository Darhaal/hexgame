"use client";

import { useState, useEffect, useRef } from "react";

export default function TilePanel({ tile, isOpen, onToggle, onSleep, onEat, onDrink, isMoving }) {
  const panelRef = useRef(null);
  const [lastTile, setLastTile] = useState(tile);

  useEffect(() => {
    if (tile) setLastTile(tile);
  }, [tile]);

  const displayTile = tile || lastTile;

  const togglePanel = (e) => {
    e.stopPropagation();
    if (onToggle) onToggle();
  };

  if (!displayTile) return null;

  const isHome = displayTile.q === 0 && displayTile.r === 0;
  const isVisuallyOpen = isOpen && !isMoving;

  return (
    <>
      <aside
        ref={panelRef}
        style={{
          ...panelContainerStyle,
          transform: isVisuallyOpen ? "translateX(0)" : "translateX(calc(-100% + 10px))",
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div style={innerContentStyle}>
          <div style={headerStyle}>
            <div style={titleStyle}>Территория {displayTile.q} | {displayTile.r}</div>
            <h2 style={titleStyle}>
              {isHome ? "БАЗА ОТДЫХА" : (displayTile.name || "НОВОЕ МЕСТО")}
            </h2>
            <div style={subTitleStyle}>
                Координаты берега: {displayTile.q} , {displayTile.r} <br/>
                Ландшафт: {displayTile.type ? displayTile.type.toLowerCase() : "не определен"}
            </div>
          </div>

          <div style={scrollContentStyle}>
            {isHome && (
              <div style={actionGroupStyle}>
                <div style={infoBoxStyle}>
                  Здесь ваше основное пристанище. Можно отдохнуть, разобрать улов и подготовить снаряжение.
                </div>

                <div style={dividerStyle}>ДОСТУПНЫЕ ДЕЙСТВИЯ</div>

                <button onClick={onSleep} style={actionBtnStyle}>
                  <div style={iconBoxStyle}>🛏️</div>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>ОТДОХНУТЬ (8ч)</div>
                    <div style={btnDescStyle}>Полное восстановление сил</div>
                  </div>
                </button>
                <button onClick={onEat} style={actionBtnStyle}>
                  <div style={iconBoxStyle}>🥫</div>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>ПЕРЕКУСИТЬ</div>
                    <div style={btnDescStyle}>Запас сытости +50</div>
                  </div>
                </button>
                <button onClick={onDrink} style={actionBtnStyle}>
                  <div style={iconBoxStyle}>🥤</div>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>УТОЛИТЬ ЖАЖДУ</div>
                    <div style={btnDescStyle}>Запас воды +50</div>
                  </div>
                </button>
              </div>
            )}

            {!isHome && (displayTile.type === "base" || displayTile.type === "village") && (
              <div style={actionGroupStyle}>
                <div style={infoBoxStyle}>
                  Небольшое поселение или лагерь. Можно сделать короткий привал.
                </div>
                <button onClick={onSleep} style={actionBtnStyle}>
                  <div style={iconBoxStyle}>⛺</div>
                  <div style={btnTextStyle}>
                    <div style={btnTitleStyle}>СДЕЛАТЬ ПРИВАЛ</div>
                    <div style={btnDescStyle}>Короткий отдых (1ч)</div>
                  </div>
                </button>
              </div>
            )}

            {!isHome && displayTile.type !== "base" && displayTile.type !== "village" && (
                 <div style={infoBoxStyle}>
                    Открытая местность. Идеально подходит для поиска рыбных мест. Опасностей не наблюдается.
                 </div>
            )}
          </div>

          <div style={footerStyle}>
             Заметка от: {new Date().toLocaleDateString()}
          </div>
        </div>
      </aside>

      <div
        onClick={togglePanel}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
            ...toggleBtnStyle,
            left: isVisuallyOpen ? "380px" : "0",
        }}
      >
        <span style={toggleTextStyle}>
          {isOpen ? "СВЕРНУТЬ" : "ТЕРРИТОРИЯ"}
        </span>
      </div>
    </>
  );
}

// --- СТИЛИ "POST-SOVIET SURVIVAL" ---

const panelContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "380px",
  height: "100vh",
  backgroundColor: "#4a4036",
  backgroundImage: `
    linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 10%, rgba(0,0,0,0) 90%, rgba(0,0,0,0.6) 100%),
    repeating-linear-gradient(45deg, #4a4036 0, #4a4036 2px, #3e352d 2px, #3e352d 4px)
  `,
  backgroundSize: 'cover',
  borderRight: "4px solid #2d241b",
  boxShadow: "none",
  zIndex: 50,
  padding: "20px 15px 20px 10px",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
  boxSizing: 'border-box',
  pointerEvents: 'auto'
};

const innerContentStyle = {
  flex: 1,
  backgroundColor: "#e3dac9",
  backgroundImage: `
    linear-gradient(#cfc6b8 1px, transparent 1px),
    linear-gradient(90deg, #cfc6b8 1px, transparent 1px)`,
  backgroundSize: "20px 20px",
  boxShadow: "inset 0 0 40px rgba(0,0,0,0.2), 0 0 10px rgba(0,0,0,0.3)",
  borderRadius: "2px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  overflow: "hidden",
  border: "1px solid #b0a390"
};

const screwStyle = {
    position: 'absolute',
    color: '#8c7b65',
    fontSize: '20px',
    userSelect: 'none',
    textShadow: '0 1px 0 rgba(255,255,255,0.2)',
    zIndex: 2
};

const headerStyle = {
    borderBottom: "2px solid #5d4037",
    paddingBottom: "15px",
    marginBottom: "20px",
};

const stampStyle = {
    border: "2px solid #c23b22",
    color: "#c23b22",
    display: "inline-block",
    padding: "2px 8px",
    fontSize: "10px",
    fontWeight: "bold",
    transform: "rotate(-2deg)",
    marginBottom: "10px",
    letterSpacing: "1px",
    opacity: 0.8
};

const titleStyle = {
    margin: "0",
    fontSize: "22px",
    color: "#2b221b",
    fontFamily: "'Courier New', monospace",
    fontWeight: "900",
    textTransform: "uppercase",
    lineHeight: "1.2"
};

const subTitleStyle = {
    marginTop: "8px",
    color: "#5d4037",
    fontSize: "12px",
    fontFamily: "'Courier New', monospace",
    lineHeight: "1.5",
    borderLeft: "2px solid #8c7b65",
    paddingLeft: "8px"
};

const scrollContentStyle = {
    flex: 1,
    overflowY: "auto",
    paddingRight: "5px",
    scrollbarWidth: "thin",
    scrollbarColor: "#8c7b65 transparent"
};

const actionGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px"
};

const infoBoxStyle = {
  backgroundColor: "rgba(255,255,255,0.5)",
  border: "1px dashed #8c7b65",
  padding: "10px",
  color: "#3e2723",
  fontSize: "13px",
  fontFamily: "'Courier New', monospace",
  lineHeight: "1.4",
  marginBottom: "10px"
};

const dividerStyle = {
    fontSize: "10px",
    color: "#8c7b65",
    textAlign: "center",
    margin: "10px 0",
    letterSpacing: "4px",
    textTransform: "uppercase",
    borderBottom: "1px solid #cfc6b8",
    lineHeight: "0.1em"
};

const actionBtnStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "10px",
  backgroundColor: "#f0e6d2",
  border: "1px solid #8c7b65",
  borderBottom: "3px solid #5d4037",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "all 0.1s ease",
  color: "#3e2723",
  position: "relative"
};

const iconBoxStyle = {
    fontSize: "24px",
    filter: "grayscale(0.5) sepia(0.5)"
};

const btnTextStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
};

const btnTitleStyle = {
    fontWeight: "bold",
    fontSize: "14px",
    fontFamily: "'Courier New', monospace",
    textTransform: "uppercase"
};

const btnDescStyle = {
    fontSize: "10px",
    color: "#6d5645"
};

const footerStyle = {
    marginTop: "auto",
    paddingTop: "10px",
    borderTop: "1px solid #b0a390",
    fontSize: "10px",
    color: "#8c7b65",
    fontFamily: "'Courier New', monospace",
    textAlign: "right",
    fontStyle: "italic"
};

const toggleTextStyle = {
    writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)',
    fontSize: '11px', letterSpacing: '2px', color: '#000', fontWeight: 'bold'
};

const toggleBtnStyle = {
    position: "absolute",
    top: "50%",
    width: "40px",
    height: "140px",
    marginTop: "-70px",
    backgroundColor: "#c23b22",
    background: "linear-gradient(to right, #a3321d, #c23b22)",
    border: "2px solid #752415",
    borderLeft: "none",
    borderRadius: "0 8px 8px 0",
    boxShadow: "4px 2px 10px rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 49,
    transition: "left 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
    pointerEvents: "auto"
};