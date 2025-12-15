import { TILE_TYPES } from "../../data/tileTypes";

// Генерируем список непроходимых типов для pathfinding
// (Хотя pathfinding теперь использует getTileCost, этот список полезен для UI)
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
  if (VEHICLES[id]) {
    currentVehicle = VEHICLES[id];
    return true;
  }
  return false;
}