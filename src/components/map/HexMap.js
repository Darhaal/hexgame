"use client";

import React, { useRef, useCallback, useEffect, useState } from "react";
import HexCanvas from "./HexCanvas";
import TilePanel from "../ui/TilePanel";
import DevConsole from "../ui/DevConsole";
import InfoPanel from "../ui/InfoPanel";
import InventoryPanel from "../ui/InventoryPanel";

import { useGameLoop } from "../../hooks/useGameLoop";
import { useGameTime } from "../../hooks/useGameTime";
import { usePlayer } from "../../hooks/usePlayer";
import { useMovement } from "../../hooks/useMovement";
import { START_TIME } from "../../engine/player/playerState";
import { REAL_SEC_TO_GAME_MIN } from "../../engine/time/timeModels";

export default function HexMap() {
  // 1. Инициализация хуков
  const {
    gameTime, gameTimeRef, updateTime, addTime, setTime
  } = useGameTime();

  const {
    isLoaded,
    playerPosRef,
    stats, inventory, skills, character, // State for UI
    // Methods
    updateStats, modifyStat, useItem, spawnItem,
    changeVehicle, renameCharacter, upgradeSkill,
    save, reset: resetPlayer
  } = usePlayer(gameTimeRef);

  const {
    isMoving, movementRef, activeTile, displayPath,
    update: updateMovement, onTileClick: handleMoveClick, stop: stopMovementAction
  } = useMovement(playerPosRef, gameTimeRef, { current: "none" }, save); // vehicleId можно связать лучше

  // Состояние панели тайла
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const lastSaveTimeRef = useRef(0);

  // Автосейв и видимость
  useEffect(() => {
    const handleUnload = () => save(movementRef.current.queue, movementRef.current.activeStep);
    const handleVisibilityChange = () => {
        if (document.hidden) save(movementRef.current.queue, movementRef.current.activeStep);
    };

    window.addEventListener('beforeunload', handleUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
        window.removeEventListener('beforeunload', handleUnload);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [save, movementRef]);

  // --- ИГРОВОЙ ЦИКЛ ---
  const gameTick = useCallback((time, deltaTime) => {
    if (!isLoaded) return;
    if (deltaTime > 1000) return; // Пауза при неактивности

    // 1. Время
    const deltaMinutes = updateTime(deltaTime);

    // 2. Статы
    updateStats(deltaMinutes);

    // 3. Движение
    updateMovement();

    // 4. Автосейв (раз в 1 сек)
    const now = performance.now();
    if (now - lastSaveTimeRef.current > 1000) {
        save(movementRef.current.queue, movementRef.current.activeStep);
        lastSaveTimeRef.current = now;
    }
  }, [isLoaded, updateTime, updateStats, updateMovement, save, movementRef]);

  useGameLoop(gameTick);

  // --- ХЕНДЛЕРЫ UI ---

  const onTileClick = useCallback((tile, isShiftKey) => {
    handleMoveClick(tile, isShiftKey, () => setIsPanelOpen(false));
  }, [handleMoveClick]);

  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    stopMovementAction();
  }, [stopMovementAction]);

  const onResetWorld = () => {
    resetPlayer();
    setTime(START_TIME);
    stopMovementAction();
    window.location.reload();
  };

  // Действия для панели тайла
  const onSleepAction = () => {
      if (activeTile && activeTile.q === 0 && activeTile.r === 0) {
          addTime(480);
          modifyStat('fatigue', 100); // Set to 100 logic handled inside modifyStat if we tweak it, or just add huge amount
      } else {
          addTime(60);
          modifyStat('fatigue', 15);
      }
  };

  const onEatAction = () => modifyStat('food', 50);
  const onDrinkAction = () => modifyStat('water', 50);

  if (!isLoaded) return <div style={{ background: "#111", minHeight: "100vh" }}></div>;

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#111" }} onContextMenu={onContextMenu}>

      <InfoPanel gameTimeMinutes={gameTime} stats={stats} />

      <DevConsole
        onAddTime={addTime}
        onAddStat={modifyStat}
        onReset={onResetWorld}
        onSetVehicle={changeVehicle}
        onToggleDebug={() => console.log("Time flow:", REAL_SEC_TO_GAME_MIN)}
        onSpawnItem={spawnItem}
      />

      <InventoryPanel
        inventory={inventory}
        skills={skills}
        character={character}
        onUseItem={useItem}
        gameTime={gameTime}
        onRenameCharacter={renameCharacter}
        onUpgradeSkill={upgradeSkill}
      />

      <TilePanel
        tile={isMoving ? null : activeTile}
        isOpen={isPanelOpen}
        onToggle={() => setIsPanelOpen(!isPanelOpen)}
        onSleep={onSleepAction}
        onEat={onEatAction}
        onDrink={onDrinkAction}
      />

      <HexCanvas
        playerPosRef={playerPosRef}
        reachableRef={{ current: new Map() }}
        path={displayPath}
        onTileClicked={onTileClick}
        gameTime={gameTime}
      />
    </div>
  );
}