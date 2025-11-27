// src/components/map/HexMap.jsx
"use client";

/**
 * High-level map component.
 * - Holds player state refs
 * - Controls UI overlays (TilePanel, DevConsole)
 * - Delegates canvas rendering to HexCanvas
 */

import { useRef, useState } from "react";
import HexCanvas from "./HexCanvas";
import TilePanel from "../ui/TilePanel";
import DevConsole from "../ui/DevConsole";

import { loadPlayerState, savePlayerState, START_STEPS } from "../../engine/player/playerState";
import { computeReachable, applyMove, BLOCKED, VEHICLES, setVehicle } from "../../engine/player/playerEngine";

export default function HexMap() {
  // load player pos/vehicle from localStorage
  const { pos: initialPos, steps: initialSteps } = loadPlayerState();

  // refs used by canvas & engine (mutable, avoids rerenders)
  const playerPosRef = useRef(initialPos);
  const playerStepsRef = useRef(initialSteps);
  const reachableRef = useRef(computeReachable(initialPos, initialSteps));

  // UI state
  const [activeTile, setActiveTile] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  // Called by HexCanvas when a tile is clicked (tile object passed)
  function handleTileClick(tile) {
    if (!tile) return;
    if (BLOCKED.has(tile.type.id)) return;

    const key = `${tile.q},${tile.r}`;
    if (!reachableRef.current.has(key)) return;

    const move = applyMove(playerPosRef.current, tile, reachableRef.current, playerStepsRef.current);
    if (!move) return;

    playerPosRef.current = move.newPos;
    playerStepsRef.current = move.newSteps;
    savePlayerState(move.newPos, move.newSteps);
    reachableRef.current = computeReachable(move.newPos, move.newSteps);

    setActiveTile(tile);
    setShowPanel(tile.type === "base");
  }

  function handleSleepFromPanel() {
    playerStepsRef.current += 10;
    savePlayerState(playerPosRef.current, playerStepsRef.current);
    reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
    setShowPanel(false);
  }

  function handleSetVehicle(id) {
    if (!setVehicle(id)) return false;
    playerStepsRef.current = START_STEPS + (VEHICLES[id]?.stepBonus ?? 0);
    savePlayerState(playerPosRef.current, playerStepsRef.current);
    reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
    return true;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <DevConsole
        onAddSteps={(n) => {
          playerStepsRef.current += n;
          savePlayerState(playerPosRef.current, playerStepsRef.current);
          reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
        }}
        onReset={() => {
          playerPosRef.current = { q: 0, r: 0 };
          playerStepsRef.current = START_STEPS;
          savePlayerState(playerPosRef.current, playerStepsRef.current);
          reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
        }}
        onSetVehicle={(id) => handleSetVehicle(id)}
        onToggleDebug={() => {
          // simple debug hook
          // you can extend to toggle extra visuals
          console.log("Debug toggled");
        }}
      />

      <TilePanel tile={showPanel ? activeTile : null} onClose={() => setShowPanel(false)} onSleep={handleSleepFromPanel} />

      <HexCanvas
        playerPosRef={playerPosRef}
        reachableRef={reachableRef}
        onTileClicked={handleTileClick}
      />
    </div>
  );
}
