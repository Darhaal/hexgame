import { getTileCost } from "../time/timeModels";

function getDistance(a, b) {
  // Hexagonal distance (Manhattan distance on axial coordinates)
  return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
}

/**
 * A* pathfinding algorithm.
 * @param {Object} start - {q, r}
 * @param {Object} end - {q, r}
 * @param {Array} mapData
 * @param {string} vehicleId
 * @param {number} initialTime - Accumulated time (minutes) to offset the path cost.
 */
export function findPath(start, end, mapData, vehicleId = 'none', initialTime = 0) {
  const startKey = `${start.q},${start.r}`;
  const endKey = `${end.q},${end.r}`;

  if (startKey === endKey) return null;

  const tileMap = new Map(mapData.map(t => [`${t.q},${t.r}`, t]));

  if (!tileMap.has(endKey)) return null;

  const frontier = [];
  frontier.push({ q: start.q, r: start.r, priority: 0 });

  const cameFrom = new Map();
  const costSoFar = new Map(); // Cost in minutes from the start of THIS segment

  cameFrom.set(startKey, null);
  costSoFar.set(startKey, 0);

  while (frontier.length > 0) {
    // Priority queue sort (simple array sort, could be optimized with a real heap)
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
      const currentTile = tileMap.get(currentKey);

      if (!nextTile) continue;

      // Calculate average cost between current tile and next tile
      const costFrom = getTileCost(currentTile, vehicleId);
      const costTo = getTileCost(nextTile, vehicleId);

      if (costFrom === Infinity || costTo === Infinity) continue; // Impassable tile

      const moveTime = (costFrom + costTo) / 2;

      const newCost = costSoFar.get(currentKey) + moveTime;

      if (!costSoFar.has(nextKey) || newCost < costSoFar.get(nextKey)) {
        costSoFar.set(nextKey, newCost);
        // Heuristic: Euclidean distance * 10 (scaling factor)
        const priority = newCost + getDistance(next, end) * 10;
        frontier.push({ q: next.q, r: next.r, priority });
        cameFrom.set(nextKey, current);
      }
    }
  }

  if (!cameFrom.has(endKey)) return null;

  const path = [];
  let curr = end;
  const startTileKey = `${start.q},${start.r}`;

  while (curr && `${curr.q},${curr.r}` !== startTileKey) {
    const key = `${curr.q},${curr.r}`;

    path.push({
        ...curr,
        // Add initial time offset to accumulated time
        accumulatedTime: costSoFar.get(key) + initialTime
    });

    curr = cameFrom.get(key);
  }

  return path.reverse();
}