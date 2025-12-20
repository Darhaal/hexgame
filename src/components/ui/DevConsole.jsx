"use client";

import { useState } from "react";
// ВАЖНО: Предполагается, что ITEMS экспортируется из itemsData.js
import { ITEMS } from "../../data/itemsData";

export default function DevConsole({ onAddSteps, onReset, onToggleDebug, onSetVehicle, onAddStat, onSpawnItem }) {
  const [open, setOpen] = useState(false);
  const [spawnOpen, setSpawnOpen] = useState(false);

  const addTime = (min) => onAddSteps(min);

  return (
    <div style={{
      position: "fixed",
      top: 10,
      left: 10,
      width: open ? "300px" : "auto", // Компактная ширина
      background: "rgba(0,0,0,0.85)",
      color: "#eee",
      padding: "8px",
      zIndex: 9000,
      fontFamily: "monospace",
      border: "1px solid #444",
      borderRadius: "4px",
      maxHeight: "80vh",
      overflowY: "auto",
      boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
        {open && <div style={{ fontWeight: "bold", color: "#4fc3f7", fontSize: "12px" }}>🔧 DEV TOOLS</div>}
        <button onClick={() => setOpen(!open)} style={{...btnStyle, fontSize: '10px', padding: '2px 6px'}}>
          {open ? "✕" : "🔧 DEV"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: "10px", display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Time Warp */}
          <div style={sectionStyle}>
            <div style={labelStyle}>⏳ TIME</div>
            <div style={rowStyle}>
                <button onClick={() => addTime(-60)} style={btnStyle}>-1h</button>
                <button onClick={() => addTime(60)} style={btnStyle}>+1h</button>
                <button onClick={() => addTime(480)} style={{...btnStyle, color: "#81c784"}}>Sleep</button>
            </div>
          </div>

          {/* Stats */}
          <div style={sectionStyle}>
             <div style={labelStyle}>❤️ STATS</div>
             <div style={rowStyle}>
                <button onClick={() => onAddStat('food', 50)} style={{ ...btnStyle, color: "#e6a749" }}>Food</button>
                <button onClick={() => onAddStat('water', 50)} style={{ ...btnStyle, color: "#4fc3f7" }}>H2O</button>
                <button onClick={() => onAddStat('fatigue', 50)} style={{ ...btnStyle, color: "#aed581" }}>Nrg</button>
             </div>
          </div>

          {/* Transport */}
          <div style={sectionStyle}>
            <div style={labelStyle}>🏇 MOUNT</div>
            <div style={rowStyle}>
                <button onClick={() => onSetVehicle("horse")} style={btnStyle}>Horse</button>
                <button onClick={() => onSetVehicle("boat")} style={btnStyle}>Boat</button>
                <button onClick={() => onSetVehicle("none")} style={btnStyle}>Foot</button>
            </div>
          </div>

          {/* Spawner */}
          <div style={sectionStyle}>
            <button
                style={{...btnStyle, width: '100%', textAlign: 'left'}}
                onClick={() => setSpawnOpen(!spawnOpen)}
            >
                🎁 SPAWN ITEM {spawnOpen ? '▼' : '▶'}
            </button>

            {spawnOpen && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px", marginTop: "4px" }}>
                    {Object.values(ITEMS).map(item => (
                        <button
                            key={item.id}
                            onClick={() => onSpawnItem(item.id)}
                            style={{...btnStyle, fontSize: '10px', padding: '4px', textAlign: 'left'}}
                        >
                            {item.icon} {item.name.slice(0, 8)}..
                        </button>
                    ))}
                </div>
            )}
          </div>

          {/* Reset */}
          <button onClick={onReset} style={{ ...btnStyle, background: "#5d1010", borderColor: "#a00", marginTop: "5px" }}>
             🔥 RESET WORLD
          </button>
        </div>
      )}
    </div>
  );
}

const sectionStyle = { borderBottom: "1px solid #333", paddingBottom: "6px" };
const rowStyle = { display: "flex", gap: "4px", flexWrap: "wrap" };
const btnStyle = {
    padding: "4px 8px", background: "#333", color: "#ccc", border: "1px solid #555", borderRadius: "3px", cursor: "pointer", fontSize: "11px", flex: 1
};
const labelStyle = {
    fontSize: "10px", color: "#666", marginBottom: "4px", fontWeight: "bold"
};