import { useState, useRef, useCallback, useEffect } from "react";
import {
  updateMovementPosition,
  handleMoveInput,
  stopMovement,
  calculateDisplayPath
} from "../engine/movement/movementLogic";
import mapData from "../data/mapData";
import { loadPlayerState } from "../engine/player/playerState";

export function useMovement(playerPosRef, gameTimeRef, currentVehicleIdRef, saveCallback) {
  const movementRef = useRef({ queue: [], activeStep: null });

  const [isMoving, setIsMoving] = useState(false);
  const [plannedPath, setPlannedPath] = useState(null);
  const [targetTileCoords, setTargetTileCoords] = useState(null);
  const [activeTile, setActiveTile] = useState(null);

  // Восстановление состояния движения при загрузке
  useEffect(() => {
    const loaded = loadPlayerState();
    if (loaded && ((loaded.queue && loaded.queue.length > 0) || loaded.activeStep)) {
      movementRef.current = {
        queue: loaded.queue || [],
        activeStep: loaded.activeStep || null
      };
      setIsMoving(true);
      setPlannedPath(null);
      setActiveTile(null);
    } else if (loaded) {
      // Устанавливаем начальный тайл
      const q = Math.round(loaded.pos.q);
      const r = Math.round(loaded.pos.r);
      const tile = mapData.find(t => t.q === q && t.r === r);
      if (tile) setActiveTile(tile);
    }
  }, []);

  const update = useCallback(() => {
    if (isMoving) {
      const posChanged = updateMovementPosition({
        playerPosRef,
        gameTimeRef,
        movementRef,
        mapData,
        vehicleId: currentVehicleIdRef.current,
        onStepComplete: () => saveCallback(movementRef.current.queue, movementRef.current.activeStep),
        onPathComplete: () => {
          setIsMoving(false);
          setPlannedPath(null);
          saveCallback([], null); // Очередь пуста

          // Обновляем активный тайл при остановке
          const q = Math.round(playerPosRef.current.q);
          const r = Math.round(playerPosRef.current.r);
          const tile = mapData.find(t => t.q === q && t.r === r);
          if (tile) setActiveTile(tile);
        }
      });
      return posChanged;
    }
    return false;
  }, [isMoving, playerPosRef, gameTimeRef, currentVehicleIdRef, saveCallback]);

  const onTileClick = useCallback((tile, isShiftKey, setShowPanel) => {
    handleMoveInput({
      tile, isShiftKey,
      state: {
        isMoving,
        plannedPath,
        targetTileCoords,
        playerPos: playerPosRef.current,
        currentVehicleId: currentVehicleIdRef.current
      },
      setters: {
        setIsMoving,
        setPlannedPath,
        setTargetTileCoords,
        setShowPanel: setShowPanel || (() => {}),
        setActiveTile: (t) => { if (t === null) setActiveTile(null); }
      },
      movementRef,
      mapData,
      saveState: () => saveCallback(movementRef.current.queue, movementRef.current.activeStep)
    });
  }, [isMoving, plannedPath, targetTileCoords, playerPosRef, currentVehicleIdRef, saveCallback]);

  const stop = useCallback(() => {
    stopMovement(movementRef, setIsMoving, () => saveCallback([], null));
    setPlannedPath(null);
    setTargetTileCoords(null);

    // Обновляем активный тайл
    const q = Math.round(playerPosRef.current.q);
    const r = Math.round(playerPosRef.current.r);
    const tile = mapData.find(t => t.q === q && t.r === r);
    if (tile) setActiveTile(tile);
  }, [playerPosRef, saveCallback]);

  const displayPath = calculateDisplayPath(
    isMoving,
    movementRef,
    plannedPath,
    { ...playerPosRef.current }
  );

  return {
    isMoving,
    movementRef, // Нужно для HexMap при сохранении, если нужно прямое чтение
    plannedPath,
    activeTile,
    displayPath,
    update,
    onTileClick,
    stop
  };
}