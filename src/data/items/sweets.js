import { TAGS } from "../itemtags";

// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (SWEETS TEMPLATES)
// =============================================================================

// 1. СУХОЕ ПЕЧЕНЬЕ / ВАФЛИ
const baseCookie = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.GRAIN, TAGS.SWEET, TAGS.DRY, TAGS.READY_TO_EAT, TAGS.SNACK],
  packaging: {
    type: "FLOW_PACK",
    isOpen: false,
    returnItem: "trash_wrapper",
    maxServings: 10,
    currentServings: 10,
    isDivisible: true
  },
  lifecycle: {
    shelfLifeOpen: 2592000,   // 30 дней (сыреет)
    shelfLifeSealed: 15768000 // 6 месяцев
  },
  thermodynamics: {
    currentTemp: 20,
    cookingPoint: 0,
    burningPoint: 180
  },
  risks: []
};

// 2. ШОКОЛАД И БАТОНЧИКИ
const baseChoco = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.SWEET, TAGS.SUGAR, TAGS.CHOCOLATE, TAGS.HIGH_CALORIE, TAGS.MELTABLE], // Плавится
  packaging: { type: "FOIL_WRAP", returnItem: "trash_wrapper", isDivisible: true },
  lifecycle: { shelfLifeOpen: 7776000, shelfLifeSealed: 31536000 }, // Год
  thermodynamics: { meltingPoint: 28 } // Тает в кармане
};

// 3. КОНФЕТЫ (Карамель/Леденцы)
const baseCandy = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.SWEET, TAGS.SUGAR, TAGS.HARD, TAGS.LONG_LIFE],
  packaging: { type: "SACHET", isDivisible: false }, // Обычно поштучно или пачкой
  lifecycle: { shelfLifeOpen: 15768000 },
  inventory: { weight: 0.25 } // Пачка 250г
};

// 4. МОРОЖЕНОЕ
const baseIceCream = {
  category: "FOOD",
  physicalState: "SOLID", // Пока заморожено
  tags: [TAGS.DAIRY, TAGS.SWEET, TAGS.FROZEN, TAGS.MELTABLE, TAGS.JOY], // JOY - дает много счастья
  packaging: { type: "FLOW_PACK", returnItem: "trash_wrapper", maxServings: 1, isDivisible: false },
  lifecycle: {
    shelfLifeOpen: 3600,      // 1 час в тепле (тает)
    shelfLifeSealed: 15768000 // Полгода в морозилке
  },
  thermodynamics: {
    currentTemp: -18,
    specificHeat: 2.0,
    meltingPoint: -5, // Тает при > -5
    cookingPoint: 100
  }
};

// =============================================================================
// СПИСОК ПРЕДМЕТОВ
// Нутрициология на 100г.
// =============================================================================

export const sweetsItems = [

  // --- ПЕЧЕНЬЕ (Cookies) ---

  {
    ...baseCookie,
    id: "cookie_maria",
    internalName: "Maria",
    name: { ru: "Печенье 'Мария'", en: "Maria Biscuits" },
    tags: [...baseCookie.tags, TAGS.DIET], // Галетное
    // Пачка 160г, ~20 грн
    inventory: { maxStack: 10, weight: 0.16, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 400, proteins: 8, fats: 8, carbs: 75 },
    assets: { icon: "icons/food/cookie_maria.png" }
  },

  {
    ...baseCookie,
    id: "cookie_oreo",
    internalName: "Oreo",
    name: { ru: "Печенье 'Орео'", en: "Oreo" },
    tags: [...baseCookie.tags, TAGS.CHOCOLATE],
    // Пачка 95г, ~35 грн
    inventory: { maxStack: 10, weight: 0.095, basePrice: 35, rarity: "COMMON" },
    nutrition: { calories: 480, proteins: 5, fats: 20, carbs: 69 },
    assets: { icon: "icons/food/cookie_oreo.png" }
  },

  {
    ...baseCookie,
    id: "cookie_baked_milk",
    internalName: "ToplenoeMoloko",
    name: { ru: "Печенье 'Топленое молоко'", en: "Baked Milk Cookies" },
    inventory: { maxStack: 10, weight: 0.18, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 450, proteins: 7, fats: 18, carbs: 65 },
    assets: { icon: "icons/food/cookie_milk.png" }
  },

  {
    ...baseCookie,
    id: "cookie_oatmeal",
    internalName: "Ovsianoe",
    name: { ru: "Овсяное печенье", en: "Oatmeal Cookies" },
    inventory: { maxStack: 10, weight: 0.3, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 440, proteins: 6, fats: 15, carbs: 70 },
    assets: { icon: "icons/food/cookie_oat.png" }
  },

  // --- СУШКИ И БУБЛИКИ (Dry) ---

  {
    ...baseCookie,
    id: "dry_sushki",
    internalName: "Sushki",
    name: { ru: "Сушки 'Малютка'", en: "Sushki" },
    tags: [...baseCookie.tags, TAGS.HARD, TAGS.LONG_LIFE],
    // 300г, ~30 грн
    inventory: { maxStack: 10, weight: 0.3, basePrice: 30, rarity: "COMMON" },
    nutrition: { calories: 340, proteins: 10, fats: 1, carbs: 72 },
    assets: { icon: "icons/food/sushki.png" }
  },

  {
    ...baseCookie,
    id: "dry_bubliki",
    internalName: "Bubliki",
    name: { ru: "Бублики", en: "Bagels" },
    tags: [...baseCookie.tags, TAGS.SOFT], // Свежие мягкие
    lifecycle: { shelfLifeOpen: 259200 }, // Черствеют за 3 дня
    inventory: { maxStack: 5, weight: 0.3, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 330, proteins: 9, fats: 4, carbs: 60 },
    assets: { icon: "icons/food/bubliki.png" }
  },

  // --- БАТОНЧИКИ (Bars) ---

  {
    ...baseChoco,
    id: "bar_bounty",
    name: { ru: "Батончик 'Баунти'", en: "Bounty" },
    tags: [...baseChoco.tags, TAGS.COCONUT],
    // 57г, ~25 грн
    inventory: { maxStack: 20, weight: 0.057, basePrice: 25, rarity: "COMMON" },
    packaging: { ...baseChoco.packaging, maxServings: 2, currentServings: 2 }, // 2 кусочка
    nutrition: { calories: 487, proteins: 3, fats: 26, carbs: 59 },
    assets: { icon: "icons/food/bar_bounty.png" }
  },

  {
    ...baseChoco,
    id: "bar_mars",
    name: { ru: "Батончик 'Марс'", en: "Mars" },
    tags: [...baseChoco.tags, TAGS.CARAMEL, TAGS.STICKY],
    inventory: { maxStack: 20, weight: 0.05, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 450, proteins: 4, fats: 17, carbs: 70 },
    assets: { icon: "icons/food/bar_mars.png" }
  },

  {
    ...baseChoco,
    id: "bar_snickers",
    name: { ru: "Батончик 'Сникерс'", en: "Snickers" },
    tags: [...baseChoco.tags, TAGS.NUT, TAGS.CARAMEL, TAGS.SATISFYING], // Очень сытный
    // 50г (стандарт), ~25 грн
    inventory: { maxStack: 20, weight: 0.05, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 480, proteins: 9, fats: 23, carbs: 60 }, // Много белка из арахиса
    assets: { icon: "icons/food/bar_snickers.png" }
  },

  {
    ...baseChoco,
    id: "bar_hematogen",
    name: { ru: "Гематоген", en: "Hematogen" },
    tags: [TAGS.SWEET, TAGS.IRON, TAGS.MEDICINAL], // Лечит анемию
    packaging: { type: "PAPER_WRAP", maxServings: 1 },
    // 50г, ~15 грн
    inventory: { maxStack: 20, weight: 0.05, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 354, proteins: 7, fats: 3, carbs: 78 },
    assets: { icon: "icons/food/hematogen.png" }
  },

  // --- ВАФЛИ (Waffles) ---

  {
    ...baseCookie,
    id: "waffle_sheets",
    name: { ru: "Вафельные коржи", en: "Waffle Sheets" },
    tags: [TAGS.GRAIN, TAGS.DRY, TAGS.BASE], // Основа для торта
    // Пачка 100г, ~20 грн
    inventory: { maxStack: 5, weight: 0.1, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 350, proteins: 10, fats: 3, carbs: 70 },
    assets: { icon: "icons/food/waffle_sheets.png" }
  },

  {
    ...baseCookie,
    id: "waffle_artek",
    name: { ru: "Вафли 'Артек'", en: "Artek Wafers" },
    tags: [...baseCookie.tags, TAGS.CHOCOLATE],
    // Пачка 80г, ~15 грн
    inventory: { maxStack: 10, weight: 0.08, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 530, proteins: 5, fats: 30, carbs: 62 },
    assets: { icon: "icons/food/waffle_artek.png" }
  },

  // --- КОНФЕТЫ (Candies - Весовые, фасовка по 200г) ---

  {
    ...baseCandy,
    id: "candy_buttermilk",
    name: { ru: "Конфеты 'Butter milk'", en: "Butter Milk Candies" },
    tags: [...baseCandy.tags, TAGS.DAIRY],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 30 },
    nutrition: { calories: 390, proteins: 0, fats: 1, carbs: 95 },
    assets: { icon: "icons/food/candy_milk.png" }
  },

  {
    ...baseCandy,
    id: "candy_barbaris",
    name: { ru: "Конфеты 'Барбарис'", en: "Barberries" },
    tags: [...baseCandy.tags, TAGS.SOUR],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 25 },
    nutrition: { calories: 370, carbs: 97 },
    assets: { icon: "icons/food/candy_barbaris.png" }
  },

  {
    ...baseCandy,
    id: "candy_duchesse",
    name: { ru: "Конфеты 'Дюшес'", en: "Duchesse" },
    tags: [...baseCandy.tags, TAGS.FRUIT, TAGS.SWEET],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 25 },
    assets: { icon: "icons/food/candy_duchesse.png" }
  },

  {
    ...baseCandy,
    id: "candy_toffee",
    name: { ru: "Конфеты 'Ириски'", en: "Toffee" },
    tags: [...baseCandy.tags, TAGS.STICKY, TAGS.CHEWY, TAGS.DENTAL_DAMAGE], // Вырывает пломбы
    inventory: { maxStack: 10, weight: 0.2, basePrice: 30 },
    nutrition: { calories: 420, fats: 8, carbs: 88 },
    assets: { icon: "icons/food/candy_toffee.png" }
  },

  {
    ...baseCandy,
    id: "candy_korovka",
    name: { ru: "Конфеты 'Коровка'", en: "Korovka" },
    tags: [...baseCandy.tags, TAGS.DAIRY, TAGS.SOFT, TAGS.SUGAR], // Засахаривается
    inventory: { maxStack: 10, weight: 0.2, basePrice: 35 },
    nutrition: { calories: 360, fats: 4, carbs: 82 },
    assets: { icon: "icons/food/candy_korovka.png" }
  },

  {
    ...baseChoco, // Шоколадные конфеты
    id: "candy_red_poppy",
    name: { ru: "Конфеты 'Красный мак'", en: "Red Poppy" },
    tags: [...baseChoco.tags, TAGS.NUT, TAGS.CRUNCHY],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 50 }, // Дороже
    nutrition: { calories: 520, fats: 29, carbs: 63 },
    assets: { icon: "icons/food/candy_poppy.png" }
  },

  {
    ...baseChoco,
    id: "candy_chamomile",
    name: { ru: "Конфеты 'Ромашка'", en: "Chamomile" },
    tags: [...baseChoco.tags, TAGS.ALCOHOL], // Коньячный привкус
    inventory: { maxStack: 10, weight: 0.2, basePrice: 45 },
    nutrition: { calories: 440, fats: 16, carbs: 70 },
    assets: { icon: "icons/food/candy_romashka.png" }
  },

  {
    ...baseChoco,
    id: "candy_hazelnut",
    name: { ru: "Конфеты 'Лищина'", en: "Lishchyna" },
    tags: [...baseChoco.tags, TAGS.NUT],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 55 },
    assets: { icon: "icons/food/candy_lishchyna.png" }
  },

  {
    ...baseChoco,
    id: "candy_birds_milk",
    name: { ru: "Конфеты 'Птичье молоко'", en: "Bird's Milk" },
    tags: [...baseChoco.tags, TAGS.SOFT, TAGS.DAIRY],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 60 },
    nutrition: { calories: 450, fats: 24, carbs: 56 },
    assets: { icon: "icons/food/candy_bird.png" }
  },

  {
    ...baseCandy,
    id: "candy_crawfish",
    name: { ru: "Конфеты 'Рачки'", en: "Rachki" },
    tags: [...baseCandy.tags, TAGS.NUT, TAGS.CRUNCHY, TAGS.CHOCOLATE], // Карамель с начинкой
    inventory: { maxStack: 10, weight: 0.2, basePrice: 30 },
    assets: { icon: "icons/food/candy_rachki.png" }
  },

  {
    ...baseCandy,
    id: "candy_lollipop_rooster",
    name: { ru: "Леденец 'Петушок'", en: "Rooster Lollipop" },
    tags: [TAGS.SWEET, TAGS.SUGAR, TAGS.HARD, TAGS.STICKY],
    packaging: { type: "STICK", returnItem: "stick_wood" },
    // 20г, ~10 грн
    inventory: { maxStack: 20, weight: 0.02, basePrice: 10 },
    nutrition: { calories: 380, carbs: 98 },
    assets: { icon: "icons/food/lollipop.png" }
  },

  // --- ШОКОЛАД (Chocolate) ---

  {
    ...baseChoco,
    id: "choco_alenka",
    name: { ru: "Шоколад 'Аленка'", en: "Alenka Chocolate" },
    tags: [...baseChoco.tags, TAGS.MILK_CHOCOLATE],
    // 90г, ~35 грн
    inventory: { maxStack: 10, weight: 0.09, basePrice: 35, rarity: "COMMON" },
    packaging: { ...baseChoco.packaging, maxServings: 6 },
    nutrition: { calories: 550, proteins: 7, fats: 34, carbs: 53 },
    assets: { icon: "icons/food/choco_alenka.png" }
  },

  {
    ...baseChoco,
    id: "choco_chaika",
    name: { ru: "Шоколад 'Чайка'", en: "Chaika Chocolate" },
    tags: [...baseChoco.tags, TAGS.DARK_CHOCOLATE], // Темнее
    inventory: { maxStack: 10, weight: 0.09, basePrice: 35 },
    nutrition: { calories: 530, proteins: 6, fats: 32, carbs: 55 },
    assets: { icon: "icons/food/choco_chaika.png" }
  },

  // --- ВЫПЕЧКА (Pastry Sweet) ---

  {
    ...baseCookie,
    id: "pastry_pryaniki",
    name: { ru: "Пряники", en: "Gingerbread" },
    tags: [...baseCookie.tags, TAGS.SPICE, TAGS.SOFT], // Мятные/Имбирные
    // 300г, ~30 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 30 },
    nutrition: { calories: 360, proteins: 5, fats: 6, carbs: 76 },
    assets: { icon: "icons/food/pryaniki.png" }
  },

  {
    id: "pastry_cupcake_raisin",
    name: { ru: "Кекс с изюмом", en: "Raisin Cupcake" },
    category: "FOOD",
    physicalState: "SOLID",
    tags: [TAGS.GRAIN, TAGS.SWEET, TAGS.SOFT, TAGS.FRUIT], // Изюм
    packaging: { type: "PAPER_WRAP", returnItem: "trash_paper" },
    // 75г (маленький), ~15 грн
    inventory: { maxStack: 10, weight: 0.075, basePrice: 15 },
    lifecycle: { shelfLifeOpen: 604800 },
    nutrition: { calories: 400, proteins: 6, fats: 18, carbs: 50 },
    assets: { icon: "icons/food/keks.png" }
  },

  // --- СНЕКИ (Salty Snacks) ---

  {
    id: "snack_chips_lux",
    name: { ru: "Чипсы 'Люкс'", en: "Lux Chips" },
    category: "FOOD",
    tags: [TAGS.POTATO, TAGS.FRIED, TAGS.SALTY, TAGS.CRISPY, TAGS.THIRSTY],
    packaging: { type: "FOIL_BAG", returnItem: "trash_foil", isDivisible: true },
    // 133г, ~50 грн
    inventory: { maxStack: 5, weight: 0.133, basePrice: 50 },
    nutrition: { calories: 530, proteins: 6, fats: 32, carbs: 53 },
    assets: { icon: "icons/food/chips.png" }
  },

  {
    id: "snack_rusks_flint",
    name: { ru: "Сухарики 'Флинт'", en: "Flint Rusks" },
    category: "FOOD",
    tags: [TAGS.GRAIN, TAGS.SALTY, TAGS.CRISPY, TAGS.SPICY, TAGS.THIRSTY],
    packaging: { type: "FOIL_BAG", returnItem: "trash_foil" },
    // 70г, ~15 грн
    inventory: { maxStack: 10, weight: 0.07, basePrice: 15 },
    nutrition: { calories: 450, proteins: 10, fats: 15, carbs: 70 },
    assets: { icon: "icons/food/rusks.png" }
  },

  // --- ВОСТОЧНЫЕ СЛАДОСТИ (Eastern) ---

  {
    id: "sweet_gozinaki",
    name: { ru: "Козинаки", en: "Gozinaki" },
    category: "FOOD",
    tags: [TAGS.SEEDS, TAGS.SUGAR, TAGS.HARD, TAGS.HIGH_CALORIE], // Семечки+Карамель
    // 100г плитка, ~20 грн
    inventory: { maxStack: 10, weight: 0.1, basePrice: 20 },
    // Очень питательно
    nutrition: { calories: 580, proteins: 15, fats: 40, carbs: 40 },
    assets: { icon: "icons/food/gozinaki.png" }
  },

  {
    id: "sweet_halva",
    name: { ru: "Халва", en: "Halva" },
    category: "FOOD",
    tags: [TAGS.SEEDS, TAGS.FAT, TAGS.SUGAR, TAGS.CRUMBLY],
    packaging: { type: "FOIL_WRAP", returnItem: "trash_foil" },
    // 270г брусок, ~30 грн
    inventory: { maxStack: 5, weight: 0.27, basePrice: 30 },
    nutrition: { calories: 550, proteins: 13, fats: 35, carbs: 45 },
    assets: { icon: "icons/food/halva.png" }
  },

  // --- ДЕСЕРТЫ (Soft) ---

  {
    id: "sweet_zephyr",
    name: { ru: "Зефир", en: "Zephyr" },
    category: "FOOD",
    tags: [TAGS.SUGAR, TAGS.SOFT, TAGS.EGG, TAGS.GELLING], // Пектин
    packaging: { type: "PLASTIC_BOX", maxServings: 6 },
    // 300г, ~60 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 60 },
    lifecycle: { shelfLifeOpen: 1209600 },
    nutrition: { calories: 326, proteins: 1, fats: 0, carbs: 80 },
    assets: { icon: "icons/food/zephyr.png" }
  },

  {
    id: "sweet_marmalade",
    name: { ru: "Мармелад", en: "Marmalade" },
    category: "FOOD",
    tags: [TAGS.SUGAR, TAGS.GELLING, TAGS.FRUIT, TAGS.CHEWY],
    // 300г, ~50 грн
    inventory: { maxStack: 5, weight: 0.3, basePrice: 50 },
    nutrition: { calories: 320, proteins: 0, fats: 0, carbs: 80 },
    assets: { icon: "icons/food/marmalade.png" }
  },

  // --- МОРОЖЕНОЕ ПОРЦИОННОЕ (Ice Cream Portion) ---

  {
    ...baseIceCream,
    id: "icecream_cup",
    name: { ru: "Пломбир в стаканчике", en: "Plombir Cup" },
    tags: [...baseIceCream.tags, TAGS.GRAIN], // Стаканчик
    // 70г, ~20 грн
    inventory: { maxStack: 10, weight: 0.07, basePrice: 20 },
    nutrition: { calories: 230, proteins: 4, fats: 15, carbs: 20 },
    assets: { icon: "icons/food/ice_cup.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_choco_glaze",
    name: { ru: "Пломбир в шоколаде (Эскимо)", en: "Choco Covered Ice Cream" },
    tags: [...baseIceCream.tags, TAGS.CHOCOLATE, TAGS.STICK],
    packaging: { ...baseIceCream.packaging, returnItem: "stick_wood" },
    inventory: { maxStack: 10, weight: 0.08, basePrice: 30 },
    nutrition: { calories: 300, fats: 20, carbs: 25 },
    assets: { icon: "icons/food/ice_eskimo.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_lakomka",
    name: { ru: "Лакомка", en: "Lakomka" },
    tags: [...baseIceCream.tags, TAGS.FAT, TAGS.CHOCOLATE], // Взбитая глазурь
    inventory: { maxStack: 10, weight: 0.09, basePrice: 35 },
    nutrition: { calories: 340, fats: 25, carbs: 22 },
    assets: { icon: "icons/food/ice_lakomka.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_kashtan",
    name: { ru: "Каштан", en: "Kashtan" },
    tags: [...baseIceCream.tags, TAGS.CHOCOLATE], // Шоколадный пломбир в шоколаде
    inventory: { maxStack: 10, weight: 0.07, basePrice: 25 },
    nutrition: { calories: 280, fats: 18, carbs: 24 },
    assets: { icon: "icons/food/ice_kashtan.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_fruit_ice",
    name: { ru: "Фруктовый лед", en: "Fruit Ice" },
    tags: [TAGS.FRUIT, TAGS.FROZEN, TAGS.SWEET, TAGS.WATER, TAGS.MELTABLE], // Не DAIRY
    inventory: { maxStack: 10, weight: 0.08, basePrice: 15 },
    nutrition: { calories: 110, proteins: 0, fats: 0, carbs: 28 }, // Легкое
    assets: { icon: "icons/food/ice_fruit.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_sherbet",
    name: { ru: "Щербет", en: "Sherbet" },
    tags: [...baseIceCream.tags, TAGS.FRUIT], // Молоко + Фрукты
    inventory: { maxStack: 10, weight: 0.08, basePrice: 18 },
    nutrition: { calories: 150, fats: 3, carbs: 30 },
    assets: { icon: "icons/food/ice_sherbet.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_cone",
    name: { ru: "Рожок", en: "Ice Cream Cone" },
    tags: [...baseIceCream.tags, TAGS.CRUNCHY, TAGS.GRAIN],
    // 100г, ~40 грн (большой)
    inventory: { maxStack: 10, weight: 0.1, basePrice: 40 },
    nutrition: { calories: 290, fats: 14, carbs: 35 },
    assets: { icon: "icons/food/ice_cone.png" }
  },

  // --- МОРОЖЕНОЕ СЕМЕЙНОЕ (Ice Cream Family) ---

  {
    ...baseIceCream,
    id: "icecream_briquette",
    name: { ru: "Пломбир (Брикет)", en: "Ice Cream Briquette" },
    packaging: { ...baseIceCream.packaging, type: "FOIL_WRAP", maxServings: 2, isDivisible: true },
    // 200г, ~50 грн
    inventory: { maxStack: 5, weight: 0.2, basePrice: 50 },
    nutrition: { calories: 230, fats: 15, carbs: 20 },
    assets: { icon: "icons/food/ice_brick.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_bucket",
    name: { ru: "Ведерко мороженого", en: "Ice Cream Bucket" },
    packaging: { type: "PLASTIC_BUCKET", returnItem: "bucket_plastic_small", maxServings: 5, isDivisible: true },
    // 500г, ~120 грн
    inventory: { maxStack: 2, weight: 0.5, basePrice: 120 },
    assets: { icon: "icons/food/ice_bucket.png" }
  },

  {
    ...baseIceCream,
    id: "icecream_cake",
    name: { ru: "Торт-мороженое", en: "Ice Cream Cake" },
    tags: [...baseIceCream.tags, TAGS.FANCY, TAGS.FRAGILE],
    packaging: { type: "CARDBOARD_BOX", returnItem: "trash_cardboard", maxServings: 8, isDivisible: true },
    // 800г, ~250 грн
    inventory: { maxStack: 1, weight: 0.8, basePrice: 250, rarity: "RARE" },
    assets: { icon: "icons/food/ice_cake.png" }
  }

];