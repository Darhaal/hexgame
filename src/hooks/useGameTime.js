import { useState, useRef, useCallback } from "react";

// Константы перенесены внутрь, чтобы избежать ошибок импорта
const START_TIME = 360; // 6:00 утра

// Логика расчета дельты (1 сек реального времени = 10 игровых минут, можно менять speed)
const calculateGameDelta = (deltaTime) => {
    const speed = 10.0;
    return (deltaTime / 1000) * speed;
};

export function useGameTime() {
  // Используем ref для хранения точного дробного времени (без ре-рендеров)
  const gameTimeRef = useRef(START_TIME);

  // Состояние для UI (обновляется только при смене минут)
  const [gameTime, setGameTime] = useState(START_TIME);

  const updateTime = useCallback((deltaTime) => {
    const deltaMinutes = calculateGameDelta(deltaTime);

    const prevTime = gameTimeRef.current;
    gameTimeRef.current += deltaMinutes;

    // ИСПРАВЛЕНИЕ ОШИБКИ:
    // Обновляем React-стейт ТОЛЬКО если изменилась целая минута.
    // Это снижает частоту рендеров с 60 раз в секунду до ~1-10 раз (в зависимости от скорости),
    // что предотвращает переполнение стека вызовов и лаги.
    if (Math.floor(gameTimeRef.current) > Math.floor(prevTime)) {
        setGameTime(Math.floor(gameTimeRef.current));
    }

    return deltaMinutes; // Возвращаем дельту для других систем
  }, []);

  const addTime = useCallback((minutes) => {
    const prevTime = gameTimeRef.current;
    gameTimeRef.current = Math.max(0, gameTimeRef.current + minutes);

    // При ручном добавлении (сон) обновляем UI всегда, если время изменилось
    if (Math.floor(gameTimeRef.current) !== Math.floor(prevTime)) {
        setGameTime(Math.floor(gameTimeRef.current));
    }
  }, []);

  const setTime = useCallback((time) => {
    gameTimeRef.current = time;
    setGameTime(Math.floor(time));
  }, []);

  return {
    gameTime,       // Для UI (целые числа)
    gameTimeRef,    // Для внутренней логики (точные дробные)
    updateTime,     // Вызывать в игровом цикле
    addTime,        // Промотать время
    setTime         // Установить время
  };
}