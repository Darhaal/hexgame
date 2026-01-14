// src/data/objectsData.js
import { SIMPLE_VEHICLES, VEHICLE_BODIES, ENGINES, WHEELS } from "./vehiclesData";

/**
 * АДАПТЕР: Превращаем "сырые" данные техники в игровые объекты с визуалом.
 */

// Вспомогательная функция для назначения иконки и размера по типу
function enrichObject(obj, category) {
    let icon = "📦";
    let width = 1;
    let height = 1;
    let color = "#8d6e63"; // Коричневый по дефолту

    // Логика иконок
    if (category === 'vehicle_body') {
        if (obj.type === 'car') { icon = "🚙"; width = 2; height = 1; color = "#5D4037"; }
        if (obj.type === 'moto') { icon = "🏍️"; width = 1; height = 1; color = "#455a64"; }
        if (obj.type === 'bike') { icon = "🚲"; width = 1; height = 1; color = "#607d8b"; }
        if (obj.type === 'boat') { icon = "🚤"; width = 2; height = 1; color = "#0277bd"; }
        if (obj.type === 'scooter') { icon = "🛴"; width = 1; height = 1; color = "#8d6e63"; }
    } else if (category === 'simple') {
        if (obj.type === 'cart') { icon = "🛒"; width = 1; height = 1; color = "#795548"; }
        if (obj.type === 'animal') { icon = "🐎"; width = 2; height = 1; color = "#5d4037"; }
        if (obj.type === 'scooter') { icon = "🛴"; width = 1; height = 1; color = "#8d6e63"; }
    } else if (category === 'engine') {
        icon = "⚙️"; width = 1; height = 1; color = "#424242";
    } else if (category === 'wheel') {
        icon = "⚫"; width = 1; height = 1; color = "#212121";
    }

    return {
        ...obj,
        icon,
        width,
        height,
        color,
        movable: true, // Все запчасти и технику можно двигать (пока упрощенно)
    };
}

// Собираем единую базу
export const OBJECTS_DB = {};

// 1. Добавляем Simple Vehicles
Object.values(SIMPLE_VEHICLES).forEach(v => {
    OBJECTS_DB[v.id] = enrichObject(v, 'simple');
});

// 2. Добавляем Bodies
Object.values(VEHICLE_BODIES).forEach(v => {
    OBJECTS_DB[v.id] = enrichObject(v, 'vehicle_body');
});

// 3. Добавляем Engines
Object.values(ENGINES).forEach(e => {
    OBJECTS_DB[e.id] = enrichObject(e, 'engine');
});

// 4. Добавляем Wheels
Object.values(WHEELS).forEach(w => {
    OBJECTS_DB[w.id] = enrichObject(w, 'wheel');
});

// 5. Добавляем статические объекты (Дом, Костер) - их нет в vehicleData, но они нужны для игры
//    Хардкодим их здесь, чтобы не потерять.
OBJECTS_DB["house_village"] = {
    id: "house_village", name: "Дом", type: "structure", icon: "🏠",
    width: 4, height: 3, color: "#3e2723", description: "Старый дом.", movable: false
};
OBJECTS_DB["bonfire_old"] = {
    id: "bonfire_old", name: "Кострище", type: "structure", icon: "🔥",
    width: 1, height: 1, color: "#212121", description: "Зола.", movable: false
};
OBJECTS_DB["loot_box"] = {
    id: "loot_box", name: "Ящик", type: "container", icon: "📦",
    width: 1, height: 1, color: "#8d6e63", description: "Деревянный.", movable: true
};


// Начальное состояние мира (Координаты в сетке 100x100)
export const INITIAL_WORLD_OBJECTS = {
  "0,0": [
    // База
    { templateId: "house_village", uniqueId: "home", x: 48, y: 48 },
    { templateId: "bonfire_old", uniqueId: "fire_1", x: 52, y: 52 },

    // Техника для старта (Примеры из vehicleData)
    { templateId: "car_uaz469", uniqueId: "my_uaz", x: 55, y: 50 }, // УАЗ-469
    { templateId: "bike_ukraina", uniqueId: "my_bike", x: 54, y: 49 }, // Велик Украина

    // Запчасти (Двигатель, Колеса)
    { templateId: "zmz402", uniqueId: "eng1", x: 54, y: 48 }, // Двигатель ЗМЗ
    { templateId: "auto_uaz", uniqueId: "w1", x: 57, y: 51 }, // Колесо УАЗ

    // Лут
    { templateId: "loot_box", uniqueId: "box_tools", x: 46, y: 51 }
  ]
};