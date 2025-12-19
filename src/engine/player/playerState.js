import { INITIAL_STATS } from "./playerStats";
import { createInitialInventory } from "../inventory/inventoryLogic";
import { INITIAL_SKILLS, INITIAL_CHARACTER } from "../../data/skillsData";

/**
 * Управление состоянием игрока: Позиция, Время, Очередь, Статистика, Инвентарь, Навыки и Персонаж.
 */

export const START_TIME = 8 * 60;

export function loadPlayerState() {
  try {
    const pos = JSON.parse(localStorage.getItem("playerPos"));
    const savedTime = localStorage.getItem("playerTime");
    const gameTime = savedTime ? parseFloat(savedTime) : START_TIME;
    const vehicle = localStorage.getItem("playerVehicle") || "none";

    const queueRaw = localStorage.getItem("playerQueue");
    const queue = queueRaw ? JSON.parse(queueRaw) : [];

    const activeStepRaw = localStorage.getItem("playerActiveStep");
    const activeStep = activeStepRaw ? JSON.parse(activeStepRaw) : null;

    const statsRaw = localStorage.getItem("playerStats");
    const stats = statsRaw ? JSON.parse(statsRaw) : INITIAL_STATS;

    const invRaw = localStorage.getItem("playerInventory");
    const inventory = invRaw ? JSON.parse(invRaw) : createInitialInventory();

    // --- НОВЫЕ ПОЛЯ ---
    const skillsRaw = localStorage.getItem("playerSkills");
    const skills = skillsRaw ? JSON.parse(skillsRaw) : INITIAL_SKILLS;

    const charRaw = localStorage.getItem("playerCharacter");
    const character = charRaw ? JSON.parse(charRaw) : INITIAL_CHARACTER;

    if (pos) {
      return { pos, gameTime, vehicle, queue, activeStep, stats, inventory, skills, character };
    }
  } catch (e) {
    console.warn("Error loading state", e);
  }

  return {
      pos: { q: 0, r: 0 },
      gameTime: START_TIME,
      vehicle: "none",
      queue: [],
      activeStep: null,
      stats: INITIAL_STATS,
      inventory: createInitialInventory(),
      skills: INITIAL_SKILLS,
      character: INITIAL_CHARACTER
  };
}

export function savePlayerState(pos, gameTime, vehicle = "none", queue = [], activeStep = null, stats = INITIAL_STATS, inventory = [], skills = INITIAL_SKILLS, character = INITIAL_CHARACTER) {
  try {
    localStorage.setItem("playerPos", JSON.stringify(pos));
    localStorage.setItem("playerTime", String(gameTime));
    localStorage.setItem("playerVehicle", vehicle);
    localStorage.setItem("playerQueue", JSON.stringify(queue));
    localStorage.setItem("playerActiveStep", JSON.stringify(activeStep));
    localStorage.setItem("playerStats", JSON.stringify(stats));
    localStorage.setItem("playerInventory", JSON.stringify(inventory));
    // --- НОВЫЕ ПОЛЯ ---
    localStorage.setItem("playerSkills", JSON.stringify(skills));
    localStorage.setItem("playerCharacter", JSON.stringify(character));
  } catch (e) {
    console.warn("Failed to save player state", e);
  }
}