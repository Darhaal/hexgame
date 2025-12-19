// 1 реальная секунда = 1 игровая минута
// 24 реальные минуты = 1440 игровых минут = 24 часа
export const REAL_SEC_TO_GAME_MIN = 1;
export const GAME_DAY_MINUTES = 24 * 60; // 1440

// --- НАСТРОЙКА СКОРОСТИ ---
// Множитель скорости анимации.
// 1.0 = Реалистичная (10 игровых минут проходятся за 10 реальных секунд).
// 10.0 = Быстрая (10 игровых минут за 1 секунду).
// Поменяйте на 1.0, чтобы "вернуть как было".
export const ANIMATION_SPEED = 10.0;

// Стоимость перемещения в минутах
export const TIME_COSTS = {
  default: 10,
  forest: 30,
  field: 15,
  road: 5,
  water: Infinity
};

export function formatGameTime(totalMinutes) {
  const minutesInDay = Math.floor(totalMinutes % GAME_DAY_MINUTES);
  const h = Math.floor(minutesInDay / 60);
  const m = Math.floor(minutesInDay % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Возвращает стоимость перемещения в минутах для данного тайла и транспорта.
 */
export function getTileCost(tile, vehicleId = 'none') {
  if (!tile) return Infinity;

  // 1. Обработка транспорта (Приоритет 1)
  if (vehicleId === 'boat' && ['river', 'great_river', 'lake', 'lough_river'].includes(tile.type)) {
      return 10; // С лодкой вода проходима со стоимостью 10
  }

  // 2. Сложные/дорогие тайлы (Приоритет 2)
  if (tile.type === 'forest' || tile.type === 'lough_river') return TIME_COSTS.forest;
  if (tile.type === 'field') return TIME_COSTS.field;

  // 3. Проверка непроходимости (Приоритет 3: Вода без лодки)
  if (['river', 'great_river', 'lake'].includes(tile.type)) return Infinity; // Все реки/озера без лодки непроходимы

  // 4. По умолчанию
  return TIME_COSTS.default;
}