import { TAGS } from "../itemtags";

// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (CONDIMENTS TEMPLATES)
// =============================================================================

// 1. ЖИДКИЕ СОУСЫ (В дой-паках или бутылках)
const baseSauce = {
  category: "FOOD",
  physicalState: "PASTE", // Майонез, кетчуп - пастообразные
  tags: [TAGS.LIQUID, TAGS.READY_TO_EAT, TAGS.FLAVORING],
  packaging: {
    type: "DOYPACK", // Мягкая упаковка с крышечкой
    isOpen: false,
    returnItem: "trash_plastic",
    maxServings: 20, // Хватает надолго
    currentServings: 20,
    isDivisible: true
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 2592000,   // 30 дней в холодильнике
    shelfLifeSealed: 15768000 // 6 месяцев
  },
  thermodynamics: {
    currentTemp: 20,
    freezingPoint: -5,
    cookingPoint: 0,
    burningPoint: 100
  },
  risks: []
};

// 2. СЫПУЧИЕ (Мука, Сахар, Соль)
const basePowder = {
  category: "FOOD",
  physicalState: "POWDER",
  tags: [TAGS.POWDER, TAGS.GRANULAR, TAGS.LONG_LIFE, TAGS.DRY],
  packaging: {
    type: "PAPER_PACK", // Бумажная пачка
    isOpen: false,
    returnItem: "trash_paper",
    maxServings: 50,
    currentServings: 50,
    isDivisible: true
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 31536000,  // Год (боится влаги)
    shelfLifeSealed: 63072000 // 2 года
  },
  risks: []
};

// 3. СПЕЦИИ (Маленькие пакетики, вес почти 0)
const baseSpice = {
  category: "FOOD", // Или INGREDIENT
  physicalState: "POWDER",
  tags: [TAGS.SPICE, TAGS.DRY, TAGS.FLAVORING, TAGS.NO_CALORIES],
  packaging: {
    type: "SACHET", // Пакетик
    isOpen: false,
    returnItem: "trash_plastic_small",
    maxServings: 10,
    currentServings: 10,
    isDivisible: true
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeSealed: 94608000 // 3 года
  },
  inventory: { maxStack: 50, weight: 0.02, basePrice: 10, rarity: "COMMON" }, // 20г
  nutrition: { calories: 0, hydration: 0, proteins: 0, fats: 0, carbs: 0 } // Не учитываем
};

// =============================================================================
// СПИСОК ПРЕДМЕТОВ
// =============================================================================

export const condimentItems = [

  // --- СОУСЫ И МАСЛА (Sauces & Oils) ---

  {
    ...baseSauce,
    id: "cond_mayo",
    internalName: "MayoProvansal",
    name: { ru: "Майонез Провансаль 67%", en: "Mayonnaise" },
    tags: [...baseSauce.tags, TAGS.FAT, TAGS.EMULSIFIER, TAGS.WHITE],
    // 300г дой-пак, ~40 грн
    inventory: { maxStack: 10, weight: 0.3, basePrice: 40, rarity: "COMMON" },
    nutrition: {
      calories: 620, hydration: 0, proteins: 0.5, fats: 67, carbs: 3,
      digestibility: 0.9, volume: 0.3, gutStress: 0.1
    },
    flavor: { sweet: 1, salty: 2, sour: 2, bitter: 0, umami: 4, spicy: 0, texture: "CREAMY" },
    assets: { icon: "icons/food/mayo.png" }
  },

  {
    ...baseSauce,
    id: "cond_ketchup_bbq",
    internalName: "KetchupShashlyk",
    name: { ru: "Кетчуп Шашлычный", en: "BBQ Ketchup" },
    tags: [...baseSauce.tags, TAGS.ACID, TAGS.SPICY, TAGS.RED_VEG],
    // 270г дой-пак, ~30 грн
    inventory: { maxStack: 10, weight: 0.27, basePrice: 30, rarity: "COMMON" },
    nutrition: {
      calories: 90, hydration: 0, proteins: 1, fats: 0, carbs: 22,
      digestibility: 0.95, volume: 0.27, gutStress: 0.1
    },
    flavor: { sweet: 3, salty: 2, sour: 3, bitter: 0, umami: 5, spicy: 3, texture: "PASTE" },
    assets: { icon: "icons/food/ketchup_bbq.png" }
  },

  {
    ...baseSauce,
    id: "cond_ketchup_mild",
    internalName: "KetchupMild",
    name: { ru: "Кетчуп Лагидный", en: "Mild Ketchup" },
    tags: [...baseSauce.tags, TAGS.ACID, TAGS.SWEET, TAGS.RED_VEG],
    inventory: { maxStack: 10, weight: 0.27, basePrice: 30, rarity: "COMMON" },
    nutrition: {
      calories: 95, hydration: 0, proteins: 1, fats: 0, carbs: 24,
      digestibility: 0.95, volume: 0.27, gutStress: 0.0
    },
    flavor: { sweet: 4, salty: 2, sour: 2, bitter: 0, umami: 5, spicy: 0, texture: "PASTE" },
    assets: { icon: "icons/food/ketchup_mild.png" }
  },

  {
    ...baseSauce,
    id: "cond_tomato_paste",
    internalName: "TomatoPaste",
    name: { ru: "Томатная паста", en: "Tomato Paste" },
    // Стеклянная банка или пакетик. Пусть будет пакетик 70г (на 1 раз).
    tags: [...baseSauce.tags, TAGS.ACID, TAGS.RED_VEG, TAGS.CONCENTRATED],
    packaging: { type: "SACHET", maxServings: 2, returnItem: "trash_wrapper" },
    inventory: { maxStack: 20, weight: 0.07, basePrice: 15, rarity: "COMMON" },
    nutrition: {
      calories: 80, hydration: 0, proteins: 4, fats: 0, carbs: 19,
      digestibility: 0.9, volume: 0.07, gutStress: 0.1
    },
    assets: { icon: "icons/food/tomato_paste.png" }
  },

  {
    ...baseSauce,
    id: "cond_mustard_strong",
    internalName: "MustardStrong",
    name: { ru: "Горчица Крепкая", en: "Strong Mustard" },
    tags: [...baseSauce.tags, TAGS.SPICY, TAGS.EMULSIFIER, TAGS.ANTIBIOTIC],
    // 120г дой-пак/тюбик, ~15 грн
    inventory: { maxStack: 10, weight: 0.12, basePrice: 15, rarity: "COMMON" },
    nutrition: {
      calories: 140, hydration: 0, proteins: 9, fats: 8, carbs: 5,
      digestibility: 0.8, volume: 0.12, gutStress: 0.2 // Жжет
    },
    flavor: { sweet: 1, salty: 2, sour: 3, bitter: 1, umami: 0, spicy: 8, texture: "PASTE" },
    assets: { icon: "icons/food/mustard.png" }
  },

  {
    ...baseSauce,
    id: "cond_mustard_dijon",
    internalName: "MustardDijon",
    name: { ru: "Горчица Дижонская", en: "Dijon Mustard" },
    tags: [...baseSauce.tags, TAGS.SPICY, TAGS.GRANULAR], // Зерна
    inventory: { maxStack: 10, weight: 0.12, basePrice: 25, rarity: "UNCOMMON" },
    nutrition: { calories: 150, hydration: 0, proteins: 7, fats: 9, carbs: 6 },
    assets: { icon: "icons/food/mustard_dijon.png" }
  },

  {
    ...baseSauce,
    id: "cond_horseradish_white",
    internalName: "HrenWhite",
    name: { ru: "Хрен Белый", en: "Horseradish" },
    tags: [...baseSauce.tags, TAGS.SPICY, TAGS.ANTIBIOTIC],
    inventory: { maxStack: 10, weight: 0.13, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 60, hydration: 0, proteins: 2, fats: 1, carbs: 10 },
    assets: { icon: "icons/food/hren.png" }
  },

  {
    ...baseSauce,
    id: "cond_horseradish_beet",
    internalName: "HrenBeet",
    name: { ru: "Хрен со свеклой", en: "Red Horseradish" },
    tags: [...baseSauce.tags, TAGS.SPICY, TAGS.RED_VEG],
    inventory: { maxStack: 10, weight: 0.13, basePrice: 20, rarity: "COMMON" },
    assets: { icon: "icons/food/hren_beet.png" }
  },

  {
    ...baseSauce,
    id: "cond_adjika",
    internalName: "Adjika",
    name: { ru: "Аджика", en: "Adjika" },
    tags: [...baseSauce.tags, TAGS.SPICY, TAGS.RED_VEG, TAGS.GARLIC],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 35, rarity: "COMMON" },
    nutrition: { calories: 80, hydration: 0, proteins: 2, fats: 3, carbs: 12 },
    assets: { icon: "icons/food/adjika.png" }
  },

  {
    id: "cond_vinegar",
    internalName: "Vinegar",
    name: { ru: "Уксус столовый 9%", en: "Vinegar" },
    category: "FOOD",
    physicalState: "LIQUID",
    tags: [TAGS.LIQUID, TAGS.ACID, TAGS.CURED, TAGS.CLEANING], // CURED - консервант
    packaging: { type: "BOTTLE_PLASTIC", returnItem: "bottle_plastic_empty", maxServings: 50 },
    // 1л, ~20 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 0, hydration: 0, proteins: 0, fats: 0, carbs: 0 }, // Не еда
    lifecycle: { shelfLifeSealed: 999999999 }, // Вечный
    assets: { icon: "icons/food/vinegar.png" }
  },

  {
    id: "cond_soy_sauce",
    internalName: "SoySauce",
    name: { ru: "Соевый соус", en: "Soy Sauce" },
    category: "FOOD",
    physicalState: "LIQUID",
    tags: [TAGS.LIQUID, TAGS.SALTY, TAGS.UMAMI, TAGS.FERMENTED],
    packaging: { type: "BOTTLE_GLASS", returnItem: "bottle_glass_empty", maxServings: 20 },
    // 200мл, ~40 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 50, hydration: 0, proteins: 6, fats: 0, carbs: 6 },
    flavor: { sweet: 1, salty: 9, sour: 1, bitter: 0, umami: 10 },
    assets: { icon: "icons/food/soy_sauce.png" }
  },

  {
    id: "cond_oil_sunflower_refined",
    internalName: "OilRefined",
    name: { ru: "Масло Подсолнечное (Раф.)", en: "Sunflower Oil (Refined)" },
    category: "FOOD",
    physicalState: "LIQUID",
    // FAT - позволяет жарить. FUEL - можно использовать в лампе.
    tags: [TAGS.LIQUID, TAGS.FAT, TAGS.FUEL, TAGS.BOTTLED],
    packaging: { type: "BOTTLE_PLASTIC", returnItem: "bottle_plastic_empty", maxServings: 50 },
    // 850мл (стандарт сейчас), ~55 грн
    inventory: { maxStack: 5, weight: 0.85, basePrice: 55, rarity: "COMMON" },
    // Чистый жир: 899 ккал
    nutrition: { calories: 899, hydration: 0, proteins: 0, fats: 99.9, carbs: 0 },
    thermodynamics: { burningPoint: 230 }, // Точка дымления высокая
    assets: { icon: "icons/food/oil_refined.png" }
  },

  {
    id: "cond_oil_sunflower_aromatic",
    internalName: "OilAroma",
    name: { ru: "Масло Подсолнечное (Пахучее)", en: "Sunflower Oil (Unrefined)" },
    tags: [TAGS.LIQUID, TAGS.FAT, TAGS.STRONG_SMELL, TAGS.FUEL],
    inventory: { maxStack: 5, weight: 0.85, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 899, hydration: 0, proteins: 0, fats: 99.9, carbs: 0 },
    thermodynamics: { burningPoint: 107 }, // Низкая точка дымления! Не подходит для жарки (будет BURNT)
    assets: { icon: "icons/food/oil_aroma.png" }
  },

  // --- СЫПУЧИЕ И БАКАЛЕЯ (Pantry & Baking) ---

  {
    ...basePowder,
    id: "pantry_flour",
    internalName: "Flour",
    name: { ru: "Мука пшеничная", en: "Wheat Flour" },
    tags: [...basePowder.tags, TAGS.STARCH, TAGS.GRAIN],
    // 1 кг, ~22 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 22, rarity: "COMMON" },
    nutrition: { calories: 364, hydration: -10, proteins: 10, fats: 1, carbs: 76 },
    assets: { icon: "icons/food/flour.png" }
  },

  {
    ...basePowder,
    id: "pantry_sugar",
    internalName: "Sugar",
    name: { ru: "Сахар (Песок)", en: "Sugar" },
    tags: [...basePowder.tags, TAGS.SUGAR, TAGS.SOLUBLE, TAGS.MELTABLE, TAGS.CARAMEL],
    // 1 кг, ~30 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 30, rarity: "COMMON" },
    nutrition: { calories: 398, hydration: 0, proteins: 0, fats: 0, carbs: 99.8 },
    flavor: { sweet: 10 },
    assets: { icon: "icons/food/sugar.png" }
  },

  {
    ...basePowder,
    id: "pantry_sugar_cubes",
    internalName: "SugarCubes",
    name: { ru: "Сахар (Рафинад)", en: "Sugar Cubes" },
    tags: [...basePowder.tags, TAGS.SUGAR, TAGS.SOLUBLE],
    packaging: { ...basePowder.packaging, type: "CARDBOARD_BOX", maxServings: 100, isDivisible: true },
    inventory: { maxStack: 5, weight: 0.5, basePrice: 40, rarity: "COMMON" },
    assets: { icon: "icons/food/sugar_cubes.png" }
  },

  {
    ...basePowder,
    id: "pantry_salt",
    internalName: "Salt",
    name: { ru: "Соль (Каменная)", en: "Rock Salt" },
    tags: [...basePowder.tags, TAGS.SALTY, TAGS.CURED, TAGS.SOLUBLE], // Cured - делает таранку
    // 1.5 кг (стандарт пачки Артемсоль... rip, теперь другие), ~25 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 25, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 999999999 }, // Вечная
    nutrition: { calories: 0 },
    assets: { icon: "icons/food/salt.png" }
  },

  {
    ...basePowder,
    id: "pantry_soda",
    internalName: "Soda",
    name: { ru: "Сода пищевая", en: "Baking Soda" },
    tags: [...basePowder.tags, TAGS.LEAVENING, TAGS.CLEANING], // Cleaning - можно отмыть DIRTY предмет
    // 400г пачка, ~15 грн
    inventory: { maxStack: 10, weight: 0.4, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 0 },
    assets: { icon: "icons/food/soda.png" }
  },

  {
    ...basePowder,
    id: "pantry_breadcrumbs",
    internalName: "Breadcrumbs",
    name: { ru: "Сухари панировочные", en: "Breadcrumbs" },
    tags: [...basePowder.tags, TAGS.GRAIN, TAGS.CRISPY],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 347, carbs: 70 },
    assets: { icon: "icons/food/breadcrumbs.png" }
  },

  {
    id: "pantry_yeast_dry",
    internalName: "Yeast",
    name: { ru: "Дрожжи сухие", en: "Dry Yeast" },
    category: "INGREDIENT",
    physicalState: "POWDER",
    tags: [TAGS.POWDER, TAGS.LEAVENING, TAGS.ALIVE], // Alive - живой грибок
    packaging: { type: "SACHET", maxServings: 1 },
    // 11г пакетик, ~10 грн
    inventory: { maxStack: 50, weight: 0.011, basePrice: 10, rarity: "COMMON" },
    lifecycle: { shelfLifeSealed: 31536000 },
    assets: { icon: "icons/food/yeast.png" }
  },

  {
    id: "pantry_gelatin",
    internalName: "Gelatin",
    name: { ru: "Желатин", en: "Gelatin" },
    category: "INGREDIENT",
    tags: [TAGS.POWDER, TAGS.GELLING], // Делает холодец
    packaging: { type: "SACHET", maxServings: 1 },
    inventory: { maxStack: 50, weight: 0.025, basePrice: 15 },
    assets: { icon: "icons/food/gelatin.png" }
  },

  {
    id: "pantry_honey",
    internalName: "Honey",
    name: { ru: "Мёд", en: "Honey" },
    category: "FOOD",
    physicalState: "PASTE", // Или LIQUID
    tags: [TAGS.SUGAR, TAGS.ANTIBIOTIC, TAGS.LONG_LIFE, TAGS.STICKY],
    packaging: { type: "GLASS_JAR", returnItem: "glass_jar_empty" },
    // 0.5л банка (около 700г), ~150 грн
    inventory: { maxStack: 5, weight: 0.7, basePrice: 150, rarity: "UNCOMMON" },
    lifecycle: { shelfLifeOpen: 999999999 }, // Вечный
    nutrition: { calories: 304, carbs: 82 },
    assets: { icon: "icons/food/honey.png" }
  },

  {
    id: "pantry_citric_acid",
    internalName: "CitricAcid",
    name: { ru: "Лимонная кислота", en: "Citric Acid" },
    category: "INGREDIENT",
    tags: [TAGS.POWDER, TAGS.ACID, TAGS.CLEANING],
    inventory: { weight: 0.02, basePrice: 8 },
    assets: { icon: "icons/food/citric_acid.png" }
  },

  {
    id: "pantry_poppy",
    internalName: "PoppySeeds",
    name: { ru: "Мак (Кондитерский)", en: "Poppy Seeds" },
    category: "INGREDIENT",
    tags: [TAGS.GRANULAR, TAGS.FLAVORING],
    inventory: { weight: 0.1, basePrice: 35 },
    assets: { icon: "icons/food/poppy.png" }
  },

  {
    id: "pantry_vanilla_sugar",
    internalName: "Vanilla",
    name: { ru: "Ванильный сахар", en: "Vanilla Sugar" },
    category: "INGREDIENT",
    tags: [TAGS.POWDER, TAGS.SPICE, TAGS.SWEET],
    inventory: { weight: 0.01, basePrice: 5 },
    assets: { icon: "icons/food/vanilla.png" }
  },

  // --- СПЕЦИИ (Spices) ---
  // Используем baseSpice (вес ~10-20г)

  {
    ...baseSpice,
    id: "spice_pepper_black",
    name: { ru: "Перец черный (Молотый)", en: "Black Pepper (Ground)" },
    tags: [...baseSpice.tags, TAGS.SPICY],
    assets: { icon: "icons/food/pepper_ground.png" }
  },
  {
    ...baseSpice,
    id: "spice_pepper_peas",
    name: { ru: "Перец черный (Горошек)", en: "Black Peppercorns" },
    tags: [...baseSpice.tags, TAGS.SPICY, TAGS.WHOLE], // Цельный для ухи
    assets: { icon: "icons/food/pepper_peas.png" }
  },
  {
    ...baseSpice,
    id: "spice_allspice",
    name: { ru: "Перец душистый", en: "Allspice" },
    tags: [...baseSpice.tags, TAGS.STRONG_SMELL],
    assets: { icon: "icons/food/allspice.png" }
  },
  {
    ...baseSpice,
    id: "spice_bay_leaf",
    name: { ru: "Лавровый лист", en: "Bay Leaf" },
    physicalState: "SOLID", // Листья
    tags: [...baseSpice.tags, TAGS.LEAF, TAGS.NO_EAT], // Не едят, только варят
    inventory: { weight: 0.01, basePrice: 10 },
    assets: { icon: "icons/food/bay_leaf.png" }
  },
  {
    ...baseSpice,
    id: "spice_paprika",
    name: { ru: "Паприка", en: "Paprika" },
    tags: [...baseSpice.tags, TAGS.RED_VEG], // Дает цвет
    assets: { icon: "icons/food/paprika.png" }
  },
  {
    ...baseSpice,
    id: "spice_fish_mix",
    name: { ru: "Приправа 'К рыбе'", en: "Fish Seasoning" },
    tags: [...baseSpice.tags, TAGS.MIX],
    assets: { icon: "icons/food/spice_fish.png" }
  },
  {
    ...baseSpice,
    id: "spice_cloves",
    name: { ru: "Гвоздика", en: "Cloves" },
    tags: [...baseSpice.tags, TAGS.STRONG_SMELL],
    assets: { icon: "icons/food/cloves.png" }
  }

];