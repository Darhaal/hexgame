import { TILE_TYPES } from "../../data/tileTypes";

/**
 * Generated list of impassable tile types (useful for UI).
 */
export const BLOCKED = new Set(
  Object.values(TILE_TYPES)
    .filter((t) => !t.passable)
    .map((t) => t.id)
);

export const VEHICLES = {
  none: { id: "none", name: "Пешком" },
  boat: { id: "boat", name: "Лодка" },
  horse: { id: "horse", name: "Лошадь" }
};

export let currentVehicle = VEHICLES.none;

export function setVehicle(id) {
  const vehicle = VEHICLES[id];
  if (vehicle) {
    currentVehicle = vehicle;
    return true;
  }
  return false;
}