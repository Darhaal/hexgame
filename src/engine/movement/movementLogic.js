import { getTileCost } from "../time/timeModels";
import { findPath } from "../player/pathfinding";

/**
 * ФИЗИКА ДВИЖЕНИЯ
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

  // Цикл позволяет завершить несколько коротких шагов за один кадр
  while (true) {
    // 1. Если нет активного шага, пытаем взять следующий из очереди
    if (!mov.activeStep) {
      if (mov.queue.length === 0) {
        if (onPathComplete) onPathComplete();
        break; // Путь окончен
      }

      // Берем следующую цель
      const nextNode = mov.queue.shift();

      const currentTile = getTile(Math.round(playerPosRef.current.q), Math.round(playerPosRef.current.r));
      const targetTile = getTile(Math.round(nextNode.q), Math.round(nextNode.r));

      // Расчет стоимости (времени)
      const costFrom = getTileCost(currentTile, vehicleId);
      const costTo = getTileCost(targetTile, vehicleId);
      const costMinutes = (costFrom + costTo) / 2;

      // Фиксируем старт шага с ТЕКУЩЕЙ позиции игрока (даже если она дробная)
      const startPos = { ...playerPosRef.current };

      mov.activeStep = {
        startPos: startPos,
        endPos: nextNode,
        startTime: gameTimeRef.current,
        duration: costMinutes,
        accumulatedTime: nextNode.accumulatedTime // Сохраняем время прибытия для UI
      };

      if (onStepComplete) onStepComplete();
    }

    // 2. Интерполяция текущего шага
    const step = mov.activeStep;
    const timeSinceStart = gameTimeRef.current - step.startTime;
    // Защита от деления на 0
    const progress = step.duration > 0 ? timeSinceStart / step.duration : 1;

    if (progress >= 1) {
      // Шаг завершен: ставим игрока точно в цель
      playerPosRef.current = { q: step.endPos.q, r: step.endPos.r };
      mov.activeStep = null;
      posUpdated = true;
      if (onStepComplete) onStepComplete();
      // Продолжаем цикл, чтобы взять следующий шаг сразу же, если времени прошло много
      continue;
    } else {
      // Игрок в процессе движения
      const t = Math.max(0, progress); // Linear interpolation (или можно добавить easing)

      const q = step.startPos.q + (step.endPos.q - step.startPos.q) * t;
      const r = step.startPos.r + (step.endPos.r - step.startPos.r) * t;

      playerPosRef.current = { q, r };
      posUpdated = true;
      break; // Прерываем цикл, ждем следующий кадр
    }
  }

  return posUpdated;
}

/**
 * ЛОГИКА ВВОДА (INPUT HANDLER)
 */
export function handleMoveInput({
  tile, isShiftKey,
  state,
  setters,
  movementRef,
  mapData,
  saveState
}) {
  const { isMoving, plannedPath, targetTileCoords, playerPos, currentVehicleId } = state;
  const { setIsMoving, setPlannedPath, setTargetTileCoords, setShowPanel, setActiveTile } = setters;

  if (!tile) return;

  // --- СЦЕНАРИЙ 1: SHIFT + CLICK (Добавление в очередь) ---
  if (isShiftKey) {
      let startNode;
      let startTimeOffset = 0;

      if (plannedPath && plannedPath.length > 0) {
          const last = plannedPath[plannedPath.length - 1];
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          startTimeOffset = last.accumulatedTime || 0;
          plannedPath[plannedPath.length - 1].isWaypoint = true;
      }
      else if (isMoving && movementRef.current.queue.length > 0) {
          const last = movementRef.current.queue[movementRef.current.queue.length - 1];
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          startTimeOffset = last.accumulatedTime || 0;
          movementRef.current.queue[movementRef.current.queue.length - 1].isWaypoint = true;
      }
      else if (isMoving && movementRef.current.activeStep) {
          const last = movementRef.current.activeStep.endPos;
          startNode = { q: Math.round(last.q), r: Math.round(last.r) };
          startTimeOffset = movementRef.current.activeStep.accumulatedTime || 0;
          movementRef.current.activeStep.endPos.isWaypoint = true;
      }
      else {
          startNode = { q: Math.round(playerPos.q), r: Math.round(playerPos.r) };
          startTimeOffset = 0;
      }

      const pathSegment = findPath(startNode, tile, mapData, currentVehicleId, startTimeOffset);

      if (pathSegment && pathSegment.length > 0) {
          if (isMoving) {
              movementRef.current.queue.push(...pathSegment);
              saveState();
          } else {
              const newPlan = plannedPath ? [...plannedPath, ...pathSegment] : pathSegment;
              setPlannedPath(newPlan);
              setTargetTileCoords({ q: tile.q, r: tile.r });
          }
      }
      return;
  }

  // --- СЦЕНАРИЙ 2: ОБЫЧНЫЙ КЛИК (Сброс и новый путь) ---
  if (isMoving) {
      // Если кликнули во время движения - останавливаемся и планируем новый путь
      // Но лучше сделать это через остановку -> планирование
      stopMovement(movementRef, setIsMoving, saveState);

      // Сразу планируем новый путь от текущей (округленной) позиции
      const startNode = { q: Math.round(playerPos.q), r: Math.round(playerPos.r) };
      const path = findPath(startNode, tile, mapData, currentVehicleId, 0);

      if (path) {
          setPlannedPath(path);
          setTargetTileCoords({ q: tile.q, r: tile.r });
          // Не запускаем движение сразу (нужен второй клик)
      }
      return;
  }

  if (targetTileCoords && targetTileCoords.q === tile.q && targetTileCoords.r === tile.r) {
      // Второй клик по той же клетке -> ПОЕХАЛИ
      if (plannedPath && plannedPath.length > 0) {
          movementRef.current = {
              queue: [...plannedPath],
              activeStep: null, // Старт с нуля
          };
          setIsMoving(true);
          setPlannedPath(null);
          if (setActiveTile) setActiveTile(null); // Убираем панель тайла при старте
      }
      setTargetTileCoords(null);
  } else {
      // Первый клик -> ПЛАНИРОВАНИЕ
      const startNode = { q: Math.round(playerPos.q), r: Math.round(playerPos.r) };
      const path = findPath(startNode, tile, mapData, currentVehicleId, 0);

      if (path) {
          setPlannedPath(path);
          setTargetTileCoords({ q: tile.q, r: tile.r });
          if (setShowPanel) setShowPanel(false);

          // Если кликнули на базу/деревню, показываем инфо (TilePanel)
          // В текущей логике HexMap TilePanel показывается через setActiveTile.
          // Если мы планируем путь, мы, возможно, хотим видеть инфо о цели?
          // Обычно в RTS: клик = селект + инфо. Клик ПКМ = движение.
          // У нас: ЛКМ = планирование. ЛКМ х2 = движение.
          if (setActiveTile) setActiveTile(tile);
      } else {
          setPlannedPath(null);
          setTargetTileCoords(null);
          if (setActiveTile) setActiveTile(tile); // Просто селект
      }
  }
}

export function stopMovement(movementRef, setIsMoving, saveState) {
    movementRef.current.queue = [];
    movementRef.current.activeStep = null;
    setIsMoving(false);
    saveState();
}

/**
 * Собирает массив точек для отрисовки линии пути.
 * Первая точка - ВСЕГДА текущая позиция игрока (дробная).
 */
export function calculateDisplayPath(isMoving, movementRef, plannedPath, playerPos) {
    let pathToDraw = null;

    if (isMoving) {
        // Путь при движении: [ЦельТекущегоШага, ...ОстальнаяОчередь]
        const queue = movementRef.current.queue || [];
        const activeEnd = movementRef.current.activeStep ? [movementRef.current.activeStep.endPos] : [];

        // Объединяем, избегая дубликатов (если activeStep.endPos совпадает с queue[0], что невозможно при правильном shift)
        pathToDraw = [...activeEnd, ...queue];
    } else {
        // Путь при планировании: [ВесьЗапланированныйПуть]
        pathToDraw = plannedPath;
    }

    if (!pathToDraw || pathToDraw.length === 0) return null;

    // ВАЖНО: Добавляем текущую позицию игрока как НАЧАЛО пути для отрисовки.
    // Это гарантирует, что линия и стрелка всегда идут ОТ игрока.
    return [
        { q: playerPos.q, r: playerPos.r, accumulatedTime: 0 }, // accumulatedTime 0 для старта (условно)
        ...pathToDraw
    ];
}