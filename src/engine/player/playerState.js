// src/engine/player/playerState.js
/**
 * Simple localStorage-backed player state helpers.
 * - loadPlayerState()
 * - savePlayerState(pos, steps)
 */

import { VEHICLES } from "./playerEngine";

export const START_STEPS = 5;

export function loadPlayerState() {
  try {
    const pos = JSON.parse(localStorage.getItem("playerPos"));
    const veh = localStorage.getItem("playerVehicle");
    let vehicle = VEHICLES.none;
    if (veh && VEHICLES[veh]) vehicle = VEHICLES[veh];

    if (pos) {
      return { pos, steps: START_STEPS + (vehicle.stepBonus ?? 0) };
    }
  } catch (e) { /* ignore */ }
  return { pos: { q: 0, r: 0 }, steps: START_STEPS };
}

export function savePlayerState(pos, steps) {
  try {
    localStorage.setItem("playerPos", JSON.stringify(pos));
    localStorage.setItem("playerSteps", String(steps));
    // store vehicle id if present
    const curVeh = (typeof window !== "undefined" && localStorage.getItem("playerVehicle")) || "none";
    localStorage.setItem("playerVehicle", curVeh);
  } catch (e) { console.warn("Failed to save player state", e); }
}
