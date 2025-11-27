// src/engine/player/playerEngine.js
/**
 * Player movement logic:
 * - MOVE_COST mapping
 * - BLOCKED tile types
 * - computeReachable(start, steps) → Dijkstra-like search over mapData
 * - applyMove(...) → build new pos/steps result
 *
 * Expects mapData imported from data/mapData.js
 */

import mapData from "../../data/mapData";

export const MOVE_COST = {
  village: 1,
  field: 1.5,
  forest: 2,
  road: 0.5,
};

export const BLOCKED = new Set(["lake", "river", "lough_river", "great_river"]);

export const START_STEPS = 5;

export const VEHICLES = {
  none: { id: "none", name: "On Foot", stepBonus: 0, passable: [], costModifier: {} },
  devCar: { id: "devCar", name: "Developer Car", stepBonus: 20, passable: ["lake","river","lough_river","great_river"], costModifier: { road: 0.25 }, devOnly: true },
};

export let currentVehicle = VEHICLES.none;

export function setVehicle(id) {
  if (VEHICLES[id]) { currentVehicle = VEHICLES[id]; return true; }
  return false;
}

export function getTile(q, r) {
  return mapData.find(t => t.q === q && t.r === r);
}

export function tileCost(tile) {
  if (!tile) return Infinity;

  const typeId = tile.type.id;

  if (BLOCKED.has(typeId) && !currentVehicle.passable.includes(typeId))
    return Infinity;

  let base = MOVE_COST[typeId] ?? 1;

  if (currentVehicle.costModifier[typeId])
    base *= currentVehicle.costModifier[typeId];

  return base;
}

/**
 * Dijkstra-like flood from start while cost <= steps.
 * returns Map<"q,r", spentCost>
 */
export function computeReachable(start, steps) {
  const dirs = [{ q:+1,r:0},{ q:-1,r:0},{ q:0,r:+1},{ q:0,r:-1},{ q:+1,r:-1},{ q:-1,r:+1 }];
  // build index of available tiles (key -> tile)
  const index = new Map();
  for (const t of mapData) index.set(`${t.q},${t.r}`, t);

  const startKey = `${start.q},${start.r}`;
  const best = new Map();
  const pq = [{ key: startKey, spent: 0 }];
  best.set(startKey, 0);

  while (pq.length) {
    pq.sort((a,b) => a.spent - b.spent);
    const cur = pq.shift();
    const [q,r] = cur.key.split(",").map(Number);

    for (const d of dirs) {
      const nq = q + d.q; const nr = r + d.r;
      const nKey = `${nq},${nr}`;
      const nt = index.get(nKey);
      if (!nt) continue;
      const cost = tileCost(nt);
      if (cost === Infinity) continue;
      const nextSpent = cur.spent + cost;
      if (nextSpent > steps) continue;
      if (!best.has(nKey) || nextSpent < best.get(nKey)) {
        best.set(nKey, nextSpent);
        pq.push({ key: nKey, spent: nextSpent });
      }
    }
  }

  return best;
}

export function applyMove(current, targetTile, reachableMap, currentSteps) {
  const key = `${targetTile.q},${targetTile.r}`;
  if (!reachableMap.has(key)) return null;
  const spent = reachableMap.get(key);
  const newSteps = currentSteps - spent;
  if (newSteps < 0) return null;
  return { newPos: { q: targetTile.q, r: targetTile.r }, newSteps };
}
