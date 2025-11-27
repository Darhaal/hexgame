// src/components/ui/DevConsole.jsx
"use client";

/**
 * Developer console overlay.
 * - onAddSteps(n)
 * - onReset()
 * - onToggleDebug()
 * - onSetVehicle(id)
 */

import { useState } from "react";

export default function DevConsole({ onAddSteps, onReset, onToggleDebug, onSetVehicle }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "rgba(0,0,0,0.85)",
      color: "white",
      padding: "10px",
      zIndex: 9999,
      fontFamily: "monospace",
      borderBottom: "2px solid #444",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontWeight: "bold" }}>Developer Console</div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button onClick={() => setOpen(!open)} style={{ background: "#333", color: "#fff", border: "1px solid #666", padding: "4px 8px", cursor: "pointer" }}>
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: "10px" }}>
          <div style={{ marginBottom: "8px" }}>
            <input
              type="number"
              placeholder="Add steps"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={{ width: "120px", padding: "4px", marginRight: "6px", background: "#222", color: "white", border: "1px solid #555" }}
            />
            <button onClick={() => { const n = parseInt(value, 10); if (!isNaN(n)) onAddSteps(n); }} style={{ padding: "6px 10px", background: "#444", color: "white", border: "1px solid #666", cursor: "pointer" }}>
              + Steps
            </button>
          </div>

          <div style={{ margin: "12px 0 6px", fontWeight: "bold" }}>Vehicles:</div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <button onClick={() => onSetVehicle && onSetVehicle("devCar")} style={{ padding: "6px 10px", background: "#555", color: "white", border: "1px solid #666", cursor: "pointer" }}>
              🚗 Dev Car
            </button>
            <button onClick={() => onSetVehicle && onSetVehicle("none")} style={{ padding: "6px 10px", background: "#444", color: "white", border: "1px solid #666", cursor: "pointer" }}>
              ❌ No Vehicle
            </button>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={onReset} style={{ padding: "6px 10px", background: "#444", color: "white", border: "1px solid #666", cursor: "pointer" }}>
              Reset Player
            </button>
            <button onClick={onToggleDebug} style={{ padding: "6px 10px", background: "#444", color: "white", border: "1px solid #666", cursor: "pointer" }}>
              Toggle Debug
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
