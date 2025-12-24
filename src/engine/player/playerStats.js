export const INITIAL_STATS = {
  food: 100,
  water: 100,
  fatigue: 100
};

// Скорости падения (ед/мин)
// Теперь параметры падают линейно и предсказуемо от общего времени.
const RATES = {
  food: 0.04,    // ~41 игровой час до 0 (медленнее всего)
  water: 0.08,   // ~20 игровых часов до 0
  fatigue: 0.07  // ~23 игровых часа до 0
};

/**
 * Рассчитывает новые показатели на основе прошедшего времени.
 * Используется простая линейная зависимость от deltaMinutes (общего времени).
 */
export function calculateStatsDecay(stats, deltaMinutes) {
  // Защита от некорректной дельты времени
  if (!deltaMinutes || deltaMinutes <= 0) return stats;

  const newStats = { ...stats };

  // Линейное падение: Stats -= Time * Rate
  // Убрана логика "критических зон", теперь параметры зависят только от времени.
  newStats.food = Math.max(0, newStats.food - deltaMinutes * RATES.food);
  newStats.water = Math.max(0, newStats.water - deltaMinutes * RATES.water);
  newStats.fatigue = Math.max(0, newStats.fatigue - deltaMinutes * RATES.fatigue);

  return newStats;
}