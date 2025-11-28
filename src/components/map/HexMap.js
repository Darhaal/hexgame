"use client";

import { useRef, useState, useCallback } from "react";
import HexCanvas from "./HexCanvas";
import TilePanel from "../ui/TilePanel";
import DevConsole from "../ui/DevConsole";

// Подключаем хук
import { useGameLoop } from "../../hooks/useGameLoop";

import { loadPlayerState, savePlayerState, START_STEPS } from "../../engine/player/playerState";
import { computeReachable, applyMove, BLOCKED, VEHICLES, setVehicle } from "../../engine/player/playerEngine";

export default function HexMap() {
  const { pos: initialPos, steps: initialSteps } = loadPlayerState();

  const playerPosRef = useRef(initialPos);
  const playerStepsRef = useRef(initialSteps);
  const reachableRef = useRef(computeReachable(initialPos, initialSteps));

  const [activeTile, setActiveTile] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  // --- АНИМАЦИЯ ---
  const [tick, setTick] = useState(0);

  // Вызов игрового цикла
  useGameLoop((time) => {
    setTick(prev => prev + 1);
  });

  const handleTileClick = useCallback((tile) => {
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
    setShowPanel(tile.type === "base" || tile.type === "village");
  }, []);

  function handleSetVehicle(id) {
    if (!setVehicle(id)) return false;
    playerStepsRef.current = START_STEPS + (VEHICLES[id]?.stepBonus ?? 0);
    savePlayerState(playerPosRef.current, playerStepsRef.current);
    reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
    return true;
  }

  const handleSleepFromPanel = () => {
     playerStepsRef.current += 10;
     setShowPanel(false);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <DevConsole
        onAddSteps={(n) => {
          playerStepsRef.current += n;
          reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
        }}
        onReset={() => {
          playerPosRef.current = { q: 0, r: 0 };
          playerStepsRef.current = START_STEPS;
          reachableRef.current = computeReachable(playerPosRef.current, playerStepsRef.current);
        }}
        onSetVehicle={handleSetVehicle}
        onToggleDebug={() => console.log("Debug")}
      />

      <TilePanel tile={showPanel ? activeTile : null} onClose={() => setShowPanel(false)} onSleep={handleSleepFromPanel} />

      <HexCanvas
        playerPosRef={playerPosRef}
        reachableRef={reachableRef}
        onTileClicked={handleTileClick}
        tick={tick}
      />
    </div>
  );
}