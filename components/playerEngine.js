// components/playerEngine.js
import mapData from "./mapData.js";

export const MOVE_COST = {
  village: 1,
  field: 1.5,
  forest: 2,
  road: 0.5,
};

export const BLOCKED = new Set([
  "lake",
  "river",
  "lough_river",
  "great_river",
]);

export const START_STEPS = 5;

// ---------- 🚗 ТРАНСПОРТ -----------

export const VEHICLES = {
  none: {
    id: "none",
    name: "On Foot",
    stepBonus: 0,
    passable: [],          // ничe не может проходить
    costModifier: {},      // не меняет цены
    devOnly: false,
  },

  devCar: {
    id: "devCar",
    name: "Developer Car",
    stepBonus: 20,         // +10 шагов
     passable: ["lake", "river", "lough_river", "great_river"],
     costModifier: {
     road: 0.25,
    },
    devOnly: true,
  },

};

// текущий выбранный транспорт
export let currentVehicle = VEHICLES.none;

export function setVehicle(id) {
  if (VEHICLES[id]) {
    currentVehicle = VEHICLES[id];
    return true;
  }
  return false;
}

// ---------- ЛОГИКА КАРТЫ -----------

export function getTile(q, r) {
  return mapData.find(t => t.q === q && t.r === r);
}

export function tileCost(tile) {
  if (!tile) return Infinity;

  // разблокируем клетки, если транспорт позволяет
  if (BLOCKED.has(tile.type) && !currentVehicle.passable.includes(tile.type)) {
    return Infinity;
  }

  let base = MOVE_COST[tile.type] ?? 1;

  // модификации транспорта
  if (currentVehicle.costModifier[tile.type]) {
    base = base * currentVehicle.costModifier[tile.type];
  }

  return base;
}

// ---------- Алгоритм Дейкстры -----------
export function computeReachable(start, steps) {
  const dirs = [
    { q: +1, r: 0 },
    { q: -1, r: 0 },
    { q: 0, r: +1 },
    { q: 0, r: -1 },
    { q: +1, r: -1 },
    { q: -1, r: +1 },
  ];

  const index = new Map();
  for (const t of mapData) index.set(`${t.q},${t.r}`, t);

  const startKey = `${start.q},${start.r}`;
  const best = new Map();
  const pq = [{ key: startKey, spent: 0 }];

  best.set(startKey, 0);

  while (pq.length) {
    pq.sort((a, b) => a.spent - b.spent);
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
      if (nextSpent > steps) continue;

      if (!best.has(nKey) || nextSpent < best.get(nKey)) {
        best.set(nKey, nextSpent);
        pq.push({ key: nKey, spent: nextSpent });
      }
    }
  }

  return best;
}

// ---------- Применить ход -----------
export function applyMove(current, targetTile, reachableMap, currentSteps) {
  const key = `${targetTile.q},${targetTile.r}`;
  if (!reachableMap.has(key)) return null;

  const spent = reachableMap.get(key);
  const newSteps = currentSteps - spent;

  if (newSteps < 0) return null;

  return {
    newPos: { q: targetTile.q, r: targetTile.r },
    newSteps,
  };
}

// ---------- ХРАНЕНИЕ ----------
export function loadPlayerState() {
  try {
    const pos = JSON.parse(localStorage.getItem("playerPos"));
    const veh = localStorage.getItem("playerVehicle");
    if (veh && VEHICLES[veh]) currentVehicle = VEHICLES[veh];

    if (pos) {
      return {
        pos,
        steps: START_STEPS + currentVehicle.stepBonus
      };
    }
  } catch {}

  return {
    pos: { q: 0, r: 0 },
    steps: START_STEPS + currentVehicle.stepBonus
  };
}

export function savePlayerState(pos, steps) {
  localStorage.setItem("playerPos", JSON.stringify(pos));
  localStorage.setItem("playerVehicle", currentVehicle.id);
  localStorage.setItem("playerSteps", String(steps));
}
