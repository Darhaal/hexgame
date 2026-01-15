// src/engine/vehicle/assemblyLogic.js

// Конфигурация слотов для схемы автомобиля
export const SLOTS_LAYOUT = {
    // Двигатель (Под капотом)
    engine: { x: 50, y: 15, label: "ДВИГАТЕЛЬ", type: "engine" },
    // АКБ (Сбоку под капотом)
    battery: { x: 75, y: 15, label: "АКБ", type: "part" }, // type: 'part' соответствует аккумулятору

    // Колеса (По осям, чуть шире кузова)
    wheel_fl: { x: 12, y: 24, label: "Л.ПЕРЕД", type: "wheel" },
    wheel_fr: { x: 88, y: 24, label: "П.ПЕРЕД", type: "wheel" },
    wheel_rl: { x: 12, y: 72, label: "Л.ЗАДН", type: "wheel" },
    wheel_rr: { x: 88, y: 72, label: "П.ЗАДН", type: "wheel" },
};

/**
 * Проверяет, подходит ли деталь к выбранному слоту.
 * @param {string} slotKey - ID слота (напр. 'wheel_fl')
 * @param {object} part - Объект детали
 */
export function isPartCompatible(slotKey, part) {
    if (!slotKey || !part) return false;

    const slotDef = SLOTS_LAYOUT[slotKey];
    if (!slotDef) return false;

    // 1. Строгая проверка по типу
    if (part.type === slotDef.type) return true;

    // 2. Fallback: проверка по ID или названию, если тип не задан явно или 'part'
    const id = (part.templateId || part.id || "").toLowerCase();

    if (slotDef.type === 'wheel') {
        return id.includes('wheel') || id.includes('auto_') || id.includes('tire');
    }
    if (slotDef.type === 'engine') {
        return id.includes('engine') || id.includes('motor') || id.includes('_eng');
    }
    if (slotDef.type === 'part' && slotKey === 'battery') {
        return id.includes('battery') || id.includes('akb') || id.includes('bat_');
    }

    return false;
}