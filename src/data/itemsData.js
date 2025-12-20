// Импорт категорий
import { fishItems } from "./items/fish";
// import { fishingGear } from "./items/fishingGear"; // Заглушка механики рыбалки

export const ITEM_TYPES = {
  FOOD: 'food',
  FOOD_RAW: 'food_raw',
  DRINK: 'drink',
  TOOL: 'tool',
  RESOURCE: 'resource',
  GEAR: 'gear',
  CONTAINER: 'container',
  CONSUMABLE: 'consumable'
};

// Объединяем все массивы в один плоский список
const ALL_ITEMS_LIST = [
    ...fishItems,
    // ...fishingGear // Заглушка
];

// Создаем объект для быстрого доступа по ID: { "apple": { ...data }, ... }
export const ITEMS = ALL_ITEMS_LIST.reduce((acc, item) => {
    if (acc[item.id]) {
        console.warn(`Duplicate Item ID found: ${item.id}`);
    }
    acc[item.id] = item;
    return acc;
}, {});

/**
 * Возвращает полные данные о предмете по ID.
 * @param {string} itemId
 * @returns {object|null}
 */
export function getItemData(itemId) {
  return ITEMS[itemId] || null;
}

/**
 * Возвращает список всех предметов (для дебага или списков)
 */
export function getAllItems() {
    return ALL_ITEMS_LIST;
}