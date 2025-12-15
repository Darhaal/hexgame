import { getTileCost } from "../time/timeModels";

function getDistance(a, b) {
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

export function findPath(start, end, mapData, vehicleId = 'none') {
  const startKey = `${start.q},${start.r}`;
  const endKey = `${end.q},${end.r}`;

  if (startKey === endKey) return null;

  const tileMap = new Map();
  mapData.forEach(t => tileMap.set(`${t.q},${t.r}`, t));

  if (!tileMap.has(endKey)) return null;

  const frontier = [];
  frontier.push({ q: start.q, r: start.r, priority: 0 });

  const cameFrom = new Map();
  const costSoFar = new Map(); // Стоимость в минутах

  cameFrom.set(startKey, null);
  costSoFar.set(startKey, 0);

  while (frontier.length > 0) {
    frontier.sort((a, b) => a.priority - b.priority);
    const current = frontier.shift();
    const currentKey = `${current.q},${current.r}`;

    if (currentKey === endKey) break;

    const neighbors = [
      {q:1,r:0}, {q:1,r:-1}, {q:0,r:-1},
      {q:-1,r:0}, {q:-1,r:1}, {q:0,r:1}
    ].map(offset => ({ q: current.q + offset.q, r: current.r + offset.r }));

    for (const next of neighbors) {
      const nextKey = `${next.q},${next.r}`;
      const nextTile = tileMap.get(nextKey);

      if (!nextTile) continue;

      // Получаем стоимость времени (вернет Infinity, если непроходимо)
      const moveTime = getTileCost(nextTile, vehicleId);

      if (moveTime === Infinity) continue;

      const newCost = costSoFar.get(currentKey) + moveTime;

      if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)) {
        costSoFar.set(nextKey, newCost);
        const priority = newCost + getDistance(next, end) * 10;
        frontier.push({ q: next.q, r: next.r, priority });
        cameFrom.set(nextKey, current);
      }
    }
  }

  if (!cameFrom.has(endKey)) return null;

  const path = [];
  let curr = end;
  while (curr) {
    const key = `${curr.q},${curr.r}`;
    if (key === startKey) break;

    // Сохраняем накопленное время в точке пути
    // Это время от начала пути до этой точки
    path.push({
        ...curr,
        accumulatedTime: costSoFar.get(key)
    });

    curr = cameFrom.get(key);
  }

  return path.reverse();
}