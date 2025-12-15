"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import HexCanvas from "./HexCanvas";
import TilePanel from "../ui/TilePanel";
import DevConsole from "../ui/DevConsole";
import PaperClock from "../ui/PaperClock";

import { useGameLoop } from "../../hooks/useGameLoop";
import { loadPlayerState, savePlayerState, START_TIME } from "../../engine/player/playerState";
import { setVehicle, VEHICLES } from "../../engine/player/playerEngine";
import mapData from "../../data/mapData";
import { REAL_SEC_TO_GAME_MIN } from "../../engine/time/timeModels";

// Импорт вынесенной логики
import { calculateGameDelta } from "../../engine/time/timeLogic";
import {
  updateMovementPosition,
  handleMoveInput,
  stopMovement,
  calculateDisplayPath
} from "../../engine/movement/movementLogic";

export default function HexMap() {
  const playerPosRef = useRef({ q: 0, r: 0 });
  const gameTimeRef = useRef(START_TIME);
  const lastSaveTimeRef = useRef(0);

  const movementRef = useRef({ queue: [], activeStep: null });

  const [isLoaded, setIsLoaded] = useState(false);
  const [renderTime, setRenderTime] = useState(START_TIME);
  const [currentVehicleId, setCurrentVehicleId] = useState("none");
  const [isMoving, setIsMoving] = useState(false);

  const [plannedPath, setPlannedPath] = useState(null);
  const [targetTileCoords, setTargetTileCoords] = useState(null);
  const [activeTile, setActiveTile] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [tick, setTick] = useState(0);

  const saveCurrentState = useCallback(() => {
    savePlayerState(
      playerPosRef.current,
      gameTimeRef.current,
      currentVehicleId,
      movementRef.current.queue,
      movementRef.current.activeStep
    );
  }, [currentVehicleId]);

  useEffect(() => {
    const loaded = loadPlayerState();
    if (loaded) {
        playerPosRef.current = loaded.pos;
        gameTimeRef.current = loaded.gameTime;
        setRenderTime(loaded.gameTime);
        setCurrentVehicleId(loaded.vehicle);

        if ((loaded.queue && loaded.queue.length > 0) || loaded.activeStep) {
            movementRef.current = {
                queue: loaded.queue || [],
                activeStep: loaded.activeStep || null
            };
            setIsMoving(true);
            setPlannedPath(null);
        }
    }
    setIsLoaded(true);

    const handleUnload = () => saveCurrentState();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [saveCurrentState]);

  useGameLoop((time, deltaTime) => {
    if (!isLoaded) return;

    // Время
    const deltaMinutes = calculateGameDelta(deltaTime);
    gameTimeRef.current += deltaMinutes;
    setRenderTime(gameTimeRef.current);

    // Движение
    if (isMoving) {
      updateMovementPosition({
        playerPosRef,
        gameTimeRef,
        movementRef,
        mapData,
        vehicleId: currentVehicleId,
        onStepComplete: saveCurrentState,
        onPathComplete: () => {
             setIsMoving(false);
             setPlannedPath(null);
             saveCurrentState();

             const tile = mapData.find(t =>
                t.q === Math.round(playerPosRef.current.q) &&
                t.r === Math.round(playerPosRef.current.r)
             );
             if (tile && (tile.type === "base" || tile.type === "village")) {
                 setActiveTile(tile);
                 setShowPanel(true);
             }
        }
      });
    }

    // Автосейв
    const now = performance.now();
    if (now - lastSaveTimeRef.current > 1000) {
        saveCurrentState();
        lastSaveTimeRef.current = now;
    }

    setTick(prev => prev + 1);
  });

  const onTileClick = useCallback((tile, isShiftKey) => {
    handleMoveInput({
        tile, isShiftKey,
        state: { isMoving, plannedPath, targetTileCoords, playerPos: playerPosRef.current, currentVehicleId },
        setters: { setIsMoving, setPlannedPath, setTargetTileCoords, setShowPanel, setActiveTile },
        movementRef,
        mapData,
        saveState: saveCurrentState
    });
  }, [isMoving, plannedPath, targetTileCoords, currentVehicleId, saveCurrentState]);

  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    stopMovement(movementRef, setIsMoving, saveCurrentState);
    setPlannedPath(null);
    setTargetTileCoords(null);
  }, [saveCurrentState]);

  const onSetVehicle = (id) => {
    if (setVehicle(id)) {
        setCurrentVehicleId(id);
        stopMovement(movementRef, setIsMoving, saveCurrentState);
        setPlannedPath(null);
        setTargetTileCoords(null);
    }
  };

  const onAddTime = (minutes) => {
    gameTimeRef.current = Math.max(0, gameTimeRef.current + minutes);
    setRenderTime(gameTimeRef.current);
    saveCurrentState();
  };

  const onSleep = () => {
     onAddTime(480);
     setShowPanel(false);
  };

  if (!isLoaded) return <div style={{ background: "#111", minHeight: "100vh" }}></div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#111" }} onContextMenu={onContextMenu}>
      <PaperClock gameTimeMinutes={renderTime} />

      <DevConsole
        onAddTime={onAddTime}
        onReset={() => {
          playerPosRef.current = { q: 0, r: 0 };
          gameTimeRef.current = START_TIME;
          setRenderTime(START_TIME);
          stopMovement(movementRef, setIsMoving, saveCurrentState);
          savePlayerState({ q: 0, r: 0 }, START_TIME, "none");
          window.location.reload();
        }}
        onSetVehicle={onSetVehicle}
        onToggleDebug={() => console.log("Time flow:", REAL_SEC_TO_GAME_MIN)}
      />

      <TilePanel
        tile={showPanel ? activeTile : null}
        onClose={() => setShowPanel(false)}
        onSleep={onSleep}
      />

      <HexCanvas
        playerPosRef={playerPosRef}
        reachableRef={{ current: new Map() }}
        path={calculateDisplayPath(isMoving, movementRef, plannedPath, playerPosRef.current)}
        onTileClicked={onTileClick}
        tick={tick}
      />
    </div>
  );
}