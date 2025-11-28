"use client";
import { useEffect, useRef } from "react";

/**
 * Хук для запуска игрового цикла (анимации).
 * Вызывает callback каждый кадр (обычно 60 раз в секунду).
 */
export function useGameLoop(callback) {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(time, deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [callback]);
}