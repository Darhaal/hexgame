import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (CANNED TEMPLATES)
// =============================================================================

// 1. ЖЕСТЯНАЯ БАНКА (Металл)
// По умолчанию возвращает стандартную пустую банку (мусор/крафт).
const baseTinCan = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.COOKED, TAGS.STERILIZED, TAGS.CANNED, TAGS.READY_TO_EAT, TAGS.LONG_LIFE],

  packaging: {
    type: "TIN_CAN",
    isOpen: false,
    requiresTool: "CAN_OPENER", // Нужен нож
    returnItem: "tin_can_standard", // Стандартная банка (из-под тушенки/горошка)
    maxServings: 1,
    currentServings: 1,
    isDivisible: false
  },

  lifecycle: {
    creationDate: 1704067200, // 01.01.2024
    sealedDate: 1704070800,
    openedDate: null,
    shelfLifeOpen: 172800,      // 48 часов после вскрытия
    shelfLifeSealed: 94608000,  // 3 года
    aging: { isAgeable: false }
  },

  thermodynamics: {
    currentTemp: 20,
    specificHeat: 0.9,
    freezingPoint: -5,
    meltingPoint: 0,
    cookingPoint: 0,
    burningPoint: 999,
    carbonizationPoint: 999
  },

  risks: [
    { type: "CUT_LIP", condition: "OPENED_WITH_KNIFE", chance: 0.15, severity: "MINOR" },
    { type: "BOTULISM", chanceBase: 0.0, chancePerDayExpired: 0.2, severity: "LETHAL" }
  ]
};

// 2. СТЕКЛЯННАЯ БАНКА (Стекло)
// По умолчанию возвращает банку 0.5л (самая частая).
const baseGlassJar = {
  ...baseTinCan,
  tags: [TAGS.COOKED, TAGS.STERILIZED, TAGS.CANNED, TAGS.READY_TO_EAT, TAGS.FRAGILE, TAGS.LIQUID_CONTAINER],
  packaging: {
    type: "GLASS_JAR",
    isOpen: false,
    requiresTool: null, // Винтовая крышка
    returnItem: "glass_jar_0.5l", // Полезная банка 0.5 литра
    maxServings: 5,
    currentServings: 5,
    isDivisible: true
  },
  lifecycle: {
    ...baseTinCan.lifecycle,
    shelfLifeSealed: 63072000 // 2 года (свет влияет)
  }
};

// =============================================================================
// СПИСОК КОНСЕРВОВ
// Нутрициология на 100г.
// =============================================================================

export const cannedItems = [

  // --- РЫБНЫЕ КОНСЕРВЫ ---

  {
    ...baseTinCan,
    id: "can_sprats",
    internalName: "Sprats",
    name: { ru: "Шпроты в масле", en: "Sprats in Oil" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.SMOKED, TAGS.FAT],
    // Переопределяем упаковку: Шпроты в плоской банке -> другой мусор
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_small" },
    inventory: { maxStack: 10, weight: 0.16, basePrice: 75, rarity: "COMMON" },
    nutrition: {
      calories: 563, hydration: 5, proteins: 17, fats: 55, carbs: 0,
      digestibility: 0.85, volume: 0.16, gutStress: 0.2
    },
    flavor: { sweet: 1, salty: 4, sour: 0, bitter: 1, umami: 9, spicy: 0, texture: "SOFT" },
    assets: { icon: "icons/food/can_sprats.png", model: "models/food/can_oval.glb" }
  },

  {
    ...baseTinCan,
    id: "can_kilka_tomato",
    internalName: "Kilka",
    name: { ru: "Килька в томате", en: "Kilka in Tomato" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.ACID, TAGS.CHEAP],
    // Стандартная плоская банка
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_standard" },
    inventory: { maxStack: 10, weight: 0.24, basePrice: 35, rarity: "COMMON" },
    nutrition: {
      calories: 182, hydration: 40, proteins: 14, fats: 10, carbs: 9,
      digestibility: 0.9, volume: 0.24, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_kilka.png" }
  },

  {
    ...baseTinCan,
    id: "can_goby_tomato",
    internalName: "GobyCanned",
    name: { ru: "Бычки в томате", en: "Goby in Tomato" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.ACID],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_standard" },
    inventory: { maxStack: 10, weight: 0.24, basePrice: 45, rarity: "COMMON" },
    nutrition: {
      calories: 140, hydration: 45, proteins: 18, fats: 6, carbs: 4,
      digestibility: 0.9, volume: 0.24, gutStress: 0.0
    },
    assets: { icon: "icons/food/can_goby.png" }
  },

  {
    ...baseTinCan,
    id: "can_sardines",
    internalName: "Sardines",
    name: { ru: "Сардины в масле", en: "Sardines" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.FAT],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_standard" },
    inventory: { maxStack: 10, weight: 0.24, basePrice: 60, rarity: "COMMON" },
    nutrition: {
      calories: 220, hydration: 10, proteins: 24, fats: 14, carbs: 0,
      digestibility: 0.9, volume: 0.24, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_sardines.png" }
  },

  {
    ...baseTinCan,
    id: "can_cod_liver",
    internalName: "CodLiver",
    name: { ru: "Печень трески", en: "Cod Liver" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.FAT, TAGS.PASTE],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_small_round" }, // Маленькая шайба
    inventory: { maxStack: 10, weight: 0.12, basePrice: 150, rarity: "RARE" },
    nutrition: {
      calories: 613, hydration: 0, proteins: 4, fats: 66, carbs: 1,
      digestibility: 0.8, volume: 0.12, gutStress: 0.4
    },
    assets: { icon: "icons/food/can_liver.png" }
  },

  {
    ...baseTinCan,
    id: "can_tuna",
    internalName: "Tuna",
    name: { ru: "Тунец", en: "Tuna" },
    tags: [...baseTinCan.tags, TAGS.FISH, TAGS.FILLET, TAGS.DIET],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_small" },
    inventory: { maxStack: 10, weight: 0.185, basePrice: 85, rarity: "COMMON" },
    nutrition: {
      calories: 101, hydration: 60, proteins: 23, fats: 1, carbs: 0,
      digestibility: 1.0, volume: 0.185, gutStress: 0.0
    },
    assets: { icon: "icons/food/can_tuna.png" }
  },

  // --- МЯСНЫЕ КОНСЕРВЫ (Meat) ---

  {
    ...baseTinCan,
    id: "can_stew_beef",
    internalName: "TushenkaBeef",
    name: { ru: "Тушенка (Говяжья)", en: "Beef Stew" },
    tags: [...baseTinCan.tags, TAGS.MEAT, TAGS.FAT, TAGS.PROTEIN],
    // ДСТУ банка (высокая) -> tin_can_tall
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_tall" },
    inventory: { maxStack: 5, weight: 0.525, basePrice: 140, rarity: "UNCOMMON" },
    nutrition: {
      calories: 220, hydration: 40, proteins: 16, fats: 17, carbs: 0,
      digestibility: 0.85, volume: 0.525, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_beef.png", model: "models/food/can_tall.glb" }
  },

  {
    ...baseTinCan,
    id: "can_stew_pork",
    internalName: "TushenkaPork",
    name: { ru: "Тушенка (Свиная)", en: "Pork Stew" },
    tags: [...baseTinCan.tags, TAGS.MEAT, TAGS.FAT],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_tall" },
    inventory: { maxStack: 5, weight: 0.525, basePrice: 110, rarity: "COMMON" },
    nutrition: {
      calories: 349, hydration: 30, proteins: 13, fats: 33, carbs: 0,
      digestibility: 0.8, volume: 0.525, gutStress: 0.2
    },
    assets: { icon: "icons/food/can_pork.png" }
  },

  {
    ...baseTinCan,
    id: "can_stew_chicken",
    internalName: "TushenkaChicken",
    name: { ru: "Тушенка (Куриная)", en: "Chicken Stew" },
    tags: [...baseTinCan.tags, TAGS.MEAT, TAGS.BONE],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_tall" },
    inventory: { maxStack: 5, weight: 0.525, basePrice: 90, rarity: "COMMON" },
    nutrition: {
      calories: 170, hydration: 50, proteins: 15, fats: 11, carbs: 0,
      digestibility: 0.9, volume: 0.525, gutStress: 0.0
    },
    assets: { icon: "icons/food/can_chicken.png" }
  },

  {
    ...baseTinCan,
    id: "can_pate_liver",
    internalName: "PateLiver",
    name: { ru: "Паштет печеночный", en: "Liver Pate" },
    physicalState: "PASTE",
    tags: [...baseTinCan.tags, TAGS.MEAT, TAGS.PASTE, TAGS.SPREAD],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_flat_standard" },
    inventory: { maxStack: 10, weight: 0.24, basePrice: 55, rarity: "COMMON" },
    nutrition: {
      calories: 280, hydration: 10, proteins: 10, fats: 25, carbs: 4,
      digestibility: 0.9, volume: 0.24, gutStress: 0.0
    },
    assets: { icon: "icons/food/can_pate.png" }
  },

  {
    ...baseTinCan,
    id: "can_tourist_breakfast",
    internalName: "TouristBreakfast",
    name: { ru: "Завтрак туриста", en: "Tourist's Breakfast" },
    tags: [...baseTinCan.tags, TAGS.MEAT, TAGS.GRAIN],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.325, basePrice: 65, rarity: "COMMON" },
    nutrition: {
      calories: 190, hydration: 40, proteins: 8, fats: 12, carbs: 15,
      digestibility: 0.85, volume: 0.325, gutStress: 0.0
    },
    assets: { icon: "icons/food/can_tourist.png" }
  },

  // --- ОВОЩНЫЕ КОНСЕРВЫ ---

  {
    ...baseTinCan,
    id: "can_peas",
    internalName: "Peas",
    name: { ru: "Горошек консервированный", en: "Green Peas" },
    tags: [...baseTinCan.tags, TAGS.VEG, TAGS.LIQUID_CONTAINER],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.42, basePrice: 40, rarity: "COMMON" },
    nutrition: {
      calories: 40, hydration: 80, proteins: 3, fats: 0, carbs: 6.5,
      digestibility: 0.9, volume: 0.42, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_peas.png" }
  },

  {
    ...baseTinCan,
    id: "can_corn",
    internalName: "Corn",
    name: { ru: "Кукуруза консервированная", en: "Sweet Corn" },
    tags: [...baseTinCan.tags, TAGS.VEG, TAGS.SWEET],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.34, basePrice: 42, rarity: "COMMON" },
    nutrition: {
      calories: 58, hydration: 75, proteins: 2, fats: 0, carbs: 11,
      digestibility: 0.85, volume: 0.34, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_corn.png" }
  },

  {
    ...baseTinCan,
    id: "can_beans_tomato",
    internalName: "BeansTomato",
    name: { ru: "Фасоль в томате", en: "Beans in Tomato" },
    tags: [...baseTinCan.tags, TAGS.VEG, TAGS.ACID, TAGS.GRAIN],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.42, basePrice: 45, rarity: "COMMON" },
    nutrition: {
      calories: 95, hydration: 60, proteins: 6, fats: 0.5, carbs: 16,
      digestibility: 0.8, volume: 0.42, gutStress: 0.2
    },
    assets: { icon: "icons/food/can_beans.png" }
  },

  // --- СТЕКЛЯННЫЕ БАНКИ (Дропают полезную тару) ---

  {
    ...baseGlassJar,
    id: "jar_squash_caviar",
    internalName: "SquashCaviar",
    name: { ru: "Икра кабачковая", en: "Squash Caviar" },
    physicalState: "PASTE",
    tags: [...baseGlassJar.tags, TAGS.VEG, TAGS.PASTE],
    // Возвращает: Банка 0.5 литра (твист)
    packaging: { ...baseGlassJar.packaging, returnItem: "glass_jar_0.5l" },
    inventory: { maxStack: 5, weight: 0.48, basePrice: 55, rarity: "COMMON" },
    nutrition: {
      calories: 97, hydration: 50, proteins: 1, fats: 7, carbs: 7,
      digestibility: 0.95, volume: 0.48, gutStress: 0.0
    },
    assets: { icon: "icons/food/jar_caviar.png", model: "models/food/jar_medium.glb" }
  },

  {
    ...baseGlassJar,
    id: "jar_pickles",
    internalName: "Pickles",
    name: { ru: "Огурцы маринованные", en: "Pickled Cucumbers" },
    tags: [...baseGlassJar.tags, TAGS.VEG, TAGS.ACID, TAGS.SALTY, TAGS.CRISPY, TAGS.HANGOVER_CURE],
    // Возвращает: Банка 0.72 литра (твист)
    packaging: { ...baseGlassJar.packaging, returnItem: "glass_jar_0.72l" },
    inventory: { maxStack: 5, weight: 0.72, basePrice: 70, rarity: "COMMON" },
    nutrition: {
      calories: 16, hydration: 90, proteins: 0, fats: 0, carbs: 3,
      digestibility: 0.9, volume: 0.72, gutStress: 0.1
    },
    assets: { icon: "icons/food/jar_pickles.png" }
  },

  // --- МОЛОЧНЫЕ КОНСЕРВЫ ---

  {
    ...baseTinCan,
    id: "can_condensed_milk",
    internalName: "CondensedMilk",
    name: { ru: "Сгущенка (Цельная)", en: "Condensed Milk" },
    physicalState: "LIQUID",
    tags: [...baseTinCan.tags, TAGS.DAIRY, TAGS.SUGAR, TAGS.LIQUID],
    // Высокая банка, но уже
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.37, basePrice: 50, rarity: "COMMON" },
    nutrition: {
      calories: 320, hydration: 10, proteins: 7, fats: 8.5, carbs: 56,
      digestibility: 0.9, volume: 0.37, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_milk.png" }
  },

  {
    ...baseTinCan,
    id: "can_condensed_milk_boiled",
    internalName: "CondensedMilkBoiled",
    name: { ru: "Сгущенка (Вареная)", en: "Boiled Condensed Milk" },
    physicalState: "PASTE",
    tags: [...baseTinCan.tags, TAGS.DAIRY, TAGS.SUGAR, TAGS.CARAMEL, TAGS.PASTE],
    packaging: { ...baseTinCan.packaging, returnItem: "tin_can_standard" },
    inventory: { maxStack: 10, weight: 0.37, basePrice: 55, rarity: "COMMON" },
    nutrition: {
      calories: 315, hydration: 5, proteins: 7, fats: 8.5, carbs: 55,
      digestibility: 0.9, volume: 0.37, gutStress: 0.1
    },
    assets: { icon: "icons/food/can_milk_boiled.png" }
  }

];