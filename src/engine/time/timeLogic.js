import { REAL_SEC_TO_GAME_MIN, ANIMATION_SPEED } from "./timeModels";

/**
 * Calculates the increment of game time based on real frame time (deltaTime).
 * Вычисляет прирост игрового времени на основе реального времени кадра.
 * * @param {number} deltaTime - time in ms passed since the last frame
 * @returns {number} - amount of game minutes to add
 */
export function calculateGameDelta(deltaTime) {
  // (ms / 1000) * (minutes per real second) * (animation speed multiplier)
  return (deltaTime / 1000) * REAL_SEC_TO_GAME_MIN * ANIMATION_SPEED;
}