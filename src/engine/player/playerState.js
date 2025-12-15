/**
 * Управление состоянием игрока: Позиция, Время и Детальная Очередь движения.
 */

export const START_TIME = 8 * 60;

export function loadPlayerState() {
  try {
    const pos = JSON.parse(localStorage.getItem("playerPos"));
    const savedTime = localStorage.getItem("playerTime");
    const gameTime = savedTime ? parseFloat(savedTime) : START_TIME;
    const vehicle = localStorage.getItem("playerVehicle") || "none";

    // Загружаем очередь и состояние активного шага
    const queueRaw = localStorage.getItem("playerQueue");
    const queue = queueRaw ? JSON.parse(queueRaw) : [];

    const activeStepRaw = localStorage.getItem("playerActiveStep");
    const activeStep = activeStepRaw ? JSON.parse(activeStepRaw) : null;

    if (pos) {
      return { pos, gameTime, vehicle, queue, activeStep };
    }
  } catch (e) {
    console.warn("Error loading state", e);
  }
  return { pos: { q: 0, r: 0 }, gameTime: START_TIME, vehicle: "none", queue: [], activeStep: null };
}

export function savePlayerState(pos, gameTime, vehicle = "none", queue = [], activeStep = null) {
  try {
    localStorage.setItem("playerPos", JSON.stringify(pos));
    localStorage.setItem("playerTime", String(gameTime));
    localStorage.setItem("playerVehicle", vehicle);
    localStorage.setItem("playerQueue", JSON.stringify(queue));
    localStorage.setItem("playerActiveStep", JSON.stringify(activeStep));
  } catch (e) {
    console.warn("Failed to save player state", e);
  }
}