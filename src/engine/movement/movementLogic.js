import { getTileCost } from "../time/timeModels";
import { findPath } from "../player/pathfinding";

/**
 * ФИЗИКА ДВИЖЕНИЯ
 * Логика строго соответствует вашему исходнику: движение от текущей точки к центру следующего тайла.
 */
export function updateMovementPosition({
  playerPosRef,
  gameTimeRef,
  movementRef,
  mapData,
  vehicleId,
  onStepComplete,
  onPathComplete
}) {
  const mov = movementRef.current;
  let posUpdated = false;

  const getTile = (q, r) => mapData.find(t => t.q === q && t.r === r);

  while (true) {
    // 1. Начинаем новый шаг
    if (!mov.activeStep) {
      if (mov.queue.length === 0) {
        if (onPathComplete) onPathComplete();
        break;
      }

      const nextNode = mov.queue.shift();

      const targetTile = getTile(Math.round(nextNode.q), Math.round(nextNode.r));
      const costMinutes = getTileCost(targetTile, vehicleId);

      // Старт берем ровно там, где стоит игрок (для плавности)
      const startPos = { ...playerPosRef.current };

      mov.activeStep = {
        startPos: startPos,
        endPos: nextNode, // Идем строго в центр тайла (как в вашем коде)
        startTime: gameTimeRef.current,
        duration: costMinutes
      };

      if (onStepComplete) onStepComplete();
    }

    // 2. Интерполяция
    const step = mov.activeStep;
    const timeSinceStart = gameTimeRef.current - step.startTime;
    const progress = step.duration > 0 ? timeSinceStart / step.duration : 1;

    if (progress >= 1) {
      // Шаг завершен
      playerPosRef.current = { q: step.endPos.q, r: step.endPos.r };
      mov.activeStep = null;
      posUpdated = true;

      if (onStepComplete) onStepComplete();
      continue;
    } else {
      // В процессе
      const t = Math.max(0, progress);
      const q = step.startPos.q + (step.endPos.q - step.startPos.q) * t;
      const r = step.startPos.r + (step.endPos.r - step.startPos.r) * t;

      playerPosRef.current = { q, r };
      posUpdated = true;
      break;
    }
  }

  return posUpdated;
}

/**
 * ЛОГИКА ВВОДА (INPUT HANDLER)
 * Обрабатывает клики по карте.
 */
export function handleMoveInput({
  tile, isShiftKey,
  state: { isMoving, plannedPath, targetTileCoords, playerPos, currentVehicleId },
  setters: { setIsMoving, setPlannedPath, setTargetTileCoords, setShowPanel, setActiveTile },
  movementRef,
  mapData,
  saveState
}) {
  if (!tile) return;

  // Хелпер для слияния путей без дублирования узла стыка
  const mergePaths = (pathA, pathB) => {
      // Если конец A совпадает с началом B, убираем начало B
      if (pathA.length > 0 && pathB.length > 0) {
          const endA = pathA[pathA.length - 1];
          const startB = pathB[0];
          if (endA.q === startB.q && endA.r === startB.r) {
              return [...pathA, ...pathB.slice(1)];
          }
      }
      return [...pathA, ...pathB];
  };

  // --- СЦЕНАРИЙ 1: SHIFT + CLICK (Добавление в очередь) ---
  if (isShiftKey) {
      let startNode;
      let previousPath = null;

      // Определяем, откуда строить новый сегмент и что модифицировать
      if (plannedPath && plannedPath.length > 0) {
          // Если мы в режиме планирования - от конца плана
          const last = plannedPath[plannedPath.length - 1];
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          previousPath = plannedPath;
      } else if (isMoving && movementRef.current.queue.length > 0) {
          // Если мы идем - от конца текущей очереди
          const last = movementRef.current.queue[movementRef.current.queue.length - 1];
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          previousPath = movementRef.current.queue;
      } else if (isMoving && movementRef.current.activeStep) {
          // Если идем последний шаг - от его конца
          const last = movementRef.current.activeStep.endPos;
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          // previousPath нет, так как очередь пуста, мы просто добавим в неё
      } else {
          // Если стоим - от игрока
          startNode = { q: Math.round(playerPos.q), r: Math.round(playerPos.r) };
      }

      const pathSegment = findPath(startNode, tile, mapData, currentVehicleId);

      if (pathSegment) {
          // ВАЖНО: Помечаем КОНЕЦ предыдущего пути как Waypoint (желтая точка),
          // так как теперь мы идем дальше от него.
          if (previousPath && previousPath.length > 0) {
              previousPath[previousPath.length - 1].isWaypoint = true;
          } else if (isMoving && movementRef.current.activeStep) {
              // Если добавляем к активному шагу, помечаем его конец
              movementRef.current.activeStep.endPos.isWaypoint = true;
          }

          if (isMoving) {
              // Если уже идем - добавляем в физическую очередь
              // Сливаем, чтобы не дублировать точку стыка
              if (movementRef.current.queue.length > 0) {
                  movementRef.current.queue = mergePaths(movementRef.current.queue, pathSegment);
              } else {
                  movementRef.current.queue.push(...pathSegment);
              }
              saveState();
          } else {
              // Если планируем - добавляем к плану
              const newPlan = plannedPath ? mergePaths(plannedPath, pathSegment) : pathSegment;
              setPlannedPath(newPlan);
              setTargetTileCoords({ q: tile.q, r: tile.r });
          }
      }
      return;
  }

  // --- СЦЕНАРИЙ 2: ЛКМ ВО ВРЕМЯ ДВИЖЕНИЯ (Остановка и Планирование) ---
  if (isMoving) {
      // 1. Очищаем очередь (отменяем будущие шаги)
      movementRef.current.queue = [];
      saveState();

      // 2. Строим путь от ТЕКУЩЕГО тайла (куда мы сейчас придем или где стоим)
      // Мы округляем playerPos, чтобы найти старт для A*.
      // При этом activeStep не сбрасываем, игрок дойдет до центра текущего тайла.
      const startNode = {
          q: Math.round(playerPos.q),
          r: Math.round(playerPos.r)
      };

      const path = findPath(startNode, tile, mapData, currentVehicleId);

      if (path) {
          setPlannedPath(path);
          setTargetTileCoords({ q: tile.q, r: tile.r });
          setIsMoving(false); // Останавливаем физику (переходим в режим планирования)
      }
      return;
  }

  // --- СЦЕНАРИЙ 3: ПОДТВЕРЖДЕНИЕ ПУТИ (Если стоим) ---
  if (targetTileCoords && targetTileCoords.q === tile.q && targetTileCoords.r === tile.r) {
      if (plannedPath && plannedPath.length > 0) {
          movementRef.current = {
              queue: [...plannedPath],
              activeStep: null,
              startPos: { ...playerPos },
              duration: 0,
              elapsed: 0
          };
          setIsMoving(true);
          setPlannedPath(null);
      }
      setTargetTileCoords(null);
  }
  // --- СЦЕНАРИЙ 4: ПЛАНИРОВАНИЕ (Первый клик) ---
  else {
      const startNode = {
          q: Math.round(playerPos.q),
          r: Math.round(playerPos.r)
      };

      const path = findPath(startNode, tile, mapData, currentVehicleId);

      if (path) {
          setPlannedPath(path);
          setTargetTileCoords({ q: tile.q, r: tile.r });
          setShowPanel(false);

          if (tile.type === "base" || tile.type === "village") {
             if (setActiveTile) setActiveTile(tile);
          }
      } else {
          setPlannedPath(null);
          setTargetTileCoords(null);
      }
  }
}

/**
 * ОСТАНОВКА (STOP HANDLER)
 */
export function stopMovement(movementRef, setIsMoving, saveState) {
    movementRef.current.queue = [];
    saveState();
}

/**
 * РАСЧЕТ ВИЗУАЛЬНОГО ПУТИ
 */
export function calculateDisplayPath(isMoving, movementRef, plannedPath, playerPos) {
    let pathToDraw = null;
    if (isMoving) {
        const queue = movementRef.current.queue;
        // Если есть активный шаг, рисуем линию до его конца
        const activeEnd = movementRef.current.activeStep ? [movementRef.current.activeStep.endPos] : [];
        pathToDraw = [...activeEnd, ...queue];
    } else {
        pathToDraw = plannedPath;
    }

    if (!pathToDraw || pathToDraw.length === 0) return null;

    // Добавляем игрока как начало пути
    return [
        { q: playerPos.q, r: playerPos.r },
        ...pathToDraw
    ];
}