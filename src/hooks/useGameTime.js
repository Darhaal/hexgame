import { useState, useRef, useCallback } from "react";
import { START_TIME } from "../engine/player/playerState";
import { calculateGameDelta } from "../engine/time/timeLogic";

export function useGameTime() {
  const gameTimeRef = useRef(START_TIME);
  // Состояние для UI (обновляется реже или по запросу, но в нашем случае каждый кадр через HexMap)
  const [gameTime, setGameTime] = useState(START_TIME);

  const updateTime = useCallback((deltaTime) => {
    const deltaMinutes = calculateGameDelta(deltaTime);
    gameTimeRef.current += deltaMinutes;
    setGameTime(gameTimeRef.current);
    return deltaMinutes; // Возвращаем дельту для других систем (статов)
  }, []);

  const addTime = useCallback((minutes) => {
    gameTimeRef.current = Math.max(0, gameTimeRef.current + minutes);
    setGameTime(gameTimeRef.current);
  }, []);

  const setTime = useCallback((time) => {
    gameTimeRef.current = time;
    setGameTime(time);
  }, []);

  return {
    gameTime,
    gameTimeRef,
    updateTime,
    addTime,
    setTime
  };
}