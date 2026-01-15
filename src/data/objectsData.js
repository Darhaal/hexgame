import { SIMPLE_VEHICLES, VEHICLE_BODIES, ENGINES, WHEELS } from "./vehiclesData";
import { TOOLS_DB } from "./toolsData";

function enrichObject(obj, category) {
    let icon = "📦";
    let width = 1; let height = 1; let color = "#8d6e63";
    let type = obj.type || 'part';
    let stats = {};

    if (category === 'wheel') {
        type = 'wheel'; icon = "⚫"; color = "#212121";
        stats = { mod: obj.mod }; // Сохраняем проходимость
    }
    else if (category === 'engine') {
        type = 'engine'; icon = "⚙️"; color = "#455a64";
        stats = { power: obj.power, fuel: obj.fuel };
    }
    else if (category === 'vehicle_body') {
        type = 'vehicle_body';
        if (obj.id.includes('car') || obj.id.includes('uaz')) { icon = "🚙"; width = 2; height = 1; color = "#5D4037"; }
        else if (obj.id.includes('moto')) { icon = "🏍️"; width = 1; height = 1; color = "#455a64"; }
        stats = { weight: obj.weight, cargo: obj.cargo };
    }
    else if (category === 'tool') {
        type = 'tool'; icon = obj.icon || "🔧";
        stats = { sizes: obj.sizes }; // Размеры ключей
    }

    return {
        ...obj,
        type, icon, width, height, color,
        movable: true,
        stats, // Важные данные для физики
        parts: {} // Пустой контейнер для деталей
    };
}

export const OBJECTS_DB = {};

// Generate DB
Object.values(SIMPLE_VEHICLES).forEach(v => OBJECTS_DB[v.id] = enrichObject(v, 'simple'));
Object.values(VEHICLE_BODIES).forEach(v => OBJECTS_DB[v.id] = enrichObject(v, 'vehicle_body'));
Object.values(ENGINES).forEach(e => OBJECTS_DB[e.id] = enrichObject(e, 'engine'));
Object.values(WHEELS).forEach(w => OBJECTS_DB[w.id] = enrichObject(w, 'wheel'));
Object.values(TOOLS_DB).forEach(t => OBJECTS_DB[t.id] = enrichObject(t, 'tool'));

// Statics
OBJECTS_DB["house_village"] = { id: "house_village", name: "Дом", type: "structure", icon: "🏠", width: 4, height: 3, color: "#3e2723", description: "Старый дом.", movable: false };
OBJECTS_DB["bonfire_old"] = { id: "bonfire_old", name: "Кострище", type: "structure", icon: "🔥", width: 1, height: 1, color: "#212121", description: "Зола.", movable: false };
OBJECTS_DB["battery_60ah"] = { id: "battery_60ah", name: "Аккумулятор 6СТ-60", type: "part", icon: "🔋", width: 1, height: 1, color: "#111", movable: true, stats: { charge: 100 } };

// Initial World
export const INITIAL_WORLD_OBJECTS = {
  "0,0": [
    { templateId: "house_village", uniqueId: "home", x: 48, y: 48 },
    { templateId: "bonfire_old", uniqueId: "fire_1", x: 52, y: 52 },

    // Машина
    { templateId: "car_uaz469", uniqueId: "my_uaz", x: 50, y: 50, parts: {} },

    // Детали для сборки
    { templateId: "auto_uaz", uniqueId: "w1", x: 48, y: 49 },
    { templateId: "auto_uaz", uniqueId: "w2", x: 48, y: 51 },
    { templateId: "auto_uaz", uniqueId: "w3", x: 52, y: 49 },
    { templateId: "auto_uaz", uniqueId: "w4", x: 52, y: 51 },
    { templateId: "zmz402", uniqueId: "eng1", x: 50, y: 48 },
    { templateId: "battery_60ah", uniqueId: "bat1", x: 51, y: 48 },

    // Инструменты
    { templateId: "wrench_set_soviet", uniqueId: "tools1", x: 53, y: 50 },
    { templateId: "wrench_17_19", uniqueId: "wr17", x: 53, y: 49 }, // Отдельный ключ
    { templateId: "wrench_wheel", uniqueId: "balon", x: 53, y: 51 }  // Балонник
  ]
};