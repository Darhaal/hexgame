import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (MEAT TEMPLATES)
// =============================================================================

// 1. СЫРОЕ МЯСО (Опасное, портится быстро)
const baseMeatRaw = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.MEAT, TAGS.RAW, TAGS.PERISHABLE, TAGS.MESSY, TAGS.BOIL_REQUIRED], // MESSY - пачкает кровью
  packaging: {
    type: "PLASTIC_WRAP", // Пленка или кулек
    isOpen: true,
    returnItem: "trash_plastic",
    maxServings: 1,
    currentServings: 1,
    isDivisible: true // Можно отрезать кусок
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 86400,    // 24 часа (очень быстро тухнет)
    shelfLifeSealed: 259200, // 3 дня в вакууме
    aging: { isAgeable: true, resultId: "rotten_meat" } // Гниет
  },
  thermodynamics: {
    currentTemp: 15,
    specificHeat: 3.5,
    cookingPoint: 70, // Температура готовности мяса
    burningPoint: 180
  },
  risks: [
    { type: "SALMONELLA", chanceBase: 0.15, chancePerDayExpired: 0.8, severity: "MAJOR" },
    { type: "PARASITES", chanceBase: 0.1, severity: "MAJOR" }
  ]
};

// 2. САЛО (Жир, Энергия, Долго хранится)
const baseSalo = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.FAT, TAGS.HIGH_CALORIE, TAGS.FUEL, TAGS.MELTABLE], // Можно топить жир
  inventory: { maxStack: 5, rarity: "COMMON" },
  thermodynamics: {
    currentTemp: 15,
    specificHeat: 2.0, // Жир греется быстрее воды
    meltingPoint: 30,  // Тает в руках
    burningPoint: 200  // Дымит
  },
  lifecycle: {
    creationDate: 0,
    shelfLifeOpen: 604800, // 7 дней (свежее)
    shelfLifeSealed: 2592000 // Месяц (соленое)
  },
  risks: []
};

// 3. КОЛБАСЫ ВАРЕНЫЕ (Как молоко - портятся быстро)
const baseSausageBoiled = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.MEAT, TAGS.COOKED, TAGS.READY_TO_EAT, TAGS.SOFT],
  packaging: { type: "SYNTHETIC_CASING", isOpen: false, returnItem: "trash_plastic", isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 172800,  // 48 часов
    shelfLifeSealed: 1209600 // 14 дней
  },
  risks: [{ type: "FOOD_POISONING", chanceBase: 0.05, chancePerDayExpired: 0.9, severity: "MEDIUM" }]
};

// 4. КОЛБАСЫ КОПЧЕНЫЕ (Долго хранятся)
const baseSausageSmoked = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.MEAT, TAGS.SMOKED, TAGS.CURED, TAGS.READY_TO_EAT, TAGS.LONG_LIFE],
  packaging: { type: "NATURAL_CASING", isOpen: false, isDivisible: true },
  lifecycle: {
    shelfLifeOpen: 2592000,   // Месяц
    shelfLifeSealed: 7776000  // 3 месяца
  }
};

// =============================================================================
// СПИСОК: САЛО, МЯСО, КОЛБАСЫ
// Нутрициология на 100г.
// =============================================================================

export const meatItems = [

  // --- САЛО (Fat) ---

  {
    ...baseSalo,
    id: "salo_fresh",
    name: { ru: "Сало свежее", en: "Fresh Salo" },
    tags: [...baseSalo.tags, TAGS.RAW], // Нужно солить или жарить
    // 1 кг, ~150 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 150, rarity: "COMMON" },
    nutrition: { calories: 797, hydration: 0, proteins: 2.4, fats: 89, carbs: 0 },
    assets: { icon: "icons/food/salo_fresh.png" }
  },

  {
    ...baseSalo,
    id: "salo_salted",
    name: { ru: "Сало соленое", en: "Salted Salo" },
    tags: [...baseSalo.tags, TAGS.CURED, TAGS.SALTY, TAGS.READY_TO_EAT],
    // 1 кг, ~200 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 200, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 2592000 }, // Месяц без холодильника
    nutrition: { calories: 800, hydration: -5, proteins: 2.4, fats: 89, carbs: 0 },
    assets: { icon: "icons/food/salo_salted.png" }
  },

  {
    ...baseSalo,
    id: "salo_smoked",
    name: { ru: "Сало копченое", en: "Smoked Salo" },
    tags: [...baseSalo.tags, TAGS.SMOKED, TAGS.READY_TO_EAT, TAGS.STRONG_SMELL],
    // 1 кг, ~250 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 250, rarity: "UNCOMMON" },
    nutrition: { calories: 810, hydration: -5, proteins: 2.4, fats: 89, carbs: 0 },
    assets: { icon: "icons/food/salo_smoked.png" }
  },

  {
    ...baseSalo,
    id: "salo_podcherevok",
    name: { ru: "Подчеревок", en: "Pork Belly" },
    tags: [...baseSalo.tags, TAGS.MEAT, TAGS.RAW], // С прослойкой мяса
    // 1 кг, ~220 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 220, rarity: "COMMON" },
    // Меньше жира, больше белка
    nutrition: { calories: 510, hydration: 0, proteins: 10, fats: 53, carbs: 0 },
    assets: { icon: "icons/food/podcherevok.png" }
  },

  // --- СЫРОЕ МЯСО (Raw Meat) ---

  {
    ...baseMeatRaw,
    id: "meat_pork",
    name: { ru: "Свинина (Мякоть)", en: "Pork Meat" },
    tags: [...baseMeatRaw.tags, TAGS.FAT],
    // 1 кг, ~190 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 190, rarity: "COMMON" },
    nutrition: { calories: 242, hydration: 0, proteins: 17, fats: 19, carbs: 0 },
    assets: { icon: "icons/food/meat_pork.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_beef",
    name: { ru: "Говядина", en: "Beef" },
    tags: [...baseMeatRaw.tags, TAGS.RED_MEAT],
    // 1 кг, ~280 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 280, rarity: "COMMON" },
    nutrition: { calories: 250, hydration: 0, proteins: 26, fats: 15, carbs: 0 },
    assets: { icon: "icons/food/meat_beef.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_lamb",
    name: { ru: "Баранина", en: "Lamb" },
    tags: [...baseMeatRaw.tags, TAGS.STRONG_SMELL],
    // 1 кг, ~350 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 350, rarity: "RARE" },
    nutrition: { calories: 294, hydration: 0, proteins: 16, fats: 25, carbs: 0 },
    assets: { icon: "icons/food/meat_lamb.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_chicken_whole",
    name: { ru: "Курятина (Тушка)", en: "Whole Chicken" },
    tags: [...baseMeatRaw.tags, TAGS.POULTRY, TAGS.BONE, TAGS.WHOLE],
    // Тушка ~1.5 кг, ~120 грн
    inventory: { maxStack: 1, weight: 1.5, basePrice: 120, rarity: "COMMON" },
    nutrition: { calories: 190, hydration: 0, proteins: 20, fats: 12, carbs: 0 },
    assets: { icon: "icons/food/chicken_whole.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_chicken_legs",
    name: { ru: "Куриные окорочка", en: "Chicken Legs" },
    tags: [...baseMeatRaw.tags, TAGS.POULTRY, TAGS.BONE],
    // 1 кг, ~90 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 90, rarity: "COMMON" },
    nutrition: { calories: 210, hydration: 0, proteins: 18, fats: 15, carbs: 0 },
    assets: { icon: "icons/food/chicken_legs.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_ribs",
    name: { ru: "Ребрышки", en: "Pork Ribs" },
    tags: [...baseMeatRaw.tags, TAGS.BONE, TAGS.GELLING], // Для супа
    // 1 кг, ~170 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 170, rarity: "COMMON" },
    nutrition: { calories: 320, hydration: 0, proteins: 15, fats: 29, carbs: 0 },
    assets: { icon: "icons/food/meat_ribs.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_minced",
    name: { ru: "Фарш ассорти", en: "Minced Meat" },
    tags: [...baseMeatRaw.tags, TAGS.MINCED, TAGS.SOFT], // Не нужно жевать
    // 1 кг, ~160 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 160, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 43200 }, // Фарш портится за 12 часов
    nutrition: { calories: 250, hydration: 0, proteins: 17, fats: 20, carbs: 0 },
    assets: { icon: "icons/food/meat_minced.png" }
  },

  {
    ...baseMeatRaw,
    id: "meat_shashlik_raw",
    name: { ru: "Шашлык (Маринованный)", en: "Marinated Shashlik" },
    tags: [...baseMeatRaw.tags, TAGS.ACID, TAGS.SPICY, TAGS.ONION], // Маринад
    // Ведерко 2 кг, ~450 грн
    inventory: { maxStack: 1, weight: 2.0, basePrice: 450, rarity: "COMMON" },
    packaging: { type: "PLASTIC_BUCKET", returnItem: "bucket_plastic", maxServings: 6 },
    lifecycle: { shelfLifeOpen: 259200 }, // 3 дня благодаря уксусу
    nutrition: { calories: 230, hydration: 0, proteins: 16, fats: 18, carbs: 1 },
    assets: { icon: "icons/food/shashlik_raw.png" }
  },

  // --- ГОТОВОЕ МЯСО (Cooked/Deli) ---

  {
    id: "meat_buzhenina",
    name: { ru: "Буженина", en: "Baked Pork" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.MEAT, TAGS.COOKED, TAGS.READY_TO_EAT, TAGS.FAT],
    // 500г, ~200 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 200, rarity: "UNCOMMON" },
    lifecycle: { shelfLifeOpen: 259200 }, // 3 дня
    nutrition: { calories: 350, proteins: 15, fats: 30 },
    assets: { icon: "icons/food/buzhenina.png" }
  },

  {
    id: "meat_balyk",
    name: { ru: "Балык", en: "Cured Loin" },
    category: "FOOD",
    tags: [TAGS.MEAT, TAGS.CURED, TAGS.SMOKED, TAGS.READY_TO_EAT, TAGS.DELICACY],
    // 300г, ~180 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 180, rarity: "RARE" },
    nutrition: { calories: 150, proteins: 25, fats: 5 }, // Диетическое
    assets: { icon: "icons/food/balyk.png" }
  },

  {
    id: "meat_chicken_grilled",
    name: { ru: "Курица гриль", en: "Grilled Chicken" },
    category: "FOOD",
    tags: [TAGS.MEAT, TAGS.COOKED, TAGS.READY_TO_EAT, TAGS.BONE, TAGS.WHOLE, TAGS.HOT],
    packaging: { type: "FOIL_BAG", returnItem: "trash_foil" },
    // Тушка 1.2 кг, ~250 грн
    inventory: { maxStack: 1, weight: 1.2, basePrice: 250, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 86400 }, // Сутки
    nutrition: { calories: 220, proteins: 20, fats: 15 },
    assets: { icon: "icons/food/chicken_grilled.png" }
  },

  // --- ПТИЦА / ЯЙЦА ---

  {
    id: "egg_chicken",
    name: { ru: "Яйца куриные (10 шт)", en: "Chicken Eggs" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.EGG, TAGS.RAW, TAGS.FRAGILE, TAGS.SHELL, TAGS.EMULSIFIER],
    packaging: { type: "CARTON_BOX", returnItem: "trash_cardboard", maxServings: 10, isDivisible: true },
    // Упаковка 10 шт, вес ~600г, ~60 грн
    inventory: { maxStack: 2, weight: 0.6, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 157, proteins: 12.7, fats: 11.5, carbs: 0.7 },
    risks: [{ type: "SALMONELLA", chanceBase: 0.1, severity: "MEDIUM" }],
    assets: { icon: "icons/food/eggs_chicken.png" }
  },

  {
    id: "egg_quail",
    name: { ru: "Яйца перепелиные (20 шт)", en: "Quail Eggs" },
    category: "FOOD",
    tags: [TAGS.EGG, TAGS.RAW, TAGS.FRAGILE, TAGS.SHELL, TAGS.HEALTHY], // Считаются полезнее
    packaging: { type: "PLASTIC_BOX", maxServings: 20, isDivisible: true },
    // Упаковка 20 шт, вес ~240г, ~50 грн
    inventory: { maxStack: 5, weight: 0.24, basePrice: 50, rarity: "COMMON" },
    nutrition: { calories: 168, proteins: 11.9, fats: 13.1, carbs: 0.6 },
    // Меньше риск сальмонеллы
    risks: [{ type: "SALMONELLA", chanceBase: 0.01, severity: "MINOR" }],
    assets: { icon: "icons/food/eggs_quail.png" }
  },

  // --- КОЛБАСЫ ВАРЕНЫЕ (Boiled Sausages) ---

  {
    ...baseSausageBoiled,
    id: "sausage_doctor",
    name: { ru: "Колбаса Докторская", en: "Doctor's Sausage" },
    tags: [...baseSausageBoiled.tags, TAGS.DIET], // Типа диетическая
    // 500г палка, ~140 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 140, rarity: "COMMON" },
    nutrition: { calories: 250, proteins: 12, fats: 22 },
    assets: { icon: "icons/food/sausage_doctor.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sausage_milk",
    name: { ru: "Колбаса Молочная", en: "Milk Sausage" },
    // 500г палка, ~130 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 130, rarity: "COMMON" },
    nutrition: { calories: 240, proteins: 11, fats: 21 },
    assets: { icon: "icons/food/sausage_milk.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sausage_amateur",
    name: { ru: "Колбаса Любительская", en: "Amateur Sausage" },
    tags: [...baseSausageBoiled.tags, TAGS.FAT], // С жирком
    // 500г палка, ~135 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 135, rarity: "COMMON" },
    nutrition: { calories: 300, proteins: 12, fats: 28 },
    assets: { icon: "icons/food/sausage_amateur.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sausage_liver",
    name: { ru: "Ливерная колбаса", en: "Liver Sausage" },
    tags: [...baseSausageBoiled.tags, TAGS.PASTE, TAGS.CHEAP],
    // 300г кольцо, ~40 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 326, proteins: 10, fats: 30 },
    assets: { icon: "icons/food/sausage_liver.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sausage_blood",
    name: { ru: "Кровянка", en: "Blood Sausage" },
    tags: [TAGS.MEAT, TAGS.COOKED, TAGS.GRAIN, TAGS.IRON], // Гречка+Кровь
    packaging: { type: "NATURAL_CASING" },
    // 1 кг, ~150 грн
    inventory: { maxStack: 2, weight: 1.0, basePrice: 150, rarity: "UNCOMMON" },
    nutrition: { calories: 300, proteins: 15, fats: 25, carbs: 10 },
    assets: { icon: "icons/food/sausage_blood.png" }
  },

  // --- КОЛБАСЫ КОПЧЕНЫЕ (Smoked Sausages) ---

  {
    ...baseSausageSmoked,
    id: "sausage_salami",
    name: { ru: "Колбаса Салями", en: "Salami" },
    tags: [...baseSausageSmoked.tags, TAGS.SPICY],
    // 350г палка, ~200 грн
    inventory: { maxStack: 5, weight: 0.35, basePrice: 200, rarity: "COMMON" },
    nutrition: { calories: 550, proteins: 20, fats: 50 },
    assets: { icon: "icons/food/sausage_salami.png" }
  },

  {
    ...baseSausageSmoked,
    id: "sausage_krakow",
    name: { ru: "Колбаса Краковская", en: "Krakow Sausage" },
    tags: [...baseSausageSmoked.tags, TAGS.FAT, TAGS.CURVED], // Кольцом
    // 400г кольцо, ~220 грн
    inventory: { maxStack: 5, weight: 0.4, basePrice: 220, rarity: "COMMON" },
    nutrition: { calories: 450, proteins: 16, fats: 42 },
    assets: { icon: "icons/food/sausage_krakow.png" }
  },

  {
    ...baseSausageSmoked,
    id: "sausage_moscow",
    name: { ru: "Колбаса Московская", en: "Moscow Sausage" },
    tags: [...baseSausageSmoked.tags, TAGS.DRY_CURED, TAGS.HARD], // Сырокопченая, твердая
    // 300г палка, ~350 грн (дорогая)
    inventory: { maxStack: 5, weight: 0.3, basePrice: 350, rarity: "RARE" },
    lifecycle: { shelfLifeOpen: 7776000 }, // 3 месяца
    nutrition: { calories: 480, proteins: 25, fats: 42 },
    assets: { icon: "icons/food/sausage_moscow.png" }
  },

  // --- СОСИСКИ И САРДЕЛЬКИ (Wieners) ---

  {
    ...baseSausageBoiled,
    id: "wiener_milk",
    name: { ru: "Сосиски Молочные", en: "Milk Wieners" },
    packaging: { ...baseSausageBoiled.packaging, maxServings: 10, currentServings: 10 },
    // Пачка 350г (10 шт маленьких), ~90 грн
    inventory: { maxStack: 5, weight: 0.35, basePrice: 90, rarity: "COMMON" },
    nutrition: { calories: 260, proteins: 11, fats: 24 },
    assets: { icon: "icons/food/wiener_milk.png" }
  },

  {
    ...baseSausageBoiled,
    id: "wiener_hunter",
    name: { ru: "Сосиски Охотничьи", en: "Hunter's Sausages" },
    tags: [...baseSausageSmoked.tags, TAGS.SPICY, TAGS.THIN], // Они копченые, а не вареные
    lifecycle: { shelfLifeOpen: 1209600 }, // 2 недели
    // Пачка 300г, ~120 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 120, rarity: "COMMON" },
    nutrition: { calories: 480, proteins: 20, fats: 45 },
    assets: { icon: "icons/food/wiener_hunter.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sardelka_school",
    name: { ru: "Сардельки Школьные", en: "School Sardelki" },
    // Толстые сосиски
    packaging: { ...baseSausageBoiled.packaging, maxServings: 6 },
    // Вес 500г, ~100 грн
    inventory: { maxStack: 5, weight: 0.5, basePrice: 100, rarity: "COMMON" },
    nutrition: { calories: 230, proteins: 10, fats: 20 },
    assets: { icon: "icons/food/sardelka_school.png" }
  },

  {
    ...baseSausageBoiled,
    id: "sardelka_shpikachki",
    name: { ru: "Шпикачки", en: "Shpikachki" },
    tags: [...baseSausageBoiled.tags, TAGS.FAT, TAGS.JUICY], // С кусочками сала
    inventory: { maxStack: 5, weight: 0.5, basePrice: 120, rarity: "COMMON" },
    nutrition: { calories: 350, proteins: 10, fats: 33 },
    assets: { icon: "icons/food/shpikachki.png" }
  }

];