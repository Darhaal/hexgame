import { TAGS } from "../itemtags";

// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (DAIRY TEMPLATES)
// =============================================================================

// 1. ЖИДКОЕ МОЛОКО (Быстро портится)
const baseMilk = {
  category: "FOOD",
  physicalState: "LIQUID",
  tags: [TAGS.DAIRY, TAGS.LIQUID, TAGS.CALCIUM, TAGS.THIRST_QUENCHING],
  packaging: {
    type: "BOTTLE_PLASTIC",
    isOpen: false,
    returnItem: "bottle_plastic_empty",
    maxServings: 4, // 1 литр = 4 стакана
    currentServings: 4,
    isDivisible: true
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 86400,    // 24 часа открытым (скисает)
    shelfLifeSealed: 604800, // 7 дней (магазинное)
    aging: { isAgeable: true, resultId: "milk_sour" } // Скисает в простоквашу
  },
  thermodynamics: {
    currentTemp: 4, // Из холодильника
    specificHeat: 3.9,
    freezingPoint: -0.5,
    cookingPoint: 100 // Кипячение
  },
  risks: []
};

// 2. ТВЕРДЫЙ СЫР (Долгое хранение)
const baseCheeseHard = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.DAIRY, TAGS.PROTEIN, TAGS.FAT, TAGS.CALCIUM, TAGS.READY_TO_EAT],
  packaging: {
    type: "PLASTIC_WRAP",
    isOpen: false,
    returnItem: "trash_plastic",
    maxServings: 10,
    currentServings: 10,
    isDivisible: true
  },
  lifecycle: {
    shelfLifeOpen: 604800,    // Неделя (заветривается)
    shelfLifeSealed: 5184000  // 2 месяца
  }
};

// 3. МЯГКИЙ СЫР (Быстрая порча)
const baseCheeseSoft = {
  ...baseCheeseHard,
  tags: [...baseCheeseHard.tags, TAGS.SOFT],
  lifecycle: {
    shelfLifeOpen: 259200,   // 3 дня
    shelfLifeSealed: 1209600 // 2 недели
  }
};

// =============================================================================
// СПИСОК ПРЕДМЕТОВ
// Нутрициология (KCAL/PROT/FATS/CARBS) на 100г.
// =============================================================================

export const dairyItems = [

  // --- МОЛОКО (Milk) ---

  {
    ...baseMilk,
    id: "dairy_milk_store",
    internalName: "Prostokvashino",
    name: { ru: "Молоко 'Простоквашино' 2.5%", en: "Milk Prostokvashino" },
    tags: [...baseMilk.tags, TAGS.PASTEURIZED], // Безопасное
    // 900мл бутылка, ~40 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 52, hydration: 90, proteins: 2.8, fats: 2.5, carbs: 4.7 },
    assets: { icon: "icons/food/milk_prostokvashino.png" }
  },

  {
    ...baseMilk,
    id: "dairy_milk_home",
    internalName: "MilkHome",
    name: { ru: "Молоко (Домашнее)", en: "Homemade Milk" },
    tags: [...baseMilk.tags, TAGS.RAW, TAGS.FAT], // Сырое, жирное
    // 1.5л ПЭТ бутылка (с рынка), ~45 грн
    inventory: { maxStack: 5, weight: 1.5, basePrice: 45, rarity: "COMMON" },
    lifecycle: { ...baseMilk.lifecycle, shelfLifeOpen: 43200 }, // Скисает быстрее (12ч)
    // Жирность выше (~4-5%)
    nutrition: { calories: 70, hydration: 85, proteins: 3.2, fats: 4.5, carbs: 4.7 },
    // Риск, если не кипятить
    risks: [{ type: "BACTERIA", chanceBase: 0.1, severity: "MINOR" }],
    assets: { icon: "icons/food/milk_home.png" }
  },

  {
    ...baseMilk,
    id: "dairy_milk_baked",
    internalName: "Toplenoe",
    name: { ru: "Топленое молоко", en: "Baked Milk" },
    tags: [...baseMilk.tags, TAGS.PASTEURIZED, TAGS.SWEET],
    // 900мл, ~45 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 45, rarity: "COMMON" },
    nutrition: { calories: 67, hydration: 85, proteins: 3, fats: 4, carbs: 4.7 },
    flavor: { sweet: 2, salty: 0, umami: 1, texture: "CREAMY" },
    assets: { icon: "icons/food/milk_baked.png" }
  },

  // --- КИСЛОМОЛОЧНЫЕ (Fermented) ---

  {
    ...baseMilk,
    id: "dairy_kefir",
    internalName: "Kefir",
    name: { ru: "Кефир 2.5%", en: "Kefir" },
    tags: [TAGS.DAIRY, TAGS.LIQUID, TAGS.PROBIOTIC, TAGS.SOUR, TAGS.HANGOVER_CURE],
    // 900мл, ~42 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 42, rarity: "COMMON" },
    nutrition: { calories: 50, hydration: 88, proteins: 2.8, fats: 2.5, carbs: 4 },
    assets: { icon: "icons/food/kefir.png" }
  },

  {
    ...baseMilk,
    id: "dairy_ryazhenka",
    internalName: "Ryazhenka",
    name: { ru: "Ряженка", en: "Ryazhenka" },
    tags: [TAGS.DAIRY, TAGS.LIQUID, TAGS.PROBIOTIC, TAGS.SWEET],
    inventory: { maxStack: 5, weight: 0.9, basePrice: 48, rarity: "COMMON" },
    nutrition: { calories: 65, hydration: 85, proteins: 3, fats: 4, carbs: 4.2 },
    assets: { icon: "icons/food/ryazhenka.png" }
  },

  {
    ...baseMilk,
    id: "dairy_yogurt_drink",
    internalName: "YogurtDrink",
    name: { ru: "Йогурт (Питьевой)", en: "Drinking Yogurt" },
    tags: [TAGS.DAIRY, TAGS.LIQUID, TAGS.SWEET, TAGS.SUGAR], // С сахаром
    // 290г бутылочка, ~30 грн
    inventory: { maxStack: 10, weight: 0.29, basePrice: 30, rarity: "COMMON" },
    packaging: { ...baseMilk.packaging, maxServings: 1 },
    nutrition: { calories: 85, hydration: 80, proteins: 2.8, fats: 1.5, carbs: 12 },
    assets: { icon: "icons/food/yogurt_drink.png" }
  },

  {
    id: "dairy_sour_cream",
    internalName: "Smetana",
    name: { ru: "Сметана 20%", en: "Sour Cream" },
    category: "FOOD",
    physicalState: "PASTE",
    tags: [TAGS.DAIRY, TAGS.FAT, TAGS.PASTE, TAGS.PROBIOTIC],
    packaging: { type: "PLASTIC_CUP", returnItem: "trash_plastic", maxServings: 5, isDivisible: true },
    // 350г стакан, ~45 грн
    inventory: { maxStack: 5, weight: 0.35, basePrice: 45, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 259200, shelfLifeSealed: 1209600 },
    nutrition: { calories: 206, hydration: 0, proteins: 2.5, fats: 20, carbs: 3.4 },
    assets: { icon: "icons/food/smetana.png" }
  },

  // --- ТВОРОГ И ДЕСЕРТЫ (Curd) ---

  {
    id: "dairy_curd_store",
    internalName: "Tvorog",
    name: { ru: "Творог 5%", en: "Cottage Cheese" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.DAIRY, TAGS.PROTEIN, TAGS.SOFT, TAGS.READY_TO_EAT],
    packaging: { type: "PAPER_PACK", returnItem: "trash_paper", maxServings: 2 },
    // 350г пачка, ~60 грн
    inventory: { maxStack: 5, weight: 0.35, basePrice: 60, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 172800, shelfLifeSealed: 604800 },
    nutrition: { calories: 121, hydration: 0, proteins: 16, fats: 5, carbs: 3 },
    assets: { icon: "icons/food/tvorog.png" }
  },

  {
    id: "dairy_curd_home",
    internalName: "TvorogHome",
    name: { ru: "Творог (Домашний)", en: "Homemade Curd" },
    tags: [TAGS.DAIRY, TAGS.PROTEIN, TAGS.FAT, TAGS.SOFT], // Жирный
    packaging: { type: "PLASTIC_BAG", returnItem: "trash_plastic" },
    // 1 кг, ~120 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 120, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 172800 },
    nutrition: { calories: 230, hydration: 0, proteins: 16, fats: 18, carbs: 3 },
    assets: { icon: "icons/food/tvorog_home.png" }
  },

  {
    id: "dairy_glaze_bar",
    internalName: "Syrok",
    name: { ru: "Глазированный сырок", en: "Curd Bar" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.DAIRY, TAGS.SWEET, TAGS.SUGAR, TAGS.CHOCOLATE],
    packaging: { type: "FLOW_PACK", maxServings: 1 },
    // 36г, ~15 грн
    inventory: { maxStack: 20, weight: 0.036, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 410, hydration: 0, proteins: 8, fats: 25, carbs: 35 },
    flavor: { sweet: 8, texture: "SOFT" },
    assets: { icon: "icons/food/syrok.png" }
  },

  // --- ЖИРЫ (Fats) ---

  {
    id: "dairy_butter",
    internalName: "Butter",
    name: { ru: "Масло сливочное 82%", en: "Butter" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.DAIRY, TAGS.FAT, TAGS.MELTABLE],
    packaging: { type: "FOIL_WRAP", returnItem: "trash_foil", maxServings: 20 },
    // 200г пачка, ~80 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 80, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 604800, shelfLifeSealed: 2592000 },
    nutrition: { calories: 748, hydration: 0, proteins: 0.5, fats: 82.5, carbs: 0.8 },
    assets: { icon: "icons/food/butter.png" }
  },

  {
    id: "dairy_margarine",
    internalName: "Margarine",
    name: { ru: "Маргарин", en: "Margarine" },
    tags: [TAGS.FAT, TAGS.CHEAP, TAGS.MELTABLE], // Не DAIRY
    // 250г пачка, ~30 грн
    inventory: { maxStack: 10, weight: 0.25, basePrice: 30, rarity: "COMMON" },
    nutrition: { calories: 717, hydration: 0, proteins: 0, fats: 80, carbs: 0 },
    assets: { icon: "icons/food/margarine.png" }
  },

  {
    id: "fat_lard_rendered",
    internalName: "Smalets",
    name: { ru: "Смалец", en: "Lard (Rendered)" },
    category: "FOOD", // Топливо для организма и сковороды
    physicalState: "PASTE", // Мягкий при комнатной
    tags: [TAGS.MEAT, TAGS.FAT, TAGS.FUEL, TAGS.MELTABLE], // MEAT т.к. из свинины
    packaging: { type: "GLASS_JAR", returnItem: "glass_jar_0.5l" },
    // 500г банка, ~60 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 60, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 2592000 }, // Долго не портится
    nutrition: { calories: 900, hydration: 0, proteins: 0, fats: 99.7, carbs: 0 },
    assets: { icon: "icons/food/smalets.png" }
  },

  {
    id: "dairy_cream",
    internalName: "Slivki",
    name: { ru: "Сливки 10%", en: "Cream" },
    category: "FOOD",
    physicalState: "LIQUID",
    tags: [TAGS.DAIRY, TAGS.LIQUID, TAGS.FAT],
    packaging: { type: "TETRA_PACK", returnItem: "trash_carton", maxServings: 2 },
    // 200мл, ~25 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 118, hydration: 80, proteins: 3, fats: 10, carbs: 4 },
    assets: { icon: "icons/food/cream.png" }
  },

  // --- СЫРЫ ТВЕРДЫЕ (Hard Cheeses) ---

  {
    ...baseCheeseHard,
    id: "cheese_russian",
    internalName: "SyrRossiyskiy",
    name: { ru: "Сыр 'Российский'", en: "Russian Cheese" },
    // 200г брусок, ~70 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 70, rarity: "COMMON" },
    nutrition: { calories: 360, proteins: 23, fats: 29, carbs: 0 },
    assets: { icon: "icons/food/cheese_russian.png" }
  },

  {
    ...baseCheeseHard,
    id: "cheese_dutch",
    internalName: "SyrHolland",
    name: { ru: "Сыр 'Голландский'", en: "Dutch Cheese" },
    // 200г брусок, ~75 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 75, rarity: "COMMON" },
    nutrition: { calories: 350, proteins: 26, fats: 26, carbs: 0 },
    assets: { icon: "icons/food/cheese_dutch.png" }
  },

  {
    ...baseCheeseHard,
    id: "cheese_cheddar",
    internalName: "Cheddar",
    name: { ru: "Сыр 'Чеддер'", en: "Cheddar" },
    tags: [...baseCheeseHard.tags, TAGS.MELTABLE], // Хорошо плавится
    // 200г, ~90 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 90, rarity: "UNCOMMON" },
    nutrition: { calories: 400, proteins: 25, fats: 33, carbs: 1 },
    assets: { icon: "icons/food/cheddar.png" }
  },

  {
    ...baseCheeseHard,
    id: "cheese_parmesan",
    internalName: "Parmesan",
    name: { ru: "Сыр 'Пармезан'", en: "Parmesan" },
    tags: [...baseCheeseHard.tags, TAGS.DRY, TAGS.LONG_LIFE], // Очень долго хранится
    // 200г, ~150 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 150, rarity: "RARE" },
    lifecycle: { shelfLifeOpen: 2592000, shelfLifeSealed: 15768000 },
    nutrition: { calories: 431, proteins: 38, fats: 29, carbs: 4 },
    assets: { icon: "icons/food/parmesan.png" }
  },

  // --- СЫРЫ МЯГКИЕ И РАССОЛЬНЫЕ (Soft Cheeses) ---

  {
    ...baseCheeseSoft,
    id: "cheese_mozzarella",
    internalName: "Mozzarella",
    name: { ru: "Сыр 'Моцарелла'", en: "Mozzarella" },
    tags: [...baseCheeseSoft.tags, TAGS.MELTABLE, TAGS.LIQUID_CONTAINER], // В рассоле
    // 125г шарик в рассоле, ~45 грн
    inventory: { maxStack: 5, weight: 0.125, basePrice: 45, rarity: "COMMON" },
    nutrition: { calories: 280, proteins: 18, fats: 22, carbs: 2 },
    assets: { icon: "icons/food/mozzarella.png" }
  },

  {
    ...baseCheeseSoft,
    id: "cheese_brie",
    internalName: "Brie",
    name: { ru: "Сыр 'Бри'", en: "Brie" },
    tags: [...baseCheeseSoft.tags, TAGS.DELICACY, TAGS.MOLDY], // Плесень (благородная)
    // 125г круг, ~80 грн
    inventory: { maxStack: 5, weight: 0.125, basePrice: 80, rarity: "UNCOMMON" },
    nutrition: { calories: 334, proteins: 21, fats: 28, carbs: 0.5 },
    assets: { icon: "icons/food/brie.png" }
  },

  {
    ...baseCheeseSoft,
    id: "cheese_feta",
    internalName: "Feta",
    name: { ru: "Сыр 'Фета' / Брынза", en: "Feta Cheese" },
    tags: [...baseCheeseSoft.tags, TAGS.SALTY, TAGS.WHITE],
    // 200г пачка, ~60 грн
    inventory: { maxStack: 5, weight: 0.2, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 260, proteins: 14, fats: 21, carbs: 4 },
    assets: { icon: "icons/food/feta.png" }
  },

  {
    ...baseCheeseSoft,
    id: "cheese_suluguni",
    name: { ru: "Сыр 'Сулугуни'", en: "Suluguni" },
    tags: [...baseCheeseSoft.tags, TAGS.SALTY, TAGS.ELASTIC],
    // 300г головка, ~100 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 100, rarity: "COMMON" },
    nutrition: { calories: 290, proteins: 20, fats: 24, carbs: 0 },
    assets: { icon: "icons/food/suluguni.png" }
  },

  // --- ПЛАВЛЕНЫЕ И КОПЧЕНЫЕ (Processed & Smoked) ---

  {
    id: "cheese_processed_druzhba",
    internalName: "Druzhba",
    name: { ru: "Плавленый сырок 'Дружба'", en: "Processed Cheese" },
    category: "FOOD",
    physicalState: "SOLID", // Мягкий
    tags: [TAGS.DAIRY, TAGS.SOFT, TAGS.READY_TO_EAT, TAGS.CHEAP, TAGS.LONG_LIFE],
    packaging: { type: "FOIL_WRAP", returnItem: "trash_foil", maxServings: 1 },
    // 70г брусок, ~18 грн
    inventory: { maxStack: 20, weight: 0.07, basePrice: 18, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 86400, shelfLifeSealed: 7776000 }, // Полгода
    nutrition: { calories: 280, proteins: 10, fats: 25, carbs: 5 },
    assets: { icon: "icons/food/druzhba.png" }
  },

  {
    id: "cheese_processed_yantar",
    internalName: "Yantar",
    name: { ru: "Плавленый сыр (Янтарь)", en: "Cream Cheese Yantar" },
    physicalState: "PASTE", // Мажется
    tags: [TAGS.DAIRY, TAGS.PASTE, TAGS.READY_TO_EAT, TAGS.SPREAD],
    packaging: { type: "PLASTIC_CUP", returnItem: "trash_plastic", maxServings: 3 },
    // 200г коробочка, ~40 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 250, proteins: 8, fats: 20, carbs: 6 },
    assets: { icon: "icons/food/yantar.png" }
  },

  {
    id: "cheese_smoked_braid",
    internalName: "Kosichka",
    name: { ru: "Сыр 'Косичка' (Копченый)", en: "Smoked Cheese Braid" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.DAIRY, TAGS.SMOKED, TAGS.SALTY, TAGS.CHEWY, TAGS.LONG_LIFE, TAGS.SNACK],
    // 120г, ~50 грн
    inventory: { maxStack: 10, weight: 0.12, basePrice: 50, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 604800, shelfLifeSealed: 5184000 },
    nutrition: { calories: 310, proteins: 23, fats: 22, carbs: 0 },
    flavor: { salty: 8, umami: 6, texture: "RUBBERY" }, // К пиву
    assets: { icon: "icons/food/kosichka.png" }
  },

  {
    id: "cheese_sausage",
    internalName: "Kolbasny",
    name: { ru: "Колбасный сыр", en: "Sausage Cheese" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.DAIRY, TAGS.SMOKED, TAGS.CHEAP, TAGS.SOFT],
    // 400г палка, ~60 грн
    inventory: { maxStack: 5, weight: 0.4, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 270, proteins: 18, fats: 19, carbs: 5 },
    assets: { icon: "icons/food/cheese_sausage.png" }
  }

];