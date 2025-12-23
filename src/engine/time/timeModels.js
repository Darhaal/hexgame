// 1 реальная секунда = 1 игровая минута
export const REAL_SEC_TO_GAME_MIN = 1;
export const GAME_DAY_MINUTES = 24 * 60; // 1440

// --- КАЛЕНДАРЬ (Старт 2005) ---
export const START_YEAR = 2005;
// Смещение на 25 января (24 полных дня прошло)
export const START_DATE_OFFSET = 24 * GAME_DAY_MINUTES;

export const MONTHS = [
    { name: "Января", days: 31 },
    { name: "Февраля", days: 28 },
    { name: "Марта", days: 31 },
    { name: "Апреля", days: 30 },
    { name: "Мая", days: 31 },
    { name: "Июня", days: 30 },
    { name: "Июля", days: 31 },
    { name: "Августа", days: 31 },
    { name: "Сентября", days: 30 },
    { name: "Октября", days: 31 },
    { name: "Ноября", days: 30 },
    { name: "Декабря", days: 31 }
];

export const ANIMATION_SPEED = 10.0;

// Стоимость движения (в минутах)
export const TIME_COSTS = {
  default: 10,
  forest: 25,
  field: 15,
  road: 5,
  water: Infinity
};

// Високосный год
export function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInMonth(monthIndex, year) {
    if (monthIndex === 1 && isLeapYear(year)) return 29;
    return MONTHS[monthIndex].days;
}

export function formatGameTime(totalMinutes) {
  const minutesInDay = Math.floor(totalMinutes % GAME_DAY_MINUTES);
  const h = Math.floor(minutesInDay / 60);
  const m = Math.floor(minutesInDay % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function getTileCost(tile, vehicleId = 'none') {
  if (!tile) return Infinity;
  if (vehicleId === 'boat' && ['river', 'great_river', 'lake', 'lough_river'].includes(tile.type)) {
      return 10;
  }
  if (tile.type === 'forest' || tile.type === 'lough_river') return TIME_COSTS.forest;
  if (tile.type === 'field') return TIME_COSTS.field;
  if (['river', 'great_river', 'lake'].includes(tile.type)) return Infinity;
  return TIME_COSTS.default;
}