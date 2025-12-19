export const INITIAL_STATS = {
  food: 100,
  water: 100,
  fatigue: 100
};

// Скорости падения (ед/мин)
// Уменьшено до 0.02.
// При скорости x10: 1 ед. падает за 5 реальных секунд.
// При скорости x1: 1 ед. падает за 50 реальных секунд.
const RATES = {
  foodWater: {
    normal: 0.1,
    critical: 0.05
  },
  // Усталость: чуть медленнее еды
  fatigue: {
    normal: 0.05,
    critical: 0.02
  }
};

/**
 * Рассчитывает новые показатели на основе прошедшего времени.
 */
export function calculateStatsDecay(stats, deltaMinutes) {
  // Защита от некорректной дельты времени
  if (!deltaMinutes || deltaMinutes <= 0) return stats;

  const newStats = { ...stats };

  // Функция расчета для одного параметра
  const decay = (val, rateNorm, rateCrit) => {
    let remainingTime = deltaMinutes;
    let current = val;

    while (remainingTime > 0 && current > 0) {
      const isCritical = current <= 30;
      const rate = isCritical ? rateCrit : rateNorm;
      const limit = isCritical ? 0 : 30;

      // Сколько времени нужно, чтобы достичь границы текущей зоны
      const distToLimit = current - limit;
      // Если rate = 0, то timeToLimit бесконечность
      const timeToLimit = rate > 0 ? distToLimit / rate : Infinity;

      if (remainingTime <= timeToLimit) {
        // Успеваем потратить всё время в текущей зоне
        current -= remainingTime * rate;
        remainingTime = 0;
      } else {
        // Доходим до границы, переключаем зону и тратим остаток времени
        current = limit;
        remainingTime -= timeToLimit;

        // Защита от зацикливания на границе
        if (current <= 0) remainingTime = 0;
      }
    }
    return Math.max(0, current);
  };

  newStats.food = decay(newStats.food, RATES.foodWater.normal, RATES.foodWater.critical);
  newStats.water = decay(newStats.water, RATES.foodWater.normal, RATES.foodWater.critical);
  newStats.fatigue = decay(newStats.fatigue, RATES.fatigue.normal, RATES.fatigue.critical);

  return newStats;
}