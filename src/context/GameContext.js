"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useGameTime } from "../hooks/useGameTime";
import { usePlayer } from "../hooks/usePlayer";
import { useMovement } from "../hooks/useMovement";
import { START_TIME } from "../engine/player/playerState";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { gameTime, gameTimeRef, updateTime, addTime, setTime } = useGameTime();

  const player = usePlayer(gameTimeRef);
  const {
    playerPosRef, save, reset: resetPlayer,
    stats, inventory, skills, character,
    updateStats, modifyStat, useItem, spawnItem, changeVehicle, renameCharacter, upgradeSkill
  } = player;

  const movement = useMovement(playerPosRef, gameTimeRef, player.currentVehicleIdRef, save);
  const {
    activeTile, isMoving, displayPath,
    update: updateMovement, onTileClick: handleMoveClick, stop: stopMovementAction, movementRef
  } = movement;

  // По умолчанию открыта
  const [isTilePanelOpen, setIsTilePanelOpen] = useState(true);

  // Обертка для клика по тайлу
  const onTileClick = (tile, isShiftKey) => {
    // Мы НЕ меняем состояние панели здесь.
    // Если она была открыта - останется открытой (но уедет при движении).
    // Если была закрыта - останется закрытой.
    handleMoveClick(tile, isShiftKey);
  };

  const onResetWorld = () => {
    resetPlayer();
    setTime(START_TIME);
    stopMovementAction();
    if (typeof window !== "undefined") window.location.reload();
  };

  const lastSaveTimeRef = useRef(0);
  useEffect(() => {
    const handleUnload = () => save(movementRef.current.queue, movementRef.current.activeStep);
    const handleVisibilityChange = () => {
        if (document.hidden) save(movementRef.current.queue, movementRef.current.activeStep);
    };

    if (typeof window !== "undefined") {
        window.addEventListener('beforeunload', handleUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }
  }, [save, movementRef]);

  const value = {
    gameTimeRef,
    playerPosRef,
    movementRef,

    gameTime,
    stats,
    inventory,
    skills,
    character,
    activeTile,
    isMoving,
    displayPath,
    isTilePanelOpen,
    isLoaded: player.isLoaded,

    updateTime,
    updateStats,
    updateMovement,
    addTime,
    modifyStat,
    useItem,
    spawnItem,
    changeVehicle,
    renameCharacter,
    upgradeSkill,
    onTileClick,
    setIsTilePanelOpen,
    onResetWorld,
    stopMovementAction,
    save
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);