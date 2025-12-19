import { getItemData } from "../../data/itemsData";

// Увеличено до 50 слотов
export const INVENTORY_SIZE = 50;

/**
 * Создает начальный инвентарь (массив слотов)
 */
export function createInitialInventory() {
  const inv = new Array(INVENTORY_SIZE).fill(null);

  // Добавляем стартовые предметы (ID должны совпадать с itemsData)
  addItemToInventory(inv, createItemInstance('knife_hunting'));
  addItemToInventory(inv, createItemInstance('water_bottle_1l'));
  addItemToInventory(inv, createItemInstance('canned_beef'));
  addItemToInventory(inv, createItemInstance('apple'));
  addItemToInventory(inv, createItemInstance('matches'));

  return inv;
}

/**
 * Создает экземпляр предмета (с динамическими свойствами)
 */
export function createItemInstance(itemId, creationTime = 0) {
  const data = getItemData(itemId);
  if (!data) {
      console.warn(`Item not found in DB: ${itemId}`);
      return null;
  }

  return {
    itemId: itemId,
    uuid: crypto.randomUUID(), // Уникальный ID экземпляра
    createdAt: creationTime, // Время создания (для срока годности)
    condition: 100, // Состояние (100%)
  };
}

/**
 * Добавляет предмет в первый свободный слот.
 */
export function addItemToInventory(inventory, itemInstance) {
  if (!itemInstance) return false;

  // Ищем первый пустой слот (null)
  const emptyIndex = inventory.findIndex(slot => slot === null);

  if (emptyIndex !== -1) {
    const newInventory = [...inventory];
    newInventory[emptyIndex] = itemInstance;
    return newInventory;
  }

  return false; // Инвентарь полон
}

/**
 * Удаляет предмет из слота.
 */
export function removeItemFromInventory(inventory, slotIndex) {
  if (slotIndex < 0 || slotIndex >= inventory.length) return inventory;

  const newInventory = [...inventory];
  newInventory[slotIndex] = null;
  return newInventory;
}

/**
 * Использует предмет. Возвращает обновленный инвентарь и эффект.
 */
export function useItem(inventory, slotIndex, gameTime) {
  const itemInstance = inventory[slotIndex];
  if (!itemInstance) return { inventory, effect: null };

  const data = getItemData(itemInstance.itemId);
  if (!data) return { inventory, effect: null };

  // Проверка срока годности
  if (data.perishTime) {
      const age = gameTime - itemInstance.createdAt;
      if (age > data.perishTime) {
          return { inventory, effect: { message: "Предмет испорчен!" } };
      }
  }

  // Применяем эффект (удаляем предмет, если он расходуемый - еда/вода)
  let newInventory = inventory;
  const consumableTypes = ['food', 'drink', 'food_raw', 'consumable'];

  if (consumableTypes.includes(data.type)) {
      newInventory = removeItemFromInventory(inventory, slotIndex);
  }

  return {
      inventory: newInventory,
      effect: data.effect
  };
}