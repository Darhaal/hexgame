// src/engine/player/playerEngine.js
import mapData from "../../data/mapData";
import { TILE_TYPES } from "../../data/tileTypes"; // Импортируем "мастер-данные"

// 1. Генерируем таблицу стоимости хода (MOVE_COST) автоматически
// Берем данные из TILE_TYPES, чтобы не писать вручную
export const MOVE_COST = {};
Object.values(TILE_TYPES).forEach((t) => {
  MOVE_COST[t.id] = t.moveCost;
});

// 2. Генерируем список заблокированных типов (BLOCKED)
// Фильтруем все типы, у которых passable: false
export const BLOCKED = new Set(
  Object.values(TILE_TYPES)
    .filter((t) => !t.passable)
    .map((t) => t.id)
);

export const START_STEPS = 5;

export const VEHICLES = {
  none: {
    id: "none",
    name: "Пешком",
    stepBonus: 0,
    passable: [],
    costModifier: {}
  },
  boat: {
    id: "boat",
    name: "Лодка",
    stepBonus: 10,
    // Здесь мы всё еще перечисляем вручную, что может проходить лодка,
    // так как это специфика транспорта, а не тайла.
    passable: ["lake", "river", "lough_river", "great_river"],
    costModifier: { water: 1 }
  },
  car: {
    id: "car",
    name: "Машина",
    stepBonus: 20,
    passable: [],
    costModifier: { field: 5, forest: 10 } // Машина в лесу едет очень медленно
  },
};

export let currentVehicle = VEHICLES.none;

export function setVehicle(id) {
  if (VEHICLES[id]) {
    currentVehicle = VEHICLES[id];
    return true;
  }
  return false;
}

export function getTile(q, r) {
  return mapData.find(t => t.q === q && t.r === r);
}

export function tileCost(tile) {
  if (!tile) return Infinity;

  const typeId = tile.type; // Строка (напр. "forest")

  // Если тип в списке BLOCKED (сгенерированном выше) и транспорт не позволяет -> стена
  if (BLOCKED.has(typeId) && !currentVehicle.passable.includes(typeId)) {
    return Infinity;
  }

  let base = MOVE_COST[typeId] ?? 1;

  if (currentVehicle.costModifier && currentVehicle.costModifier[typeId]) {
    base = base * currentVehicle.costModifier[typeId];
  }

  return base;
}

/**
 * Поиск пути (Dijkstra)
 */
export function computeReachable(start, steps) {
  const dirs = [
    { q: 1, r: 0 }, { q: -1, r: 0 },
    { q: 0, r: 1 }, { q: 0, r: -1 },
    { q: 1, r: -1 }, { q: -1, r: 1 }
  ];

  const index = new Map();
  for (const t of mapData) index.set(`${t.q},${t.r}`, t);

  const startKey = `${start.q},${start.r}`;
  const best = new Map();
  const pq = [{ key: startKey, spent: 0 }];
  best.set(startKey, 0);

  while (pq.length) {
    pq.sort((a,b) => a.spent - b.spent);
    const cur = pq.shift();
    const [q, r] = cur.key.split(",").map(Number);

    for (const d of dirs) {
      const nq = q + d.q;
      const nr = r + d.r;
      const nKey = `${nq},${nr}`;
      const nt = index.get(nKey);

      if (!nt) continue;

      const cost = tileCost(nt);
      if (cost === Infinity) continue;

      const nextSpent = cur.spent + cost;
      if (nextSpent <= steps) {
        if (!best.has(nKey) || nextSpent < best.get(nKey)) {
          best.set(nKey, nextSpent);
          pq.push({ key: nKey, spent: nextSpent });
        }
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