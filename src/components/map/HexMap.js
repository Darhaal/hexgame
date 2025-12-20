"use client";

import React, { useCallback, useRef } from "react";
import HexCanvas from "./HexCanvas";
import { useGameLoop } from "../../hooks/useGameLoop";
import { useGame } from "../../context/GameContext";

export default function HexMap() {
  const {
    isLoaded,
    playerPosRef,
    movementRef, // Нужно для автосейва внутри хуков, но здесь мы просто читаем
    displayPath,
    activeTile, // Можно передать в Canvas для подсветки
    // Methods
    updateTime,
    updateStats,
    updateMovement,
    onTileClick,
    save,
    gameTime
  } = useGame();

  const lastSaveTimeRef = useRef(0);

  // --- ИГРОВОЙ ЦИКЛ (Анимация и Физика) ---
  const gameTick = useCallback((time, deltaTime) => {
    if (!isLoaded) return;
    if (deltaTime > 1000) return; // Пауза при лаге

    // 1. Время
    const deltaMinutes = updateTime(deltaTime);

    // 2. Статы
    updateStats(deltaMinutes);

    // 3. Движение
    updateMovement();

    // 4. Автосейв (раз в 1 сек) — дублирующая логика, можно оставить для надежности
    const now = performance.now();
    if (now - lastSaveTimeRef.current > 1000) {
        save(movementRef.current.queue, movementRef.current.activeStep);
        lastSaveTimeRef.current = now;
    }
  }, [isLoaded, updateTime, updateStats, updateMovement, save, movementRef]);

  // Запуск цикла
  useGameLoop(gameTick);

  if (!isLoaded) return null;

  return (
      <HexCanvas
        playerPosRef={playerPosRef}
        reachableRef={{ current: new Map() }} // Если нужно
        path={displayPath}
        onTileClicked={onTileClick}
        gameTime={gameTime}
      />
  );
}