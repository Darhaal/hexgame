import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (PRODUCE TEMPLATES)
// =============================================================================

// 1. КОРНЕПЛОДЫ (Долго хранятся, грязные)
const baseRoot = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.VEG, TAGS.RAW, TAGS.DIRTY, TAGS.SOLID, TAGS.LONG_LIFE],
  packaging: {
    type: "NONE", // На вес или в сетке
    isOpen: true,
    returnItem: "compost", // Очистки
    maxServings: 1,
    currentServings: 1,
    isDivisible: true // Можно отрезать половину
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 2592000, // 30 дней (в погребе/рюкзаке)
    aging: { isAgeable: false }
  },
  thermodynamics: {
    currentTemp: 15,
    specificHeat: 3.6,
    cookingPoint: 85, // Варятся долго
    burningPoint: 200
  },
  risks: [
    { type: "DYSENTERY", chanceBase: 0.1, severity: "MINOR" } // Если не помыть (DIRTY)
  ]
};

// 2. ОВОЩИ ПЛОДОВЫЕ (Помидоры, Огурцы - портятся быстрее)
const baseVegFruit = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.VEG, TAGS.RAW, TAGS.FRESH, TAGS.READY_TO_EAT, TAGS.WASHABLE],
  packaging: { type: "NONE", isOpen: true, returnItem: "compost", isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 604800, // 7 дней
  },
  thermodynamics: {
    cookingPoint: 60, // Готовятся быстро
  }
};

// 3. ЛИСТОВЫЕ И КАПУСТА
const baseLeafy = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.VEG, TAGS.RAW, TAGS.FRESH, TAGS.LEAF],
  packaging: { type: "NONE", isOpen: true, returnItem: "compost", isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 1209600, // 14 дней (капуста)
  }
};

// 4. ЗЕЛЕНЬ (Пучки - портятся очень быстро)
const baseHerb = {
  category: "FOOD", // Или INGREDIENT
  physicalState: "SOLID",
  tags: [TAGS.VEG, TAGS.RAW, TAGS.FRESH, TAGS.LEAF, TAGS.FLAVORING],
  packaging: { type: "BUNCH", isOpen: true, returnItem: "compost", isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 259200, // 3 дня (вянет)
  },
  inventory: { maxStack: 20, weight: 0.05, basePrice: 15, rarity: "COMMON" } // 50г пучок
};

// 5. ГРИБЫ (Лесные - риск, Магазинные - чистые)
const baseFungus = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.FUNGUS, TAGS.RAW, TAGS.BOIL_REQUIRED, TAGS.UMAMI],
  packaging: { type: "NONE", isOpen: true, returnItem: "compost", isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 172800, // 2 дня (портятся моментально)
    drying: { canDry: true, resultId: "dried_mushrooms" }
  },
  thermodynamics: { cookingPoint: 70, specificHeat: 3.8 }, // Увариваются
  risks: [{ type: "FOOD_POISONING", chanceBase: 0.2, severity: "MAJOR" }] // Риск если не доварить
};

// 6. ФРУКТЫ (Сладкие, Витамины)
const baseFruit = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.FRUIT, TAGS.RAW, TAGS.SWEET, TAGS.READY_TO_EAT, TAGS.WASHABLE],
  packaging: { type: "NONE", isOpen: true, returnItem: "compost", isDivisible: true },
  lifecycle: { shelfLifeOpen: 1209600 }, // 14 дней
  thermodynamics: { cookingPoint: 60 }
};

// 7. ЯГОДЫ (Мелкие, дорогие, витаминные)
const baseBerry = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.FRUIT, TAGS.BERRY, TAGS.RAW, TAGS.SWEET, TAGS.READY_TO_EAT],
  packaging: { type: "PUNNET", isOpen: true, returnItem: "trash_plastic", maxServings: 5, isDivisible: true }, // Лоток
  lifecycle: { shelfLifeOpen: 259200 }, // 3 дня
  inventory: { weight: 0.5 } // Обычно по 0.5 кг или стаканами
};

// 8. ОРЕХИ (Сухие, Жирные, Вечные)
const baseNut = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.NUT, TAGS.DRY, TAGS.FAT, TAGS.LONG_LIFE, TAGS.READY_TO_EAT],
  packaging: { type: "NONE", isOpen: true, returnItem: "shells" },
  lifecycle: { shelfLifeOpen: 15768000 }, // Полгода-год
  inventory: { weight: 0.2, maxStack: 10 }
};

// =============================================================================
// СПИСОК ПРЕДМЕТОВ
// Нутрициология на 100г.
// =============================================================================

export const produceItems = [

  // --- КОРНЕПЛОДЫ (Roots) ---

  {
    ...baseRoot,
    id: "veg_potato",
    internalName: "Potato",
    name: { ru: "Картофель", en: "Potato" },
    tags: [...baseRoot.tags, TAGS.STARCH, TAGS.BOIL_REQUIRED], // Сырым есть плохо
    // 1 кг, ~25 грн
    inventory: { maxStack: 10, weight: 1.0, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 77, hydration: 79, proteins: 2, fats: 0.4, carbs: 16.3 },
    assets: { icon: "icons/food/potato.png" }
  },

  {
    ...baseRoot,
    id: "veg_carrot",
    internalName: "Carrot",
    name: { ru: "Морковь", en: "Carrot" },
    tags: [...baseRoot.tags, TAGS.SWEET, TAGS.CRUNCHY, TAGS.READY_TO_EAT],
    // 1 кг, ~20 грн
    inventory: { maxStack: 10, weight: 1.0, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 35, hydration: 88, proteins: 1.3, fats: 0.1, carbs: 6.9 },
    assets: { icon: "icons/food/carrot.png" }
  },

  {
    ...baseRoot,
    id: "veg_beetroot",
    internalName: "Beetroot",
    name: { ru: "Свекла (Буряк)", en: "Beetroot" },
    tags: [...baseRoot.tags, TAGS.RED_VEG, TAGS.SWEET], // Красит борщ
    // 1 кг, ~18 грн
    inventory: { maxStack: 10, weight: 1.0, basePrice: 18, rarity: "COMMON" },
    nutrition: { calories: 43, hydration: 86, proteins: 1.5, fats: 0.1, carbs: 8.8 },
    assets: { icon: "icons/food/beetroot.png" }
  },

  {
    ...baseRoot,
    id: "veg_onion_yellow",
    internalName: "Onion",
    name: { ru: "Лук репчатый", en: "Yellow Onion" },
    tags: [...baseRoot.tags, TAGS.SPICY, TAGS.ANTIBIOTIC, TAGS.CARAMEL],
    // 1 кг, ~30 грн
    inventory: { maxStack: 10, weight: 1.0, basePrice: 30, rarity: "COMMON" },
    nutrition: { calories: 40, hydration: 89, proteins: 1.1, fats: 0.1, carbs: 9 },
    assets: { icon: "icons/food/onion.png" }
  },

  {
    ...baseRoot,
    id: "veg_onion_red",
    internalName: "OnionRed",
    name: { ru: "Лук красный (Ялтинский)", en: "Red Onion" },
    tags: [...baseRoot.tags, TAGS.SWEET, TAGS.ANTIBIOTIC], // Сладкий
    // 1 кг, ~60 грн (дороже)
    inventory: { maxStack: 10, weight: 1.0, basePrice: 60, rarity: "UNCOMMON" },
    nutrition: { calories: 42, hydration: 88, proteins: 1.1, fats: 0.1, carbs: 9.5 },
    assets: { icon: "icons/food/onion_red.png" }
  },

  {
    ...baseRoot,
    id: "veg_shallot",
    internalName: "Shallot",
    name: { ru: "Лук-шалот", en: "Shallot" },
    tags: [...baseRoot.tags, TAGS.SWEET],
    // 0.5 кг сетка, ~80 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 80, rarity: "RARE" },
    nutrition: { calories: 72, hydration: 80, proteins: 2.5, fats: 0.1, carbs: 17 },
    assets: { icon: "icons/food/shallot.png" }
  },

  {
    ...baseRoot,
    id: "veg_garlic",
    internalName: "Garlic",
    name: { ru: "Чеснок", en: "Garlic" },
    tags: [...baseRoot.tags, TAGS.SPICY, TAGS.ANTIBIOTIC, TAGS.STRONG_SMELL],
    // Головка ~50г, ~15 грн
    inventory: { maxStack: 20, weight: 0.05, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 149, hydration: 60, proteins: 6.5, fats: 0.5, carbs: 33 },
    assets: { icon: "icons/food/garlic.png" }
  },

  {
    ...baseRoot,
    id: "veg_radish",
    internalName: "Radish",
    name: { ru: "Редис", en: "Radish" },
    tags: [...baseRoot.tags, TAGS.CRUNCHY, TAGS.SPICY, TAGS.READY_TO_EAT],
    // Пучок 300г, ~35 грн
    inventory: { maxStack: 10, weight: 0.3, basePrice: 35, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 604800 }, // Неделя
    nutrition: { calories: 19, hydration: 95, proteins: 1.2, fats: 0.1, carbs: 3.4 },
    assets: { icon: "icons/food/radish.png" }
  },

  {
    ...baseRoot,
    id: "veg_radish_black",
    internalName: "RadishBlack",
    name: { ru: "Редька черная", en: "Black Radish" },
    tags: [...baseRoot.tags, TAGS.SPICY, TAGS.ANTIBIOTIC],
    // 500г, ~20 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 20, rarity: "UNCOMMON" },
    nutrition: { calories: 36, hydration: 88, proteins: 1.9, fats: 0.2, carbs: 6.7 },
    assets: { icon: "icons/food/radish_black.png" }
  },

  {
    ...baseRoot,
    id: "veg_daikon",
    internalName: "Daikon",
    name: { ru: "Дайкон", en: "Daikon" },
    tags: [...baseRoot.tags, TAGS.CRUNCHY, TAGS.WATER],
    // 800г корень, ~40 грн
    inventory: { maxStack: 5, weight: 0.8, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 21, hydration: 94, proteins: 1.2, fats: 0, carbs: 4.1 },
    assets: { icon: "icons/food/daikon.png" }
  },

  {
    ...baseRoot,
    id: "veg_horseradish_root",
    internalName: "HrenRoot",
    name: { ru: "Хрен (Корень)", en: "Horseradish Root" },
    tags: [...baseRoot.tags, TAGS.SPICY, TAGS.ANTIBIOTIC],
    // 200г, ~30 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 30, rarity: "UNCOMMON" },
    nutrition: { calories: 56, hydration: 75, proteins: 3.2, fats: 0.4, carbs: 10.5 },
    assets: { icon: "icons/food/hren_root.png" }
  },

  {
    ...baseRoot,
    id: "veg_parsnip",
    internalName: "Parsnip",
    name: { ru: "Пастернак", en: "Parsnip" },
    tags: [...baseRoot.tags, TAGS.SWEET],
    inventory: { maxStack: 10, weight: 0.5, basePrice: 40, rarity: "RARE" },
    nutrition: { calories: 75, hydration: 80, proteins: 1.2, fats: 0.3, carbs: 18 },
    assets: { icon: "icons/food/parsnip.png" }
  },

  {
    ...baseRoot,
    id: "veg_celery_root",
    internalName: "CeleryRoot",
    name: { ru: "Сельдерей (Корень)", en: "Celery Root" },
    tags: [...baseRoot.tags, TAGS.AROMATIC],
    // 1 кг, ~50 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 50, rarity: "UNCOMMON" },
    nutrition: { calories: 42, hydration: 88, proteins: 1.5, fats: 0.3, carbs: 9 },
    assets: { icon: "icons/food/celery_root.png" }
  },

  {
    ...baseRoot,
    id: "veg_ginger",
    internalName: "Ginger",
    name: { ru: "Имбирь", en: "Ginger Root" },
    tags: [...baseRoot.tags, TAGS.SPICY, TAGS.ANTIBIOTIC, TAGS.MEDICINAL],
    // 200г, ~40 грн
    inventory: { maxStack: 10, weight: 0.2, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 80, hydration: 79, proteins: 1.8, fats: 0.7, carbs: 17 },
    assets: { icon: "icons/food/ginger.png" }
  },

  // --- ОВОЩИ ПЛОДОВЫЕ (Fruits) ---

  {
    ...baseVegFruit,
    id: "veg_tomato_red",
    internalName: "TomatoRed",
    name: { ru: "Помидоры красные", en: "Red Tomatoes" },
    tags: [...baseVegFruit.tags, TAGS.ACID, TAGS.RED_VEG, TAGS.JUICY],
    // 1 кг, ~60 грн (зимой) / 30 грн (летом)
    inventory: { maxStack: 5, weight: 1.0, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 18, hydration: 94, proteins: 0.9, fats: 0.2, carbs: 3.9 },
    assets: { icon: "icons/food/tomato.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_tomato_pink",
    internalName: "TomatoPink",
    name: { ru: "Помидоры розовые", en: "Pink Tomatoes" },
    tags: [...baseVegFruit.tags, TAGS.SWEET, TAGS.JUICY],
    inventory: { maxStack: 5, weight: 1.0, basePrice: 80, rarity: "UNCOMMON" },
    nutrition: { calories: 20, hydration: 93, proteins: 1.0, fats: 0.2, carbs: 4.2 },
    assets: { icon: "icons/food/tomato_pink.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_tomato_cherry",
    internalName: "TomatoCherry",
    name: { ru: "Помидоры Черри", en: "Cherry Tomatoes" },
    tags: [...baseVegFruit.tags, TAGS.SWEET, TAGS.SNACK],
    // 250г упаковка, ~50 грн
    inventory: { maxStack: 10, weight: 0.25, basePrice: 50, rarity: "COMMON" },
    nutrition: { calories: 25, hydration: 92, proteins: 1.2, fats: 0.2, carbs: 5 },
    assets: { icon: "icons/food/tomato_cherry.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_cucumber",
    internalName: "Cucumber",
    name: { ru: "Огурцы", en: "Cucumbers" },
    tags: [...baseVegFruit.tags, TAGS.CRUNCHY, TAGS.WATER],
    // 1 кг, ~70 грн (зима)
    inventory: { maxStack: 5, weight: 1.0, basePrice: 70, rarity: "COMMON" },
    nutrition: { calories: 15, hydration: 96, proteins: 0.8, fats: 0.1, carbs: 3 },
    assets: { icon: "icons/food/cucumber.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_pepper_bell",
    internalName: "PepperBell",
    name: { ru: "Перец болгарский", en: "Bell Pepper" },
    tags: [...baseVegFruit.tags, TAGS.SWEET, TAGS.CRUNCHY, TAGS.VITAMIN_C],
    // 1 кг, ~90 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 90, rarity: "COMMON" },
    nutrition: { calories: 27, hydration: 92, proteins: 1.3, fats: 0.1, carbs: 5.3 },
    assets: { icon: "icons/food/pepper.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_pepper_chili",
    internalName: "PepperChili",
    name: { ru: "Перец Чили", en: "Chili Pepper" },
    tags: [...baseVegFruit.tags, TAGS.SPICY, TAGS.FLAVORING],
    // 50г (несколько шт), ~20 грн
    inventory: { maxStack: 20, weight: 0.05, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 40, hydration: 88, proteins: 1.9, fats: 0.4, carbs: 8.8 },
    assets: { icon: "icons/food/chili.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_zucchini",
    internalName: "Zucchini",
    name: { ru: "Кабачки", en: "Zucchini" },
    tags: [...baseVegFruit.tags, TAGS.SOFT, TAGS.BOIL_REQUIRED], // Сырыми не очень
    // 1 кг, ~40 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 24, hydration: 93, proteins: 0.6, fats: 0.3, carbs: 4.6 },
    assets: { icon: "icons/food/zucchini.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_courgette",
    internalName: "Tsukini",
    name: { ru: "Цукини", en: "Courgette" },
    tags: [...baseVegFruit.tags, TAGS.SOFT, TAGS.BOIL_REQUIRED],
    inventory: { maxStack: 5, weight: 1.0, basePrice: 50, rarity: "COMMON" },
    nutrition: { calories: 20, hydration: 94, proteins: 1.2, fats: 0.1, carbs: 3 },
    assets: { icon: "icons/food/courgette.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_pattypan",
    internalName: "Patisson",
    name: { ru: "Патиссоны", en: "Pattypan Squash" },
    tags: [...baseVegFruit.tags, TAGS.FIRM],
    inventory: { maxStack: 5, weight: 0.5, basePrice: 30, rarity: "UNCOMMON" },
    nutrition: { calories: 19, hydration: 92, proteins: 0.6, fats: 0.1, carbs: 4 },
    assets: { icon: "icons/food/patisson.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_eggplant",
    internalName: "Baklazhan",
    name: { ru: "Баклажаны", en: "Eggplant" },
    tags: [...baseVegFruit.tags, TAGS.BOIL_REQUIRED, TAGS.BITTER_IF_RAW],
    // 1 кг, ~60 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 24, hydration: 92, proteins: 1.2, fats: 0.1, carbs: 4.5 },
    assets: { icon: "icons/food/eggplant.png" }
  },

  {
    ...baseVegFruit,
    id: "veg_pumpkin",
    internalName: "Garbuz",
    name: { ru: "Тыква (Гарбуз)", en: "Pumpkin" },
    tags: [...baseVegFruit.tags, TAGS.SWEET, TAGS.HARD_SKIN, TAGS.LONG_LIFE],
    lifecycle: { shelfLifeOpen: 7776000 }, // 3 месяца
    // 3 кг (небольшая), ~45 грн
    inventory: { maxStack: 1, weight: 3.0, basePrice: 45, rarity: "COMMON" },
    packaging: { ...baseVegFruit.packaging, maxServings: 10, currentServings: 10 },
    nutrition: { calories: 26, hydration: 90, proteins: 1, fats: 0.1, carbs: 6.5 },
    assets: { icon: "icons/food/pumpkin.png" }
  },

  // --- ЛИСТОВЫЕ (Cabbage/Leaves) ---

  {
    ...baseLeafy,
    id: "veg_cabbage_white",
    internalName: "Cabbage",
    name: { ru: "Капуста белокочанная", en: "White Cabbage" },
    tags: [...baseLeafy.tags, TAGS.CRUNCHY, TAGS.LONG_LIFE],
    // 2 кг кочан, ~30 грн
    inventory: { maxStack: 1, weight: 2.0, basePrice: 30, rarity: "COMMON" },
    packaging: { ...baseLeafy.packaging, maxServings: 8, currentServings: 8 },
    nutrition: { calories: 27, hydration: 90, proteins: 1.8, fats: 0.1, carbs: 4.7 },
    assets: { icon: "icons/food/cabbage.png" }
  },

  {
    ...baseLeafy,
    id: "veg_cauliflower",
    internalName: "Cauliflower",
    name: { ru: "Капуста цветная", en: "Cauliflower" },
    tags: [...baseLeafy.tags, TAGS.BOIL_REQUIRED],
    // 1 кг, ~80 грн
    inventory: { maxStack: 1, weight: 1.0, basePrice: 80, rarity: "COMMON" },
    nutrition: { calories: 30, hydration: 90, proteins: 2.5, fats: 0.3, carbs: 4.2 },
    assets: { icon: "icons/food/cauliflower.png" }
  },

  {
    ...baseLeafy,
    id: "veg_broccoli",
    internalName: "Broccoli",
    name: { ru: "Капуста брокколи", en: "Broccoli" },
    tags: [...baseLeafy.tags, TAGS.BOIL_REQUIRED, TAGS.VITAMIN_C],
    // 0.5 кг, ~60 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 34, hydration: 89, proteins: 2.8, fats: 0.4, carbs: 6.6 },
    assets: { icon: "icons/food/broccoli.png" }
  },

  {
    ...baseLeafy,
    id: "veg_peking",
    internalName: "Peking",
    name: { ru: "Капуста пекинская", en: "Napa Cabbage" },
    tags: [...baseLeafy.tags, TAGS.SOFT, TAGS.SALAD],
    // 1 кг, ~40 грн
    inventory: { maxStack: 2, weight: 1.0, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 16, hydration: 94, proteins: 1.2, fats: 0.2, carbs: 2 },
    assets: { icon: "icons/food/peking.png" }
  },

  // --- ЗЕРНОВЫЕ ОВОЩИ (Grains/Seeds Fresh) ---

  {
    id: "veg_corn_cob",
    internalName: "CornCob",
    name: { ru: "Кукуруза (Початок)", en: "Corn Cob" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.VEG, TAGS.GRAIN, TAGS.SWEET, TAGS.BOIL_REQUIRED],
    packaging: { type: "HUSK", isOpen: true, returnItem: "compost" }, // В листьях
    // 300г, ~20 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 96, hydration: 73, proteins: 3.4, fats: 1.5, carbs: 19 }, // Калорийно
    assets: { icon: "icons/food/corn_cob.png" }
  },

  {
    id: "veg_sunflower",
    internalName: "Sunflower",
    name: { ru: "Подсолнух (Голова)", en: "Sunflower Head" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.VEG, TAGS.SEEDS, TAGS.FAT, TAGS.SNACK],
    // 1 кг (целая голова с семечками), ~50 грн (редко продают)
    inventory: { maxStack: 1, weight: 1.0, basePrice: 50, rarity: "UNCOMMON" },
    packaging: { ...baseLeafy.packaging, maxServings: 5 },
    nutrition: { calories: 580, hydration: 5, proteins: 21, fats: 51, carbs: 20 }, // Семечки очень калорийные
    assets: { icon: "icons/food/sunflower.png" }
  },

  // --- БОБОВЫЕ (Legumes Fresh) ---

  {
    id: "veg_peas_fresh",
    internalName: "PeasFresh",
    name: { ru: "Горох (Стручки)", en: "Green Peas (Pods)" },
    category: "FOOD",
    tags: [TAGS.VEG, TAGS.SWEET, TAGS.RAW, TAGS.SNACK],
    // 0.5 кг, ~40 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 81, hydration: 79, proteins: 5, fats: 0.4, carbs: 14 },
    assets: { icon: "icons/food/peas_fresh.png" }
  },

  {
    id: "veg_beans_pods",
    internalName: "BeansGreen",
    name: { ru: "Фасоль (Стручковая)", en: "Green Beans" },
    category: "FOOD",
    tags: [TAGS.VEG, TAGS.BOIL_REQUIRED],
    inventory: { maxStack: 5, weight: 0.5, basePrice: 50, rarity: "COMMON" },
    nutrition: { calories: 31, hydration: 90, proteins: 1.8, fats: 0.2, carbs: 7 },
    assets: { icon: "icons/food/beans_green.png" }
  },

  {
    id: "veg_beans_seeds",
    internalName: "BeansSeeds",
    name: { ru: "Фасоль (Зерна свежие)", en: "Fresh Beans" },
    category: "FOOD",
    tags: [TAGS.VEG, TAGS.BOIL_REQUIRED, TAGS.PROTEIN],
    inventory: { maxStack: 5, weight: 0.5, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 150, hydration: 60, proteins: 10, fats: 0.5, carbs: 25 },
    assets: { icon: "icons/food/beans_fresh.png" }
  },

  // --- ЗЕЛЕНЬ ОГОРОДНАЯ (Garden Herbs) ---
  // Используем baseHerb (50г, ~15-20 грн)

  { ...baseHerb, id: "herb_dill", name: { ru: "Укроп", en: "Dill" }, tags: [...baseHerb.tags, TAGS.STRONG_SMELL], assets: { icon: "icons/food/dill.png" } },
  { ...baseHerb, id: "herb_parsley", name: { ru: "Петрушка (Лист)", en: "Parsley" }, assets: { icon: "icons/food/parsley.png" } },
  { ...baseHerb, id: "herb_parsley_root", name: { ru: "Петрушка (Корень)", en: "Parsley Root" }, tags: [...baseRoot.tags, TAGS.AROMATIC], inventory: { weight: 0.2, basePrice: 20 }, assets: { icon: "icons/food/parsley_root.png" } },
  { ...baseHerb, id: "herb_onion_green", name: { ru: "Лук зеленый", en: "Green Onion" }, tags: [...baseHerb.tags, TAGS.SPICY, TAGS.ANTIBIOTIC], assets: { icon: "icons/food/onion_green.png" } },
  { ...baseHerb, id: "herb_lettuce", name: { ru: "Салат", en: "Lettuce" }, tags: [...baseLeafy.tags, TAGS.SOFT], inventory: { weight: 0.2, basePrice: 30 }, assets: { icon: "icons/food/lettuce.png" } },
  { ...baseHerb, id: "herb_sorrel", name: { ru: "Щавель", en: "Sorrel" }, tags: [...baseHerb.tags, TAGS.SOUR, TAGS.ACID], assets: { icon: "icons/food/sorrel.png" } },
  { ...baseHerb, id: "herb_spinach", name: { ru: "Шпинат", en: "Spinach" }, tags: [...baseHerb.tags, TAGS.IRON], assets: { icon: "icons/food/spinach.png" } },
  { ...baseHerb, id: "herb_basil", name: { ru: "Базилик", en: "Basil" }, tags: [...baseHerb.tags, TAGS.AROMATIC, TAGS.PURPLE], inventory: { weight: 0.05, basePrice: 25 }, assets: { icon: "icons/food/basil.png" } },
  { ...baseHerb, id: "herb_cilantro", name: { ru: "Кинза", en: "Cilantro" }, tags: [...baseHerb.tags, TAGS.STRONG_SMELL], inventory: { weight: 0.05, basePrice: 20 }, assets: { icon: "icons/food/cilantro.png" } },
  { ...baseHerb, id: "herb_horseradish_leaf", name: { ru: "Листья хрена", en: "Horseradish Leaves" }, tags: [...baseHerb.tags, TAGS.PICKLING], assets: { icon: "icons/food/hren_leaf.png" } },
  { ...baseHerb, id: "herb_garlic_stalks", name: { ru: "Стебли чеснока", en: "Garlic Scapes" }, tags: [...baseHerb.tags, TAGS.SPICY], assets: { icon: "icons/food/garlic_scapes.png" } },

  // --- ЗЕЛЕНЬ ДИКАЯ (Wild Herbs) ---
  // Бесплатно (basePrice: 0), но нужно искать

  { ...baseHerb, id: "herb_wild_ramson", name: { ru: "Черемша", en: "Ramson" }, tags: [...baseHerb.tags, TAGS.GARLIC, TAGS.WILD], inventory: { weight: 0.05, basePrice: 0, rarity: "COMMON" }, assets: { icon: "icons/food/ramson.png" } },
  { ...baseHerb, id: "herb_wild_mint", name: { ru: "Мята", en: "Mint" }, tags: [...baseHerb.tags, TAGS.TEA, TAGS.CALMING], inventory: { weight: 0.03, basePrice: 0 }, assets: { icon: "icons/food/mint.png" } },
  { ...baseHerb, id: "herb_wild_melissa", name: { ru: "Мелисса", en: "Lemon Balm" }, tags: [...baseHerb.tags, TAGS.TEA, TAGS.CALMING], inventory: { weight: 0.03, basePrice: 0 }, assets: { icon: "icons/food/melissa.png" } },
  { ...baseHerb, id: "herb_wild_tarragon", name: { ru: "Тархун", en: "Tarragon" }, tags: [...baseHerb.tags, TAGS.FLAVORING], inventory: { weight: 0.03, basePrice: 0 }, assets: { icon: "icons/food/tarragon.png" } },
  { ...baseHerb, id: "herb_wild_nettle", name: { ru: "Крапива (Молодая)", en: "Young Nettle" }, tags: [...baseHerb.tags, TAGS.BOIL_REQUIRED, TAGS.MEDICINAL], inventory: { weight: 0.05, basePrice: 0 }, assets: { icon: "icons/food/nettle.png" } },

  // --- ГРИБЫ (Fungi) ---

  // Лесные (Дикие)
  { ...baseFungus, id: "fungus_white", name: { ru: "Белый гриб", en: "Porcini" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.DELICACY], inventory: { weight: 0.5, basePrice: 150, rarity: "RARE" }, nutrition: { calories: 34, proteins: 3.7 }, assets: { icon: "icons/food/fungus_white.png" } },
  { ...baseFungus, id: "fungus_bolete_orange", name: { ru: "Подосиновик", en: "Orange-Cap Bolete" }, tags: [...baseFungus.tags, TAGS.WILD], inventory: { weight: 0.5, basePrice: 100, rarity: "UNCOMMON" }, nutrition: { calories: 22, proteins: 3.3 }, assets: { icon: "icons/food/fungus_bolete_orange.png" } },
  { ...baseFungus, id: "fungus_bolete_brown", name: { ru: "Подберезовик", en: "Brown Cap Bolete" }, tags: [...baseFungus.tags, TAGS.WILD], inventory: { weight: 0.5, basePrice: 80, rarity: "COMMON" }, nutrition: { calories: 20, proteins: 2.1 }, assets: { icon: "icons/food/fungus_bolete_brown.png" } },
  { ...baseFungus, id: "fungus_butter", name: { ru: "Маслята", en: "Slippery Jack" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.SLIMY], inventory: { weight: 0.5, basePrice: 70, rarity: "COMMON" }, nutrition: { calories: 19, proteins: 2.4 }, assets: { icon: "icons/food/fungus_butter.png" } },
  { ...baseFungus, id: "fungus_chanterelle", name: { ru: "Лисички", en: "Chanterelles" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.NO_WORMS], inventory: { weight: 0.3, basePrice: 120, rarity: "UNCOMMON" }, nutrition: { calories: 19, proteins: 1.5 }, assets: { icon: "icons/food/fungus_chanterelle.png" } },
  { ...baseFungus, id: "fungus_honey", name: { ru: "Опята", en: "Honey Agaric" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.CLUSTER], inventory: { weight: 0.5, basePrice: 60, rarity: "COMMON" }, nutrition: { calories: 22, proteins: 2.2 }, assets: { icon: "icons/food/fungus_honey.png" } },
  { ...baseFungus, id: "fungus_saffron", name: { ru: "Рыжики", en: "Saffron Milk Cap" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.PICKLING], inventory: { weight: 0.5, basePrice: 90, rarity: "UNCOMMON" }, nutrition: { calories: 17, proteins: 1.9 }, assets: { icon: "icons/food/fungus_saffron.png" } },
  { ...baseFungus, id: "fungus_milk", name: { ru: "Грузди", en: "Milk Mushroom" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.BITTER_IF_RAW, TAGS.PICKLING], inventory: { weight: 1.0, basePrice: 80, rarity: "UNCOMMON" }, nutrition: { calories: 16, proteins: 1.8 }, assets: { icon: "icons/food/fungus_milk.png" } },
  { ...baseFungus, id: "fungus_russula", name: { ru: "Сыроежки", en: "Russula" }, tags: [...baseFungus.tags, TAGS.WILD, TAGS.FRAGILE], inventory: { weight: 0.3, basePrice: 40, rarity: "COMMON" }, nutrition: { calories: 15, proteins: 1.7 }, assets: { icon: "icons/food/fungus_russula.png" } },
  { ...baseFungus, id: "fungus_puffball", name: { ru: "Дождевик", en: "Puffball" }, tags: [...baseFungus.tags, TAGS.WILD], inventory: { weight: 0.2, basePrice: 30, rarity: "COMMON" }, nutrition: { calories: 27, proteins: 4.3 }, assets: { icon: "icons/food/fungus_puffball.png" } },

  // Магазинные (Store)
  { ...baseFungus, id: "fungus_champignon", name: { ru: "Шампиньоны", en: "Champignons" }, tags: [...baseFungus.tags, TAGS.SAFE, TAGS.CLEAN, TAGS.RAW_EDIBLE], inventory: { weight: 0.5, basePrice: 60, rarity: "COMMON" }, nutrition: { calories: 27, proteins: 4.3 }, assets: { icon: "icons/food/fungus_champignon.png" } },
  { ...baseFungus, id: "fungus_oyster", name: { ru: "Вешенки", en: "Oyster Mushrooms" }, tags: [...baseFungus.tags, TAGS.SAFE, TAGS.CLEAN], inventory: { weight: 0.5, basePrice: 70, rarity: "COMMON" }, nutrition: { calories: 33, proteins: 3.3 }, assets: { icon: "icons/food/fungus_oyster.png" } },

  // --- ФРУКТЫ (Fruits) ---

  // Сад (Garden/Local)
  { ...baseFruit, id: "fruit_apple", name: { ru: "Яблоки", en: "Apples" }, inventory: { weight: 1.0, basePrice: 25, rarity: "COMMON" }, nutrition: { calories: 52, hydration: 86, carbs: 14 }, assets: { icon: "icons/food/fruit_apple.png" } },
  { ...baseFruit, id: "fruit_pear", name: { ru: "Груши", en: "Pears" }, inventory: { weight: 1.0, basePrice: 40, rarity: "COMMON" }, nutrition: { calories: 57, hydration: 84, carbs: 15 }, assets: { icon: "icons/food/fruit_pear.png" } },
  { ...baseFruit, id: "fruit_cherry_sour", name: { ru: "Вишни", en: "Sour Cherries" }, tags: [...baseFruit.tags, TAGS.SOUR, TAGS.PITTED_FRUIT], inventory: { weight: 1.0, basePrice: 60 }, nutrition: { calories: 50, carbs: 12 }, assets: { icon: "icons/food/fruit_cherry.png" } },
  { ...baseFruit, id: "fruit_cherry_sweet", name: { ru: "Черешни", en: "Sweet Cherries" }, tags: [...baseFruit.tags, TAGS.SWEET, TAGS.PITTED_FRUIT], inventory: { weight: 1.0, basePrice: 100 }, nutrition: { calories: 63, carbs: 16 }, assets: { icon: "icons/food/fruit_sweet_cherry.png" } },
  { ...baseFruit, id: "fruit_plum", name: { ru: "Сливы", en: "Plums" }, tags: [...baseFruit.tags, TAGS.PITTED_FRUIT], inventory: { weight: 1.0, basePrice: 35 }, nutrition: { calories: 46, carbs: 11 }, assets: { icon: "icons/food/fruit_plum.png" } },
  { ...baseFruit, id: "fruit_cherry_plum", name: { ru: "Алыча", en: "Cherry Plum" }, tags: [...baseFruit.tags, TAGS.SOUR], inventory: { weight: 1.0, basePrice: 20 }, nutrition: { calories: 30, carbs: 7 }, assets: { icon: "icons/food/fruit_alyche.png" } },
  { ...baseFruit, id: "fruit_apricot", name: { ru: "Абрикосы", en: "Apricots" }, tags: [...baseFruit.tags, TAGS.PITTED_FRUIT], inventory: { weight: 1.0, basePrice: 60 }, nutrition: { calories: 48, carbs: 11 }, assets: { icon: "icons/food/fruit_apricot.png" } },
  { ...baseFruit, id: "fruit_peach", name: { ru: "Персики", en: "Peaches" }, tags: [...baseFruit.tags, TAGS.JUICY], inventory: { weight: 1.0, basePrice: 70 }, nutrition: { calories: 39, carbs: 9 }, assets: { icon: "icons/food/fruit_peach.png" } },
  { ...baseFruit, id: "fruit_mulberry", name: { ru: "Шелковица", en: "Mulberry" }, tags: [...baseFruit.tags, TAGS.STAINING], inventory: { weight: 0.5, basePrice: 40 }, nutrition: { calories: 43, carbs: 10 }, assets: { icon: "icons/food/fruit_mulberry.png" } },

  // Магазин (Store/Exotic)
  { ...baseFruit, id: "fruit_banana", name: { ru: "Бананы", en: "Bananas" }, tags: [...baseFruit.tags, TAGS.SOFT, TAGS.PEEL], inventory: { weight: 1.0, basePrice: 60 }, nutrition: { calories: 89, carbs: 23 }, assets: { icon: "icons/food/fruit_banana.png" } },
  { ...baseFruit, id: "fruit_lemon", name: { ru: "Лимон", en: "Lemon" }, tags: [...baseFruit.tags, TAGS.SOUR, TAGS.ACID, TAGS.VITAMIN_C], inventory: { weight: 0.2, basePrice: 15 }, nutrition: { calories: 29, carbs: 9 }, assets: { icon: "icons/food/fruit_lemon.png" } },
  { ...baseFruit, id: "fruit_orange", name: { ru: "Апельсины", en: "Oranges" }, tags: [...baseFruit.tags, TAGS.VITAMIN_C, TAGS.PEEL], inventory: { weight: 1.0, basePrice: 70 }, nutrition: { calories: 47, carbs: 12 }, assets: { icon: "icons/food/fruit_orange.png" } },
  { ...baseFruit, id: "fruit_mandarin", name: { ru: "Мандарины", en: "Mandarins" }, tags: [...baseFruit.tags, TAGS.VITAMIN_C, TAGS.EASY_PEEL], inventory: { weight: 1.0, basePrice: 60 }, nutrition: { calories: 53, carbs: 13 }, assets: { icon: "icons/food/fruit_mandarin.png" } },
  { ...baseFruit, id: "fruit_grapefruit", name: { ru: "Грейпфрут", en: "Grapefruit" }, tags: [...baseFruit.tags, TAGS.BITTER, TAGS.VITAMIN_C], inventory: { weight: 0.4, basePrice: 30 }, nutrition: { calories: 42, carbs: 11 }, assets: { icon: "icons/food/fruit_grapefruit.png" } },
  { ...baseFruit, id: "fruit_kiwi", name: { ru: "Киви", en: "Kiwi" }, tags: [...baseFruit.tags, TAGS.VITAMIN_C], inventory: { weight: 1.0, basePrice: 100 }, nutrition: { calories: 61, carbs: 15 }, assets: { icon: "icons/food/fruit_kiwi.png" } },
  { ...baseFruit, id: "fruit_pineapple", name: { ru: "Ананас", en: "Pineapple" }, tags: [...baseFruit.tags, TAGS.ACID, TAGS.HARD_SKIN], inventory: { weight: 1.5, basePrice: 150 }, nutrition: { calories: 50, carbs: 13 }, assets: { icon: "icons/food/fruit_pineapple.png" } },
  { ...baseFruit, id: "fruit_pomegranate", name: { ru: "Гранат", en: "Pomegranate" }, tags: [...baseFruit.tags, TAGS.SEEDS, TAGS.HARD_SKIN], inventory: { weight: 0.4, basePrice: 50 }, nutrition: { calories: 83, carbs: 19 }, assets: { icon: "icons/food/fruit_pomegranate.png" } },
  { ...baseFruit, id: "fruit_persimmon", name: { ru: "Хурма", en: "Persimmon" }, tags: [...baseFruit.tags, TAGS.ASTRINGENT], inventory: { weight: 0.2, basePrice: 30 }, nutrition: { calories: 127, carbs: 34 }, assets: { icon: "icons/food/fruit_persimmon.png" } },
  { ...baseFruit, id: "fruit_avocado", name: { ru: "Авокадо", en: "Avocado" }, tags: [...baseFruit.tags, TAGS.FAT, TAGS.VEG], inventory: { weight: 0.2, basePrice: 40 }, nutrition: { calories: 160, fats: 15, carbs: 9 }, assets: { icon: "icons/food/fruit_avocado.png" } },
  { ...baseFruit, id: "fruit_coconut", name: { ru: "Кокос", en: "Coconut" }, tags: [...baseFruit.tags, TAGS.FAT, TAGS.HARD_SHELL, TAGS.TOOL_REQUIRED], inventory: { weight: 0.6, basePrice: 60 }, nutrition: { calories: 354, fats: 33, carbs: 15 }, assets: { icon: "icons/food/fruit_coconut.png" } },
  { ...baseFruit, id: "fruit_olives", name: { ru: "Оливки/Маслины", en: "Olives" }, tags: [...baseFruit.tags, TAGS.FAT, TAGS.SALTY], packaging: { type: "GLASS_JAR", returnItem: "glass_jar_small" }, inventory: { weight: 0.3, basePrice: 60 }, nutrition: { calories: 115, fats: 11 }, assets: { icon: "icons/food/fruit_olives.png" } },

  // --- ЯГОДЫ (Berries) ---

  // Сад
  { ...baseBerry, id: "berry_strawberry", name: { ru: "Клубника", en: "Strawberry" }, inventory: { weight: 0.5, basePrice: 60 }, nutrition: { calories: 33, carbs: 8 }, assets: { icon: "icons/food/berry_strawberry.png" } },
  { ...baseBerry, id: "berry_raspberry", name: { ru: "Малина", en: "Raspberry" }, tags: [...baseBerry.tags, TAGS.FRAGILE, TAGS.MEDICINAL], inventory: { weight: 0.5, basePrice: 100 }, nutrition: { calories: 53, carbs: 12 }, assets: { icon: "icons/food/berry_raspberry.png" } },
  { ...baseBerry, id: "berry_currant_black", name: { ru: "Смородина черная", en: "Blackcurrant" }, tags: [...baseBerry.tags, TAGS.VITAMIN_C], inventory: { weight: 0.5, basePrice: 50 }, nutrition: { calories: 63, carbs: 15 }, assets: { icon: "icons/food/berry_currant_black.png" } },
  { ...baseBerry, id: "berry_currant_red", name: { ru: "Смородина красная", en: "Redcurrant" }, tags: [...baseBerry.tags, TAGS.SOUR], inventory: { weight: 0.5, basePrice: 40 }, nutrition: { calories: 56, carbs: 14 }, assets: { icon: "icons/food/berry_currant_red.png" } },
  { ...baseBerry, id: "berry_currant_white", name: { ru: "Смородина белая", en: "Whitecurrant" }, inventory: { weight: 0.5, basePrice: 40 }, nutrition: { calories: 56, carbs: 14 }, assets: { icon: "icons/food/berry_currant_white.png" } },
  { ...baseBerry, id: "berry_gooseberry", name: { ru: "Крыжовник", en: "Gooseberry" }, inventory: { weight: 0.5, basePrice: 40 }, nutrition: { calories: 44, carbs: 10 }, assets: { icon: "icons/food/berry_gooseberry.png" } },
  { ...baseBerry, id: "berry_grapes", name: { ru: "Виноград", en: "Grapes" }, tags: [...baseBerry.tags, TAGS.JUICY], inventory: { weight: 1.0, basePrice: 80 }, nutrition: { calories: 69, carbs: 18 }, assets: { icon: "icons/food/berry_grapes.png" } },
  { ...baseBerry, id: "berry_chokeberry", name: { ru: "Черноплодная рябина", en: "Chokeberry" }, tags: [...baseBerry.tags, TAGS.ASTRINGENT, TAGS.MEDICINAL], inventory: { weight: 0.5, basePrice: 30 }, nutrition: { calories: 55, carbs: 14 }, assets: { icon: "icons/food/berry_chokeberry.png" } },

  // Лес
  { ...baseBerry, id: "berry_wild_strawberry", name: { ru: "Земляника лесная", en: "Wild Strawberry" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.AROMATIC], inventory: { weight: 0.2, basePrice: 100, rarity: "RARE" }, nutrition: { calories: 41, carbs: 8 }, assets: { icon: "icons/food/berry_wild_strawberry.png" } },
  { ...baseBerry, id: "berry_blackberry", name: { ru: "Ежевика", en: "Blackberry" }, tags: [...baseBerry.tags, TAGS.WILD], inventory: { weight: 0.5, basePrice: 80 }, nutrition: { calories: 43, carbs: 10 }, assets: { icon: "icons/food/berry_blackberry.png" } },
  { ...baseBerry, id: "berry_bilberry", name: { ru: "Черника", en: "Bilberry" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.STAINING], inventory: { weight: 0.5, basePrice: 120 }, nutrition: { calories: 57, carbs: 14 }, assets: { icon: "icons/food/berry_bilberry.png" } },
  { ...baseBerry, id: "berry_blueberry", name: { ru: "Голубика", en: "Blueberry" }, tags: [...baseBerry.tags, TAGS.WILD], inventory: { weight: 0.5, basePrice: 150 }, nutrition: { calories: 57, carbs: 14 }, assets: { icon: "icons/food/berry_blueberry.png" } },
  { ...baseBerry, id: "berry_lingonberry", name: { ru: "Брусника", en: "Lingonberry" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.ACID, TAGS.LONG_LIFE], inventory: { weight: 0.5, basePrice: 90 }, nutrition: { calories: 46, carbs: 8 }, assets: { icon: "icons/food/berry_lingonberry.png" } },
  { ...baseBerry, id: "berry_cranberry", name: { ru: "Клюква", en: "Cranberry" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.ACID, TAGS.LONG_LIFE, TAGS.MEDICINAL], inventory: { weight: 0.5, basePrice: 100 }, nutrition: { calories: 26, carbs: 4 }, assets: { icon: "icons/food/berry_cranberry.png" } },
  { ...baseBerry, id: "berry_seabuckthorn", name: { ru: "Облепиха", en: "Sea Buckthorn" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.SOUR, TAGS.MEDICINAL], inventory: { weight: 0.5, basePrice: 80 }, nutrition: { calories: 82, fats: 7, carbs: 5 }, assets: { icon: "icons/food/berry_seabuckthorn.png" } },
  { ...baseBerry, id: "berry_viburnum", name: { ru: "Калина", en: "Viburnum" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.BITTER, TAGS.MEDICINAL], inventory: { weight: 0.5, basePrice: 30 }, nutrition: { calories: 26, carbs: 7 }, assets: { icon: "icons/food/berry_viburnum.png" } },
  { ...baseBerry, id: "berry_rosehip", name: { ru: "Шиповник", en: "Rose Hip" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.DRY_REQUIRED, TAGS.VITAMIN_C], inventory: { weight: 0.3, basePrice: 40 }, nutrition: { calories: 109, carbs: 22 }, assets: { icon: "icons/food/berry_rosehip.png" } },
  { ...baseBerry, id: "berry_dogwood", name: { ru: "Кизил", en: "Dogwood" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.SOUR], inventory: { weight: 0.5, basePrice: 50 }, nutrition: { calories: 44, carbs: 10 }, assets: { icon: "icons/food/berry_dogwood.png" } },
  { ...baseBerry, id: "berry_hawthorn", name: { ru: "Боярышник", en: "Hawthorn" }, tags: [...baseBerry.tags, TAGS.WILD, TAGS.MEDICINAL], inventory: { weight: 0.3, basePrice: 20 }, nutrition: { calories: 52, carbs: 14 }, assets: { icon: "icons/food/berry_hawthorn.png" } },

  // --- БАХЧЕВЫЕ (Melons) ---

  {
    id: "melon_watermelon",
    internalName: "Watermelon",
    name: { ru: "Арбуз", en: "Watermelon" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.FRUIT, TAGS.SWEET, TAGS.JUICY, TAGS.HEAVY],
    inventory: { weight: 7.0, basePrice: 100, rarity: "COMMON" },
    packaging: { type: "RIND", returnItem: "compost", maxServings: 14, currentServings: 14, isDivisible: true },
    nutrition: { calories: 30, hydration: 92, carbs: 8 },
    assets: { icon: "icons/food/melon_watermelon.png" }
  },
  {
    id: "melon_sweet",
    internalName: "Melon",
    name: { ru: "Дыня", en: "Melon" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.FRUIT, TAGS.SWEET, TAGS.JUICY],
    inventory: { weight: 2.0, basePrice: 80, rarity: "COMMON" },
    packaging: { type: "RIND", returnItem: "compost", maxServings: 8, currentServings: 8, isDivisible: true },
    nutrition: { calories: 34, hydration: 90, carbs: 8 },
    assets: { icon: "icons/food/melon_sweet.png" }
  },

  // --- ОРЕХИ (Nuts) ---

  { ...baseNut, id: "nut_walnut", name: { ru: "Грецкий орех", en: "Walnut" }, tags: [...baseNut.tags, TAGS.TOOL_REQUIRED], inventory: { weight: 1.0, basePrice: 150 }, nutrition: { calories: 654, fats: 65, proteins: 15 }, assets: { icon: "icons/food/nut_walnut.png" } },
  { ...baseNut, id: "nut_hazelnut", name: { ru: "Лещина (Фундук)", en: "Hazelnut" }, tags: [...baseNut.tags, TAGS.TOOL_REQUIRED], inventory: { weight: 0.5, basePrice: 200 }, nutrition: { calories: 628, fats: 61, proteins: 15 }, assets: { icon: "icons/food/nut_hazelnut.png" } },
  { ...baseNut, id: "nut_peanut", name: { ru: "Арахис", en: "Peanuts" }, tags: [...baseNut.tags, TAGS.SALTED, TAGS.ROASTED], inventory: { weight: 0.2, basePrice: 30 }, nutrition: { calories: 567, fats: 49, proteins: 26 }, assets: { icon: "icons/food/nut_peanut.png" } }

];