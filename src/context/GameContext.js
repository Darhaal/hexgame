"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useGameTime } from "../hooks/useGameTime";
import { usePlayer } from "../hooks/usePlayer";
import { useMovement } from "../hooks/useMovement";
import { START_TIME, loadPlayerState } from "../engine/player/playerState";
import { INITIAL_WORLD_OBJECTS, OBJECTS_DB } from "../data/objectsData";
import { PART_REQUIREMENTS, TOOLS_DB } from "../data/toolsData";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { gameTime, gameTimeRef, updateTime, addTime, setTime } = useGameTime();

  const [windowSize, setWindowSize] = useState({ width: 900, height: 600 });
  const [windowPosition, setWindowPosition] = useState({ x: 100, y: 50 });

  const [worldObjects, setWorldObjects] = useState(INITIAL_WORLD_OBJECTS);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDeleteMode, setDeleteMode] = useState(false);

  const [selectedWorldObjectId, setSelectedWorldObjectId] = useState(null);
  const [assemblyTargetId, setAssemblyTargetId] = useState(null);

  useEffect(() => {
    const loaded = loadPlayerState();
    if (loaded && loaded.gameTime) setTime(loaded.gameTime);

    try {
        const savedObjects = localStorage.getItem("worldObjects");
        if (savedObjects) {
            const parsed = JSON.parse(savedObjects);
            const keys = Object.keys(parsed);
            // Проверка на битые данные
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

    setIsLocationOpen(false);
    setAssemblyTargetId(null);
  }, [setTime]);

  const updateWindowSize = (n) => { setWindowSize(n); localStorage.setItem("universal_window_size", JSON.stringify(n)); };
  const updateWindowPosition = (n) => { setWindowPosition(n); localStorage.setItem("universal_window_pos", JSON.stringify(n)); };

  // 1. Инициализируем Player Hook
  const player = usePlayer(gameTimeRef);

  // 2. Деструктурируем данные игрока (ЧТОБЫ playerPosRef БЫЛ ДОСТУПЕН)
  const {
    playerPosRef,
    save: savePlayer,
    reset: resetPlayer,
    stats, inventory, skills, character,
    updateStats, modifyStat, useItem, spawnItem, changeVehicle, renameCharacter, upgradeSkill
  } = player;

  // 3. Передаем playerPosRef в хук движения
  const movement = useMovement(playerPosRef, gameTimeRef, player.currentVehicleIdRef, savePlayer);

  const {
    activeTile, isMoving, displayPath,
    update: updateMovement, onTileClick: handleMoveClick, stop: stopMovementAction, movementRef
  } = movement;

  // --- Helpers & Logic ---

  // [FIX] Оборачиваем в useCallback, чтобы избежать бесконечных циклов в useEffect компонентов
  const getObjectsAtActiveTile = useCallback(() => {
    if (!activeTile) return [];
    const key = `${activeTile.q},${activeTile.r}`;
    const instances = worldObjects[key] || [];
    return instances.map(inst => ({
        ...inst,
        ...(OBJECTS_DB[inst.templateId] || {})
    }));
  }, [activeTile, worldObjects]);

  const getWorldObjectById = useCallback((uid) => {
      const all = getObjectsAtActiveTile();
      return all.find(o => o.uniqueId === uid) || null;
  }, [getObjectsAtActiveTile]);

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

  const hasTool = (requiredSize) => {
      if (!requiredSize) return true;
      return inventory.some(slot => {
          if (!slot) return false;
          const data = OBJECTS_DB[slot.itemId] || TOOLS_DB[slot.itemId];
          if (!data || (data.type !== 'tool' && data.type !== 'tool_kit')) return false;

          if (data.stats && data.stats.sizes) return data.stats.sizes.includes(requiredSize);
          if (data.sizes) return data.sizes.includes(requiredSize);
          return false;
      });
  };

  const installPartToVehicle = (vehicleId, partObject, slotKey) => {
      if (!activeTile) return;
      const key = `${activeTile.q},${activeTile.r}`;
      const newWorldObjects = { ...worldObjects };
      let currentObjects = [...(newWorldObjects[key] || [])];

      const vehicleIndex = currentObjects.findIndex(o => o.uniqueId === vehicleId);
      if (vehicleIndex === -1) return;

      const vehicle = { ...currentObjects[vehicleIndex] };
      vehicle.parts = { ...(vehicle.parts || {}) };

      const slotType = slotKey.split('_')[0];
      const req = PART_REQUIREMENTS[slotType] || { bolts: 1 };

      vehicle.parts[slotKey] = {
          templateId: partObject.templateId,
          installed: true,
          condition: partObject.condition || 100,
          boltsAttached: 0,
          maxBolts: req.bolts
      };

      currentObjects[vehicleIndex] = vehicle;
      // Удаляем установленную деталь из списка объектов на земле
      currentObjects = currentObjects.filter(o => o.uniqueId !== partObject.uniqueId);

      newWorldObjects[key] = currentObjects;
      setWorldObjects(newWorldObjects);
      localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
  };

  const screwBolt = (vehicleId, slotKey, isTightening) => {
      const slotType = slotKey.split('_')[0];
      const req = PART_REQUIREMENTS[slotType];
      if (req && req.toolSize) {
          if (!hasTool(req.toolSize)) {
              alert(`Нужен ключ на ${req.toolSize}!`);
              return false;
          }
      }

      const key = `${activeTile.q},${activeTile.r}`;
      const newWorldObjects = { ...worldObjects };
      const currentObjects = [...(newWorldObjects[key] || [])];
      const vehicleIndex = currentObjects.findIndex(o => o.uniqueId === vehicleId);
      if (vehicleIndex === -1) return;

      const vehicle = { ...currentObjects[vehicleIndex] };
      vehicle.parts = { ...vehicle.parts };
      const part = { ...vehicle.parts[slotKey] };

      if (!part) return;

      if (isTightening) {
          if (part.boltsAttached < part.maxBolts) part.boltsAttached++;
      } else {
          if (part.boltsAttached > 0) part.boltsAttached--;
      }

      vehicle.parts[slotKey] = part;
      currentObjects[vehicleIndex] = vehicle;
      newWorldObjects[key] = currentObjects;
      setWorldObjects(newWorldObjects);
      localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
      return true;
  };

  const uninstallPartFromVehicle = (vehicleId, slotKey) => {
      const key = `${activeTile.q},${activeTile.r}`;
      const newWorldObjects = { ...worldObjects };
      const currentObjects = [...(newWorldObjects[key] || [])];
      const vehicleIndex = currentObjects.findIndex(o => o.uniqueId === vehicleId);
      if (vehicleIndex === -1) return;
      const vehicle = { ...currentObjects[vehicleIndex] };

      const partData = vehicle.parts[slotKey];
      if (!partData) return;

      if (partData.boltsAttached > 0) {
          alert(`Сначала открутите болты (${partData.boltsAttached} шт.)!`);
          return;
      }

      const newPart = {
          templateId: partData.templateId,
          uniqueId: `${partData.templateId}_dropped_${Date.now()}`,
          x: vehicle.x + 1,
          y: vehicle.y + 1,
          type: OBJECTS_DB[partData.templateId].type
      };

      const newParts = { ...vehicle.parts };
      delete newParts[slotKey];
      vehicle.parts = newParts;

      currentObjects[vehicleIndex] = vehicle;
      currentObjects.push(newPart);
      newWorldObjects[key] = currentObjects;
      setWorldObjects(newWorldObjects);
      localStorage.setItem("worldObjects", JSON.stringify(newWorldObjects));
  };

  const calculateVehicleStats = (vehicleId) => {
      const vehicle = getWorldObjectById(vehicleId);
      if (!vehicle) return null;

      const bodyStats = OBJECTS_DB[vehicle.templateId]?.stats || { weight: 1000 };
      let totalWeight = bodyStats.weight;
      let totalPower = 0;
      let avgGrip = 0;
      let wheelsCount = 0;
      let hasEngine = false;
      let hasBattery = false;
      let allBolted = true;

      const parts = vehicle.parts || {};

      if (parts.engine && parts.engine.installed) {
          if (parts.engine.boltsAttached < parts.engine.maxBolts) allBolted = false;
          const engineData = OBJECTS_DB[parts.engine.templateId];
          if (engineData) {
              totalPower = engineData.stats?.power || 0;
              hasEngine = true;
          }
      }

      if (parts.battery && parts.battery.installed) {
           if (parts.battery.boltsAttached < parts.battery.maxBolts) allBolted = false;
           hasBattery = true;
      }

      ['wheel_fl', 'wheel_fr', 'wheel_rl', 'wheel_rr'].forEach(slot => {
          if (parts[slot] && parts[slot].installed) {
              if (parts[slot].boltsAttached < parts[slot].maxBolts) allBolted = false;
              const wheelData = OBJECTS_DB[parts[slot].templateId];
              if (wheelData && wheelData.stats && wheelData.stats.mod) {
                  avgGrip += wheelData.stats.mod.forest || 1;
              } else {
                  avgGrip += 1;
              }
              wheelsCount++;
          }
      });

      if (wheelsCount > 0) avgGrip /= wheelsCount;
      else avgGrip = 0;

      const isReady = hasEngine && hasBattery && wheelsCount === 4 && allBolted;
      const maxSpeed = isReady ? Math.round((totalPower / totalWeight) * 2000 * avgGrip) : 0;

      return {
          weight: totalWeight,
          power: totalPower,
          grip: avgGrip.toFixed(2),
          isReady,
          speed: maxSpeed,
          wheels: wheelsCount,
          missingBolts: !allBolted
      };
  };

  const spawnWorldObject = (templateId) => {
      if (!activeTile) return;
      const key = `${activeTile.q},${activeTile.r}`;
      const x = 45 + Math.floor(Math.random() * 10);
      const y = 45 + Math.floor(Math.random() * 10);
      const newObj = {
          templateId,
          uniqueId: `${templateId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          x, y,
          parts: {}
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
      if (selectedWorldObjectId === uniqueId) setSelectedWorldObjectId(null);
  };

  const onTileClick = (tile, isShiftKey) => { handleMoveClick(tile, isShiftKey, setIsLocationOpen); };
  const onResetWorld = () => { resetPlayer(); setTime(START_TIME); stopMovementAction(); setWorldObjects(INITIAL_WORLD_OBJECTS); localStorage.removeItem("worldObjects"); if (typeof window !== "undefined") { localStorage.clear(); window.location.reload(); } };
  const save = () => { savePlayer(movementRef.current.queue, movementRef.current.activeStep); localStorage.setItem("worldObjects", JSON.stringify(worldObjects)); };

  useEffect(() => { const handleUnload = () => save(); const handleVisibilityChange = () => { if (document.hidden) save(); }; if (typeof window !== "undefined") { window.addEventListener('beforeunload', handleUnload); document.addEventListener("visibilitychange", handleVisibilityChange); return () => { window.removeEventListener('beforeunload', handleUnload); document.removeEventListener("visibilitychange", handleVisibilityChange); }; } }, [save, movementRef, worldObjects]);

  const value = {
    gameTimeRef, playerPosRef, movementRef,
    gameTime, stats, inventory, skills, character,
    activeTile, isMoving, displayPath, isLoaded: player.isLoaded,
    isLocationOpen, setIsLocationOpen, windowSize, updateWindowSize, windowPosition, updateWindowPosition,
    worldObjects, getObjectsAtActiveTile,
    moveWorldObject, spawnWorldObject, deleteWorldObject, isDeleteMode, setDeleteMode,
    selectedWorldObjectId, setSelectedWorldObjectId, getWorldObjectById,
    assemblyTargetId, setAssemblyTargetId,
    installPartToVehicle, uninstallPartFromVehicle, screwBolt, calculateVehicleStats,

    updateTime, updateStats, updateMovement,
    addTime, modifyStat, useItem, spawnItem, changeVehicle, renameCharacter, upgradeSkill,
    onTileClick, onResetWorld, stopMovementAction, save
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);