import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (BAKERY TEMPLATES)
// =============================================================================

const baseBread = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.READY_TO_EAT, TAGS.AMBIENT, TAGS.NO_UTENSILS],

  packaging: {
    type: "PLASTIC_BAG",
    isOpen: false,
    requiresTool: null,
    returnItem: "trash_plastic",
    maxServings: 10, // Стандартная нарезка ~10-12 кусков
    currentServings: 10,
    isDivisible: true
  },

  lifecycle: {
    creationDate: 0,
    sealedDate: 0,
    openedDate: null,
    shelfLifeOpen: 259200,    // 3 дня (черствеет/плесневеет)
    shelfLifeSealed: 604800,  // 7 дней в заводской упаковке
    aging: { isAgeable: false }
  },

  thermodynamics: {
    currentTemp: 20,
    specificHeat: 1.4, // Хлеб пористый
    freezingPoint: -5,
    meltingPoint: 0,
    cookingPoint: 0,    // Уже готов
    burningPoint: 180,  // Горит в тостере/костре
    carbonizationPoint: 250
  },

  risks: [
    { type: "MOLD_POISONING", chanceBase: 0.0, chancePerDayExpired: 0.5, severity: "MINOR" }
  ]
};

const baseDryBakery = {
  ...baseBread,
  tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.DRIED, TAGS.CRISPY, TAGS.THIRSTY, TAGS.LONG_LIFE],
  lifecycle: {
    creationDate: 0,
    sealedDate: 0,
    shelfLifeOpen: 2592000,   // 30 дней открытыми (впитывают влагу)
    shelfLifeSealed: 31536000 // 1 год закрытыми
  },
  packaging: {
    type: "PAPER_PACK",
    isOpen: false,
    requiresTool: null,
    returnItem: "trash_paper",
    maxServings: 20,
    currentServings: 20,
    isDivisible: true
  }
};

const basePastryMeat = {
  ...baseBread,
  tags: [TAGS.GRAIN, TAGS.MEAT, TAGS.FRIED, TAGS.FAT, TAGS.PERISHABLE],
  packaging: {
    type: "PAPER_WRAP",
    isOpen: true, // Обычно продаются в салфетке или кульке
    returnItem: "trash_paper",
    maxServings: 1,
    currentServings: 1,
    isDivisible: false
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 86400, // 24 часа (мясо в тесте опасно при комнатной температуре)
    shelfLifeSealed: 0
  },
  risks: [
    { type: "FOOD_POISONING", chanceBase: 0.05, chancePerDayExpired: 1.0, severity: "MAJOR" },
    { type: "HEARTBURN", chanceBase: 0.3, severity: "MINOR" } // Жирное жареное тесто
  ]
};

// =============================================================================
// СПИСОК: ХЛЕБ, СНЕКИ, ВЫПЕЧКА
// Нутрициология (KCAL/PROT/FATS/CARBS) на 100г.
// =============================================================================

export const bakeryItems = [

  // --- ХЛЕБ БЕЛЫЙ ---

  {
    ...baseBread,
    id: "bread_white_sliced",
    internalName: "BatonNareznoy",
    name: { ru: "Батон Нарезной", en: "Sliced Loaf" },
    tags: [...baseBread.tags, TAGS.SLICED, TAGS.SOFT],
    // 500г, ~28 грн
    inventory: { maxStack: 1, weight: 0.5, basePrice: 28, rarity: "COMMON" },
    nutrition: {
      calories: 264, hydration: -5, proteins: 7.5, fats: 2.9, carbs: 52,
      digestibility: 0.95, volume: 0.5, gutStress: 0.0
    },
    flavor: { sweet: 2, salty: 1, sour: 0, bitter: 0, umami: 1, spicy: 0, texture: "SOFT" },
    assets: { icon: "icons/food/bread_sliced.png", model: "models/food/bread_white.glb" }
  },

  {
    ...baseBread,
    id: "bread_white_niva",
    internalName: "BatonNiva",
    name: { ru: "Батон Нива", en: "Wheat Loaf 'Niva'" },
    // Часто продается без нарезки
    tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.READY_TO_EAT, TAGS.WHOLE],
    // 450г, ~24 грн
    inventory: { maxStack: 1, weight: 0.45, basePrice: 24, rarity: "COMMON" },
    nutrition: {
      calories: 250, hydration: -5, proteins: 7.2, fats: 2.5, carbs: 49,
      digestibility: 0.9, volume: 0.45, gutStress: 0.0
    },
    flavor: { sweet: 1, salty: 1, sour: 0, bitter: 0, umami: 1, spicy: 0, texture: "CRUMBLY" },
    assets: { icon: "icons/food/bread_niva.png" }
  },

  {
    ...baseBread,
    id: "bread_lavash",
    internalName: "Lavash",
    name: { ru: "Лаваш армянский", en: "Lavash" },
    tags: [...baseBread.tags, TAGS.FLAT, TAGS.THIN],
    // Сохнет моментально без пакета
    lifecycle: { ...baseBread.lifecycle, shelfLifeOpen: 43200 }, // 12 часов до состояния "сухарь"
    // 200г (упаковка 2-3 листа), ~20 грн
    inventory: { maxStack: 5, weight: 0.2, basePrice: 20, rarity: "COMMON" },
    nutrition: {
      calories: 236, hydration: -10, proteins: 7.9, fats: 1.0, carbs: 48,
      digestibility: 0.95, volume: 0.1, gutStress: 0.0
    },
    flavor: { sweet: 0, salty: 1, sour: 0, bitter: 0, umami: 0, spicy: 0, texture: "CHEWY" },
    assets: { icon: "icons/food/lavash.png" }
  },

  {
    ...baseBread,
    id: "bread_ciabatta",
    internalName: "Ciabatta",
    name: { ru: "Чиабатта", en: "Ciabatta" },
    tags: [...baseBread.tags, TAGS.POROUS, TAGS.CRISPY], // Хрустящая корка
    // 300г, ~35 грн (Премиум)
    inventory: { maxStack: 1, weight: 0.3, basePrice: 35, rarity: "UNCOMMON" },
    nutrition: {
      calories: 255, hydration: -5, proteins: 7.6, fats: 3.5, carbs: 47,
      digestibility: 0.9, volume: 0.3, gutStress: 0.0
    },
    flavor: { sweet: 1, salty: 1, sour: 0, bitter: 0, umami: 1, spicy: 0, texture: "CRUNCHY" },
    assets: { icon: "icons/food/ciabatta.png" }
  },

  {
    ...baseBread,
    id: "bread_pampushky",
    internalName: "Pampushky",
    name: { ru: "Пампушки с чесноком", en: "Garlic Buns" },
    tags: [...baseBread.tags, TAGS.GARLIC, TAGS.STRONG_SMELL, TAGS.SOFT],
    // 300г, ~30 грн
    inventory: { maxStack: 1, weight: 0.3, basePrice: 30, rarity: "COMMON" },
    // Жирнее из-за чесночного масла
    nutrition: {
      calories: 290, hydration: -5, proteins: 7.0, fats: 6.0, carbs: 51,
      digestibility: 0.9, volume: 0.3, gutStress: 0.1
    },
    flavor: { sweet: 2, salty: 2, sour: 0, bitter: 0, umami: 3, spicy: 1, texture: "SOFT" },
    assets: { icon: "icons/food/pampushky.png" }
  },

  // --- ХЛЕБ ЧЕРНЫЙ (Rye) ---

  {
    ...baseBread,
    id: "bread_rye_ukrainian",
    internalName: "UkrBread",
    name: { ru: "Хлеб Украинский", en: "Ukrainian Bread" },
    tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.READY_TO_EAT, TAGS.WHOLE, TAGS.SOUR],
    // Круглая паляница 900г-1кг, ~36 грн
    inventory: { maxStack: 1, weight: 0.95, basePrice: 36, rarity: "COMMON" },
    nutrition: {
      calories: 210, hydration: -2, proteins: 6.5, fats: 1.2, carbs: 40,
      digestibility: 0.85, volume: 0.95, gutStress: 0.1 // Ржаной тяжелее для желудка
    },
    flavor: { sweet: 1, salty: 1, sour: 3, bitter: 0, umami: 2, spicy: 0, texture: "DENSE" },
    assets: { icon: "icons/food/bread_ukr.png" }
  },

  {
    ...baseBread,
    id: "bread_borodinsky",
    internalName: "Borodinsky",
    name: { ru: "Хлеб Бородинский", en: "Borodinsky Bread" },
    tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.SLICED, TAGS.SPICE, TAGS.SWEET], // Кориандр
    // Кирпичик 400г, ~28 грн
    inventory: { maxStack: 1, weight: 0.4, basePrice: 28, rarity: "COMMON" },
    nutrition: {
      calories: 205, hydration: -2, proteins: 6.8, fats: 1.3, carbs: 41,
      digestibility: 0.85, volume: 0.4, gutStress: 0.0
    },
    flavor: { sweet: 3, salty: 1, sour: 2, bitter: 1, umami: 3, spicy: 1, texture: "DENSE" },
    assets: { icon: "icons/food/bread_borodinsky.png" }
  },

  {
    ...baseBread,
    id: "bread_brick_grey",
    internalName: "Kirpichik",
    name: { ru: "Хлеб Кирпичик", en: "Wheat-Rye Brick" },
    tags: [TAGS.GRAIN, TAGS.BAKED, TAGS.WHOLE, TAGS.CHEAP],
    // 550г, ~22 грн
    inventory: { maxStack: 1, weight: 0.55, basePrice: 22, rarity: "COMMON" },
    nutrition: {
      calories: 220, hydration: -3, proteins: 7.0, fats: 1.1, carbs: 44,
      digestibility: 0.9, volume: 0.55, gutStress: 0.0
    },
    flavor: { sweet: 1, salty: 1, sour: 1, bitter: 0, umami: 1, spicy: 0, texture: "CRUMBLY" },
    assets: { icon: "icons/food/bread_brick.png" }
  },

  // --- СНЕКИ (Snacks) ---

  {
    ...baseDryBakery,
    id: "snack_croutons",
    internalName: "Sukhari",
    name: { ru: "Сухари", en: "Rusks" },
    tags: [...baseDryBakery.tags, TAGS.NO_SPOIL],
    // 250г пачка, ~18 грн
    inventory: { maxStack: 10, weight: 0.25, basePrice: 18, rarity: "COMMON" },
    // Калории концентрированные (нет воды)
    nutrition: {
      calories: 331, hydration: -30, proteins: 11, fats: 1.5, carbs: 70,
      digestibility: 0.95, volume: 0.25, gutStress: 0.0
    },
    flavor: { sweet: 1, salty: 1, sour: 0, bitter: 0, umami: 2, spicy: 0, texture: "HARD" },
    assets: { icon: "icons/food/sukhari.png" }
  },

  {
    ...baseDryBakery,
    id: "snack_galettes",
    internalName: "ArmyGalettes",
    name: { ru: "Галеты армейские", en: "Army Biscuits" },
    tags: [...baseDryBakery.tags, TAGS.SURVIVAL, TAGS.STERILIZED],
    // Живут вечно. 300г, ~40 грн
    lifecycle: { ...baseDryBakery.lifecycle, shelfLifeSealed: 157680000 }, // 5 лет
    inventory: { maxStack: 10, weight: 0.3, basePrice: 40, rarity: "UNCOMMON" },
    nutrition: {
      calories: 390, hydration: -40, proteins: 10, fats: 9, carbs: 65,
      digestibility: 0.8, volume: 0.3, gutStress: 0.1 // Очень сухие
    },
    flavor: { sweet: 0, salty: 1, sour: 0, bitter: 0, umami: 0, spicy: 0, texture: "ROCK_HARD" },
    assets: { icon: "icons/food/galettes.png" }
  },

  // --- ВЫПЕЧКА (Pastry) ---

  {
    ...basePastryMeat,
    id: "pastry_belyash",
    internalName: "Belyash",
    name: { ru: "Беляш", en: "Fried Meat Pie" },
    tags: [TAGS.GRAIN, TAGS.MEAT, TAGS.FRIED, TAGS.FAT, TAGS.READY_TO_EAT],
    // 150г, ~25 грн
    inventory: { maxStack: 5, weight: 0.15, basePrice: 25, rarity: "COMMON" },
    // Очень жирный
    nutrition: {
      calories: 360, hydration: -5, proteins: 11, fats: 22, carbs: 28,
      digestibility: 0.7, volume: 0.15, gutStress: 0.3
    },
    flavor: { sweet: 0, salty: 3, sour: 0, bitter: 0, umami: 8, spicy: 1, texture: "GREASY" },
    assets: { icon: "icons/food/belyash.png" }
  }

];