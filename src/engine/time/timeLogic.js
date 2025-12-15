import { REAL_SEC_TO_GAME_MIN, ANIMATION_SPEED } from "./timeModels";

/**
 * Вычисляет прирост игрового времени на основе реального времени кадра.
 * @param {number} deltaTime - время в мс, прошедшее с прошлого кадра
 * @returns {number} - количество игровых минут для прибавления
 */
export function calculateGameDelta(deltaTime) {
  // (мс / 1000) * (минут в секунду) * (множитель скорости)
  return (deltaTime / 1000) * REAL_SEC_TO_GAME_MIN * ANIMATION_SPEED;
}