"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useGameTime } from "../hooks/useGameTime";
import { usePlayer } from "../hooks/usePlayer";
import { useMovement } from "../hooks/useMovement";
import { START_TIME, loadPlayerState } from "../engine/player/playerState"; // Добавили loadPlayerState

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { gameTime, gameTimeRef, updateTime, addTime, setTime } = useGameTime();

  // --- ВАЖНОЕ ИСПРАВЛЕНИЕ: Загрузка времени при старте ---
  useEffect(() => {
    // Пытаемся загрузить состояние сразу при монтировании
    const loaded = loadPlayerState();
    if (loaded && loaded.gameTime) {
        console.log("Loading saved time:", loaded.gameTime);
        setTime(loaded.gameTime);
    }
  }, [setTime]);
  // -------------------------------------------------------

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

  const [isTilePanelOpen, setIsTilePanelOpen] = useState(true);

  const onTileClick = (tile, isShiftKey) => {
    handleMoveClick(tile, isShiftKey);
  };

  const onResetWorld = () => {
    resetPlayer();
    setTime(START_TIME);
    stopMovementAction();
    // Чистим localStorage
    if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.reload();
    }
  };

  // Автосохранение при закрытии/сворачивании
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