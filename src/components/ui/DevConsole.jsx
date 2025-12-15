"use client";

import { useState } from "react";

/**
 * Developer console overlay.
 * Обновлен для управления временем.
 */
export default function DevConsole({ onAddTime, onReset, onSetVehicle }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "70%",
      background: "rgba(10, 10, 10, 0.9)",
      backdropFilter: "blur(4px)",
      color: "white",
      padding: "10px 20px",
      zIndex: 9999,
      fontFamily: "monospace",
      borderBottom: "1px solid #333",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold", color: "#4fc3f7" }}>🛠️ DEV CONSOLE</div>
        <button 
            onClick={() => setOpen(!open)} 
            style={toggleBtnStyle}
        >
            {open ? "Close" : "Open"}
        </button>
      </div>

      {open && (
        <div style={{ marginTop: "20px" }}>
          
          {/* Секция Времени */}
          <div style={sectionStyle}>
            <div style={labelStyle}>⏳ Time Warp (Перемотка)</div>
            <div style={rowStyle}>
               <button onClick={() => onAddTime(-60)} style={actionBtnStyle}>⏪ -1h</button>
               <button onClick={() => onAddTime(-10)} style={actionBtnStyle}>-10m</button>
               <button onClick={() => onAddTime(10)} style={actionBtnStyle}>+10m</button>
               <button onClick={() => onAddTime(60)} style={actionBtnStyle}>+1h ⏩</button>
               <button onClick={() => onAddTime(480)} style={{...actionBtnStyle, borderColor: '#81c784', color: '#81c784'}}>🛌 Sleep (+8h)</button>
               <button onClick={() => onAddTime(24 * 60)} style={{...actionBtnStyle, borderColor: '#ffd54f', color: '#ffd54f'}}>☀️ Next Day</button>
            </div>
          </div>

          {/* Секция Транспорта */}
          <div style={sectionStyle}>
            <div style={labelStyle}>🏇 Vehicles</div>
            <div style={rowStyle}>
                <button onClick={() => onSetVehicle("horse")} style={vehicleBtnStyle}>🐎 Horse</button>
                <button onClick={() => onSetVehicle("boat")} style={vehicleBtnStyle}>🛶 Boat</button>
                <button onClick={() => onSetVehicle("none")} style={vehicleBtnStyle}>👣 Walk</button>
            </div>
          </div>

          {/* Секция Сброса */}
          <div style={{...sectionStyle, borderBottom: 'none'}}>
            <div style={labelStyle}>⚠️ Danger Zone</div>
            <div style={rowStyle}>
                <button onClick={onReset} style={resetBtnStyle}>🔥 Reset World State</button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}

// --- Styles ---

const toggleBtnStyle = {
    background: "#222", color: "#ccc", border: "1px solid #444", 
    padding: "4px 12px", cursor: "pointer", borderRadius: "4px",
    fontSize: "12px", textTransform: "uppercase"
};

const sectionStyle = {
    marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid #333"
};

const labelStyle = {
    marginBottom: "8px", color: "#666", fontSize: "11px", 
    textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold"
};

const rowStyle = {
    display: "flex", gap: "8px", flexWrap: "wrap"
};

const actionBtnStyle = {
    padding: "8px 12px", background: "#222", color: "#eee", 
    border: "1px solid #444", borderRadius: "6px", cursor: "pointer",
    fontSize: "13px", minWidth: "60px", transition: "all 0.2s"
};

const vehicleBtnStyle = {
    ...actionBtnStyle, background: "#1a237e", borderColor: "#283593"
};

const resetBtnStyle = {
    ...actionBtnStyle, background: "#3e2723", borderColor: "#d32f2f", color: "#ef9a9a"
};