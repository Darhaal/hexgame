"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { useGameTime } from "../hooks/useGameTime";
import { usePlayer } from "../hooks/usePlayer";
import { useMovement } from "../hooks/useMovement";
import { START_TIME, loadPlayerState } from "../engine/player/playerState";
import { INITIAL_WORLD_OBJECTS, OBJECTS_DB } from "../data/objectsData";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { gameTime, gameTimeRef, updateTime, addTime, setTime } = useGameTime();

  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 50 });

  const [worldObjects, setWorldObjects] = useState(INITIAL_WORLD_OBJECTS);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  // [NEW] Режим удаления
  const [isDeleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    const loaded = loadPlayerState();
    if (loaded && loaded.gameTime) setTime(loaded.gameTime);

    try {
        const savedObjects = localStorage.getItem("worldObjects");
        if (savedObjects) {
            const parsed = JSON.parse(savedObjects);
            // Проверка миграции
            const keys = Object.keys(parsed);
            if (keys.length > 0 && parsed[keys[0]].length > 0 && !parsed[keys[0]][0].templateId) {
                setWorldObjects(INITIAL_WORLD_OBJECTS);
            } else {
                setWorldObjects(parsed);
            }
        } else {
            setWorldObjects(INITIAL_WORLD_OBJECTS);
        }
    } catch (e) {
        setWorldObjects(INITIAL_WORLD_OBJECTS);
    }

    const savedSize = localStorage.getItem("universal_window_size");
    if (savedSize) { try { setWindowSize(JSON.parse(savedSize)); } catch(e) {} }

    const savedPos = localStorage.getItem("universal_window_pos");
    if (savedPos) { try { setWindowPosition(JSON.parse(savedPos)); } catch(e) {} }
  }, [setTime]);

  const updateWindowSize = (newSize) => {
      setWindowSize(newSize);
      localStorage.setItem("universal_window_size", JSON.stringify(newSize));
  };

  const updateWindowPosition = (newPos) => {
      setWindowPosition(newPos);
      localStorage.setItem("universal_window_pos", JSON.stringify(newPos));
  };

  const player = usePlayer(gameTimeRef);
  const {
    playerPosRef, save: savePlayer, reset: resetPlayer,
    stats, inventory, skills, character,
    updateStats, modifyStat, useItem, spawnItem, changeVehicle, renameCharacter, upgradeSkill
  } = player;

  const movement = useMovement(playerPosRef, gameTimeRef, player.currentVehicleIdRef, savePlayer);
  const {
    activeTile, isMoving, displayPath,
    update: updateMovement, onTileClick: handleMoveClick, stop: stopMovementAction, movementRef
  } = movement;

  // --- ЛОГИКА ОБЪЕКТОВ ---
  const getObjectsAtActiveTile = () => {
    if (!activeTile) return [];
    const key = `${activeTile.q},${activeTile.r}`;
    const instances = worldObjects[key] || [];
    return instances.map(inst => ({
        ...inst,
        ...(OBJECTS_DB[inst.templateId] || {})
    }));
  };

  const moveWorldObject = (uniqueId, newX, newY) => {
      if (!activeTile) return;
      const key = `${activeTile.q},${activeTile.r}`;

      const newWorldObjects = { ...worldObjects };
      const currentObjects = [...(newWorldObjects[key] || [])];

      const objIndex = currentObjects.findIndex(o => o.uniqueId === uniqueId);

      if (objIndex !== -1) {
          currentObjects[objIndex] = { ...currentObjects[objIndex], x: newX, y: newY };
          newWorldObjects[key] = currentObjects;
          setWorldObjects(newWorldObjects);
          localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
      }
  };

  const spawnWorldObject = (templateId) => {
      if (!activeTile) return;
      const key = `${activeTile.q},${activeTile.r}`;

      const x = 45 + Math.floor(Math.random() * 10);
      const y = 45 + Math.floor(Math.random() * 10);

      const newObj = {
          templateId,
          uniqueId: `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          x, y
      };

      const newWorldObjects = { ...worldObjects };
      const currentObjects = newWorldObjects[key] ? [...newWorldObjects[key]] : [];
      currentObjects.push(newObj);
      newWorldObjects[key] = currentObjects;

      setWorldObjects(newWorldObjects);
      localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
  };

  const deleteWorldObject = (uniqueId) => {
      if (!activeTile) return;
      const key = `${activeTile.q},${activeTile.r}`;

      const newWorldObjects = { ...worldObjects };
      if (!newWorldObjects[key]) return;

      newWorldObjects[key] = newWorldObjects[key].filter(o => o.uniqueId !== uniqueId);

      setWorldObjects(newWorldObjects);
      localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
  };

  const onTileClick = (tile, isShiftKey) => {
    handleMoveClick(tile, isShiftKey, setIsLocationOpen);
  };

  const onResetWorld = () => {
    resetPlayer();
    setTime(START_TIME);
    stopMovementAction();
    setWorldObjects(INITIAL_WORLD_OBJECTS);
    localStorage.removeItem("worldObjects");
    if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.reload();
    }
  };

  const save = () => {
      savePlayer(movementRef.current.queue, movementRef.current.activeStep);
      localStorage.setItem("worldObjects", JSON.stringify(worldObjects));
  };

  useEffect(() => {
    const handleUnload = () => save();
    const handleVisibilityChange = () => { if (document.hidden) save(); };
    if (typeof window !== "undefined") {
        window.addEventListener('beforeunload', handleUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }
  }, [save, movementRef, worldObjects]);

  const value = {
    gameTimeRef, playerPosRef, movementRef,
    gameTime, stats, inventory, skills, character,
    activeTile, isMoving, displayPath, isLoaded: player.isLoaded,

    isLocationOpen, setIsLocationOpen,
    windowSize, updateWindowSize,
    windowPosition, updateWindowPosition,

    worldObjects, getObjectsAtActiveTile,
    moveWorldObject, spawnWorldObject, deleteWorldObject,
    isDeleteMode, setDeleteMode,

    updateTime, updateStats, updateMovement,
    addTime, modifyStat, useItem, spawnItem, changeVehicle, renameCharacter, upgradeSkill,
    onTileClick, onResetWorld, stopMovementAction, save
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);