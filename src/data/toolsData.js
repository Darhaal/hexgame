export const TOOLS_DB = {
    // --- КЛЮЧИ ---
    "wrench_8_10": { id: "wrench_8_10", name: "Ключ 8х10", type: "tool", icon: "🔧", sizes: [8, 10] },
    "wrench_12_14": { id: "wrench_12_14", name: "Ключ 12х14", type: "tool", icon: "🔧", sizes: [12, 14] },
    "wrench_13": { id: "wrench_13", name: "Ключ 13 (Комби)", type: "tool", icon: "🔧", sizes: [13] },
    "wrench_17_19": { id: "wrench_17_19", name: "Ключ 17х19", type: "tool", icon: "🔧", sizes: [17, 19] },
    "wrench_wheel": { id: "wrench_wheel", name: "Балонный ключ", type: "tool", icon: "💪", sizes: [19, 21, 22] }, // Универсальный для колес
    "wrench_set_soviet": { id: "wrench_set_soviet", name: "Набор ключей", type: "tool_kit", icon: "🛠️", sizes: [8,10,12,13,14,17,19,22,24] },

    // --- ПРОЧЕЕ ---
    "jack_mechanical": { id: "jack_mechanical", name: "Домкрат", type: "tool", icon: "🏗️" },
    "screwdriver": { id: "screwdriver", name: "Отвертка", type: "tool", icon: "🪛", sizes: ["flat", "cross"] },

    // --- КРЕПЕЖ (В виде предметов) ---
    "bolt_10mm": { id: "bolt_10mm", name: "Болт М10", type: "part", icon: "🔩" },
    "nut_wheel": { id: "nut_wheel", name: "Гайка колесная", type: "part", icon: "🌰" },
};

// ТРЕБОВАНИЯ ДЛЯ УЗЛОВ
export const PART_REQUIREMENTS = {
    engine: {
        bolts: 4, // 4 болта крепления подушек
        boltType: "bolt_10mm",
        toolSize: 17 // Нужен ключ на 17
    },
    wheel: {
        bolts: 5, // 5 гаек
        boltType: "nut_wheel",
        toolSize: 19 // Нужен ключ на 19 или балонник
    },
    battery: {
        bolts: 2, // Клеммы
        boltType: "bolt_10mm",
        toolSize: 10 // Ключ на 10
    }
};