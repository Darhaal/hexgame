"use client";

import { useState } from "react";
// ВАЖНО: Предполагается, что ITEMS экспортируется из itemsData.js
// Если файл еще не создан, это вызовет ошибку, но мы создали itemsData.js в предыдущем шаге (в памяти)
// Для реального проекта убедитесь, что путь верный.
import { ITEMS } from "../../data/itemsData";

export default function DevConsole({ onAddSteps, onReset, onToggleDebug, onSetVehicle, onAddStat, onSpawnItem }) {
  const [open, setOpen] = useState(false);
  const [spawnOpen, setSpawnOpen] = useState(false);

  // Хелпер для добавления времени в минутах
  const addTime = (min) => onAddSteps(min);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "70%",
      background: "rgba(0,0,0,0.9)",
      color: "white",
      padding: "10px",
      zIndex: 9999,
      fontFamily: "monospace",
      borderBottom: "2px solid #444",
      maxHeight: "80vh",
      overflowY: "auto"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", color: "#4fc3f7" }}>🛠️ DEV CONSOLE</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setOpen(!open)} style={btnStyle}>
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: "10px" }}>

          {/* Time Warp Section */}
          <div style={{ marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #333" }}>
            <div style={labelStyle}>⏳ Time Warp</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <button onClick={() => addTime(-60)} style={btnStyle}>⏪ -1h</button>
                <button onClick={() => addTime(-10)} style={btnStyle}>-10m</button>
                <button onClick={() => addTime(10)} style={btnStyle}>+10m</button>
                <button onClick={() => addTime(60)} style={btnStyle}>+1h ⏩</button>
                <button onClick={() => addTime(480)} style={{...btnStyle, color: "#81c784", borderColor: "#2e7d32"}}>🛌 Sleep (+8h)</button>
                <button onClick={() => addTime(1440)} style={{...btnStyle, color: "#ffd54f", borderColor: "#fbc02d"}}>☀️ Next Day</button>
            </div>
          </div>

          {/* Stats Controls */}
          <div style={{ marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #333" }}>
             <div style={labelStyle}>❤️ Vitality (+50)</div>
             <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => onAddStat('food', 50)} style={{ ...btnStyle, color: "#81c784" }}>🍔 Food</button>
                <button onClick={() => onAddStat('water', 50)} style={{ ...btnStyle, color: "#4fc3f7" }}>💧 Water</button>
                <button onClick={() => onAddStat('fatigue', 50)} style={{ ...btnStyle, color: "#fff176" }}>⚡ Energy</button>
             </div>
          </div>

          {/* Vehicles */}
          <div style={{ marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #333" }}>
            <div style={labelStyle}>🏇 Transport</div>
            <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => onSetVehicle && onSetVehicle("horse")} style={btnStyle}>🐎 Horse</button>
                <button onClick={() => onSetVehicle && onSetVehicle("boat")} style={btnStyle}>🛶 Boat</button>
                <button onClick={() => onSetVehicle && onSetVehicle("none")} style={btnStyle}>👣 Walk</button>
            </div>
          </div>

          {/* Item Spawner */}
          <div style={{ marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid #333" }}>
            <div
                style={{...labelStyle, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}
                onClick={() => setSpawnOpen(!spawnOpen)}
            >
                🎁 ITEM SPAWNER {spawnOpen ? '▼' : '▶'}
            </div>

            {spawnOpen && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px", marginTop: "8px" }}>
                    {Object.values(ITEMS).map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSpawnItem && onSpawnItem(item.id)}
                            style={{...btnStyle, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px'}}
                        >
                            <span style={{fontSize: '16px'}}>{item.icon}</span>
                            <span style={{fontSize: '11px'}}>{item.name}</span>
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* System */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button onClick={onReset} style={{ ...btnStyle, background: "#5d1010", borderColor: "#a00" }}>🔥 Reset World</button>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
    padding: "6px 12px", background: "#333", color: "#eee", border: "1px solid #555", borderRadius: "4px", cursor: "pointer", fontSize: "12px"
};

const labelStyle = {
    fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: "bold"
};