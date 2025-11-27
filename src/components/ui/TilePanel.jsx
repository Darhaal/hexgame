// src/components/ui/TilePanel.jsx
"use client";

/**
 * Tile detail panel shown on the left.
 * - Receives a tile object or null
 * - onSleep: callback to grant rest
 * - onClose: close UI
 */

export default function TilePanel({ tile, onSleep, onClose }) {
  if (!tile) return null;

  return (
    <aside
      id="tile-panel"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "260px",
        height: "100vh",
        background: "rgba(20,20,20,0.95)",
        color: "white",
        padding: "20px",
        transform: tile ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
        zIndex: 50,
      }}
    >
      <h2 style={{ marginTop: 0 }}>{tile.name ?? `${tile.q},${tile.r}`}</h2>
      <p>Type: {tile.type}</p>

      {tile.type === "base" && (
        <>
          <p>You can rest here to recover steps.</p>
          <button
            onClick={onSleep}
            style={{
              padding: "12px 16px",
              background: "#3aa757",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginTop: "12px",
              width: "100%",
              fontSize: "16px",
            }}
          >
            Sleep (+10 steps)
          </button>
        </>
      )}

      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px 14px",
          width: "100%",
          background: "#555",
          border: "none",
          color: "white",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </aside>
  );
}
