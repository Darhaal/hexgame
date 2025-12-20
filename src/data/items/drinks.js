import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (DRINKS TEMPLATES)
// =============================================================================

// 1. ВОДА И БЕЗАЛКОГОЛЬНЫЕ НАПИТКИ
const baseDrink = {
  category: "FOOD", // Или DRINK
  physicalState: "LIQUID",
  tags: [TAGS.LIQUID, TAGS.THIRST_QUENCHING, TAGS.READY_TO_EAT],
  packaging: {
    type: "BOTTLE_PLASTIC",
    isOpen: false,
    returnItem: "bottle_plastic_empty",
    maxServings: 5, // 1.5 литра / 300мл
    currentServings: 5,
    isDivisible: true
  },
  lifecycle: {
    shelfLifeOpen: 604800,    // Неделя открытой
    shelfLifeSealed: 31536000 // Год
  },
  thermodynamics: {
    currentTemp: 20,
    freezingPoint: 0,
    cookingPoint: 100
  },
  risks: []
};

// 2. АЛКОГОЛЬ (Обезвоживает, лечит нервы)
const baseAlcohol = {
  category: "FOOD",
  physicalState: "LIQUID",
  tags: [TAGS.LIQUID, TAGS.ALCOHOL, TAGS.ANTIBIOTIC, TAGS.FLAMMABLE], // Горит
  packaging: {
    type: "BOTTLE_GLASS",
    returnItem: "bottle_glass_empty",
    maxServings: 10, // По 50г
    currentServings: 10
  },
  lifecycle: { shelfLifeOpen: 31536000, shelfLifeSealed: 999999999 }, // Вечный
  nutrition: { calories: 230, hydration: -20, proteins: 0, fats: 0, carbs: 0 } // Сушит
};

// 3. ГОРЯЧИЕ НАПИТКИ (Сухие смеси)
const baseHotMix = {
  category: "FOOD",
  physicalState: "POWDER",
  tags: [TAGS.POWDER, TAGS.DRY, TAGS.BOIL_REQUIRED], // Нужно залить кипятком
  packaging: { type: "SACHET", returnItem: "trash_wrapper", maxServings: 1 },
  lifecycle: { shelfLifeSealed: 63072000 },
  inventory: { weight: 0.02, maxStack: 50 }
};

// =============================================================================
// СПИСОК НАПИТКОВ
// Нутрициология на 100мл (для жидкостей)
// =============================================================================

export const drinksItems = [

  // --- ВОДА (Water) ---

  {
    ...baseDrink,
    id: "water_morshinska",
    internalName: "Morshinska",
    name: { ru: "Вода 'Моршинская' (Негаз)", en: "Still Water" },
    tags: [...baseDrink.tags, TAGS.PURE],
    // 1.5л, ~20 грн
    inventory: { maxStack: 5, weight: 1.5, basePrice: 20, rarity: "COMMON" },
    nutrition: { calories: 0, hydration: 100, proteins: 0, fats: 0, carbs: 0 },
    assets: { icon: "icons/drink/water_still.png" }
  },

  {
    ...baseDrink,
    id: "water_mirgorodska",
    internalName: "Mirgorodska",
    name: { ru: "Вода 'Миргородская' (Газ)", en: "Sparkling Water" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.SALTY], // Солоноватая
    // 1.5л, ~22 грн
    inventory: { maxStack: 5, weight: 1.5, basePrice: 22, rarity: "COMMON" },
    nutrition: { calories: 0, hydration: 95, carbs: 0 },
    assets: { icon: "icons/drink/water_sparkling.png" }
  },

  {
    ...baseDrink,
    id: "water_polyana",
    internalName: "Polyana",
    name: { ru: "Вода 'Поляна Квасова'", en: "Medicinal Water" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.MEDICINAL, TAGS.HANGOVER_CURE], // Лечит желудок
    packaging: { ...baseDrink.packaging, type: "BOTTLE_GLASS", returnItem: "bottle_glass_empty" }, // Стекло
    // 0.5л, ~30 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 30, rarity: "UNCOMMON" },
    nutrition: { calories: 0, hydration: 95, carbs: 0 },
    assets: { icon: "icons/drink/water_polyana.png" }
  },

  // --- КВАС (Kvass) ---

  {
    ...baseDrink,
    id: "kvass_arsenyevsky",
    internalName: "KvassWhite",
    name: { ru: "Квас 'Арсеньевский'", en: "White Kvass" },
    tags: [...baseDrink.tags, TAGS.FERMENTED, TAGS.PROBIOTIC], // Живой
    packaging: { ...baseDrink.packaging, maxServings: 3 }, // 1л? Нет, он обычно 1.5л. Пусть будет 1.5
    lifecycle: { shelfLifeOpen: 259200 }, // Скисает за 3 дня
    // 1.5л, ~40 грн
    inventory: { maxStack: 5, weight: 1.5, basePrice: 40, rarity: "COMMON" },
    nutrition: { calories: 30, hydration: 80, carbs: 7 },
    assets: { icon: "icons/drink/kvass_white.png" }
  },

  {
    ...baseDrink,
    id: "kvass_taras",
    internalName: "KvassBlack",
    name: { ru: "Квас 'Тарас' (Черный)", en: "Dark Kvass" },
    tags: [...baseDrink.tags, TAGS.FERMENTED, TAGS.SWEET],
    // 1.5л, ~35 грн
    inventory: { maxStack: 5, weight: 1.5, basePrice: 35, rarity: "COMMON" },
    nutrition: { calories: 35, hydration: 80, carbs: 8 },
    assets: { icon: "icons/drink/kvass_black.png" }
  },

  {
    ...baseDrink,
    id: "kvass_draft",
    internalName: "KvassDraft",
    name: { ru: "Квас 'Бочковой'", en: "Draft Kvass" },
    packaging: { type: "PLASTIC_CUP", returnItem: "trash_plastic", maxServings: 1, isDivisible: false },
    // 0.5л стакан, ~20 грн
    inventory: { maxStack: 1, weight: 0.5, basePrice: 20, rarity: "COMMON" },
    lifecycle: { shelfLifeOpen: 14400 }, // Выдохнется за 4 часа
    nutrition: { calories: 30, hydration: 85, carbs: 6 },
    assets: { icon: "icons/drink/kvass_draft.png" }
  },

  // --- ГАЗИРОВКА (Soda) ---

  {
    ...baseDrink,
    id: "soda_coke",
    internalName: "CocaCola",
    name: { ru: "Кока-Кола", en: "Coca-Cola" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.SUGAR, TAGS.CAFFEINE, TAGS.ACID], // Чистит ржавчину
    // 1л, ~35 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 35, rarity: "COMMON" },
    nutrition: { calories: 42, hydration: 70, carbs: 10.6 },
    assets: { icon: "icons/drink/coke.png" }
  },

  {
    ...baseDrink,
    id: "soda_lemonade",
    internalName: "Rosinka",
    name: { ru: "Лимонад 'Росинка'", en: "Lemonade" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.SWEET],
    inventory: { maxStack: 5, weight: 1.5, basePrice: 25 },
    nutrition: { calories: 35, hydration: 80, carbs: 9 },
    assets: { icon: "icons/drink/lemonade.png" }
  },

  {
    ...baseDrink,
    id: "soda_citro",
    internalName: "Citro",
    name: { ru: "Ситро", en: "Citro" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.FRUIT],
    inventory: { maxStack: 5, weight: 1.5, basePrice: 25 },
    nutrition: { calories: 38, hydration: 80, carbs: 9 },
    assets: { icon: "icons/drink/citro.png" }
  },

  {
    ...baseDrink,
    id: "soda_zhivchik",
    internalName: "Zhivchik",
    name: { ru: "Живчик (Яблоко)", en: "Zhivchik Apple" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.MEDICINAL, TAGS.HEALTHY], // С эхинацеей
    inventory: { maxStack: 5, weight: 1.0, basePrice: 30 },
    nutrition: { calories: 35, hydration: 85, carbs: 9 },
    assets: { icon: "icons/drink/zhivchik.png" }
  },

  {
    ...baseDrink,
    id: "soda_tarkhun",
    internalName: "Tarkhun",
    name: { ru: "Тархун", en: "Tarragon Soda" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.GREEN],
    packaging: { ...baseDrink.packaging, type: "BOTTLE_GLASS", returnItem: "bottle_glass_empty" },
    // 0.5л, ~25 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 25 },
    nutrition: { calories: 40, hydration: 80, carbs: 10 },
    assets: { icon: "icons/drink/tarkhun.png" }
  },

  {
    ...baseDrink,
    id: "soda_duchesse",
    internalName: "Duchesse",
    name: { ru: "Дюшес", en: "Pear Soda" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.SWEET],
    inventory: { maxStack: 10, weight: 0.5, basePrice: 25 },
    nutrition: { calories: 40, hydration: 80, carbs: 10 },
    assets: { icon: "icons/drink/duchesse.png" }
  },

  // --- СОКИ (Juices) ---

  {
    ...baseDrink,
    id: "juice_tomato",
    internalName: "TomatoJuice",
    name: { ru: "Сок Томатный", en: "Tomato Juice" },
    tags: [TAGS.LIQUID, TAGS.VEG, TAGS.SALTY, TAGS.THICK, TAGS.VITAMIN_C],
    packaging: { type: "TETRA_PACK", returnItem: "trash_carton", maxServings: 4 },
    // 1л, ~45 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 45 },
    nutrition: { calories: 20, hydration: 90, proteins: 1, carbs: 4 },
    assets: { icon: "icons/drink/juice_tomato.png" }
  },

  {
    ...baseDrink,
    id: "juice_birch",
    internalName: "BirchSap",
    name: { ru: "Сок Березовый", en: "Birch Sap" },
    tags: [TAGS.LIQUID, TAGS.SUGAR, TAGS.ACID, TAGS.HEALTHY],
    packaging: { type: "GLASS_JAR", returnItem: "glass_jar_3l" }, // 3 литра!
    // 3л банка, ~80 грн
    inventory: { maxStack: 1, weight: 3.0, basePrice: 80 },
    nutrition: { calories: 24, hydration: 95, carbs: 6 },
    assets: { icon: "icons/drink/juice_birch.png" }
  },

  {
    ...baseDrink,
    id: "juice_uzvar",
    internalName: "Uzvar",
    name: { ru: "Узвар", en: "Dried Fruit Compote" },
    tags: [TAGS.LIQUID, TAGS.FRUIT, TAGS.SMOKED], // Копченая груша
    // 1л, ~30 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 30 },
    nutrition: { calories: 40, hydration: 90, carbs: 10 },
    assets: { icon: "icons/drink/uzvar.png" }
  },

  // --- ЭНЕРГЕТИКИ (Energy) ---

  {
    ...baseDrink,
    id: "energy_nonstop",
    internalName: "NonStop",
    name: { ru: "Энергетик Non-Stop", en: "Non-Stop Energy" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.CAFFEINE, TAGS.ENERGY_BOOST],
    packaging: { type: "CAN", returnItem: "tin_can_drink", maxServings: 2 }, // 0.5л
    // 0.5л, ~40 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 40 },
    nutrition: { calories: 45, hydration: 50, carbs: 11 }, // Сушит
    assets: { icon: "icons/drink/nonstop.png" }
  },

  {
    ...baseDrink,
    id: "energy_revo",
    internalName: "Revo",
    name: { ru: "Revo (Алкогольный)", en: "Revo Alco Energy" },
    tags: [...baseDrink.tags, TAGS.CARBONATED, TAGS.CAFFEINE, TAGS.ALCOHOL, TAGS.TOXIC], // Опасно для сердца
    packaging: { type: "CAN", returnItem: "tin_can_drink", maxServings: 2 },
    // 0.5л, ~50 грн
    inventory: { maxStack: 10, weight: 0.5, basePrice: 50 },
    // 8.5% алкоголя
    nutrition: { calories: 90, hydration: -10, carbs: 12 },
    risks: [{ type: "HEART_ATTACK", chanceBase: 0.01, severity: "CRITICAL" }],
    assets: { icon: "icons/drink/revo.png" }
  },

  // --- ГОРЯЧИЕ (Hot Drinks) ---

  {
    ...baseHotMix,
    id: "hot_tea_bags",
    name: { ru: "Чай (Пакетики)", en: "Tea Bags" },
    tags: [...baseHotMix.tags, TAGS.TEA, TAGS.CAFFEINE],
    packaging: { type: "CARDBOARD_BOX", maxServings: 25 }, // 25 пакетов
    inventory: { weight: 0.05, basePrice: 40 },
    assets: { icon: "icons/drink/tea_box.png" }
  },

  {
    ...baseHotMix,
    id: "hot_cocoa",
    name: { ru: "Какао (Порошок)", en: "Cocoa Powder" },
    tags: [...baseHotMix.tags, TAGS.CHOCOLATE, TAGS.SWEET],
    inventory: { weight: 0.1, basePrice: 30 },
    assets: { icon: "icons/drink/cocoa.png" }
  },

  {
    ...baseHotMix,
    id: "hot_chicory",
    name: { ru: "Цикорий", en: "Chicory" },
    tags: [...baseHotMix.tags, TAGS.HEALTHY, TAGS.BITTER],
    inventory: { weight: 0.1, basePrice: 25 },
    assets: { icon: "icons/drink/chicory.png" }
  },

  {
    ...baseHotMix,
    id: "hot_coffee_3in1",
    name: { ru: "Кофе 'МакКофе' (3-в-1)", en: "3-in-1 Coffee" },
    tags: [...baseHotMix.tags, TAGS.COFFEE, TAGS.SUGAR, TAGS.DAIRY, TAGS.CAFFEINE],
    packaging: { type: "SACHET", maxServings: 1 },
    inventory: { weight: 0.02, basePrice: 8 },
    assets: { icon: "icons/drink/coffee_3in1.png" }
  },

  {
    id: "hot_thermos_tea",
    internalName: "ThermosTea",
    name: { ru: "Чай в термосе", en: "Thermos with Tea" },
    category: "DRINK",
    physicalState: "LIQUID",
    tags: [TAGS.LIQUID, TAGS.HOT, TAGS.TEA, TAGS.WARMTH], // Согревает
    packaging: { type: "THERMOS", returnItem: "thermos_empty", maxServings: 4, isOpen: false },
    lifecycle: { shelfLifeOpen: 43200 }, // Остывает за 12 часов
    inventory: { maxStack: 1, weight: 1.5, basePrice: 0, rarity: "COMMON" }, // Цена термоса отдельная
    nutrition: { calories: 5, hydration: 100 },
    thermodynamics: { currentTemp: 80, insulation: 1.0 }, // Хорошая изоляция
    assets: { icon: "icons/drink/thermos.png" }
  },

  // --- АЛКОГОЛЬ (Водка/Спирт) ---

  {
    ...baseAlcohol,
    id: "alco_vodka_khleb",
    name: { ru: "Водка 'Хлебный Дар'", en: "Vodka Khlebny Dar" },
    // 0.5л, ~120 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 120, rarity: "COMMON" },
    nutrition: { calories: 230, hydration: -20 },
    assets: { icon: "icons/drink/vodka_khleb.png" }
  },

  {
    ...baseAlcohol,
    id: "alco_vodka_nemiroff",
    name: { ru: "Водка 'Немиров' (С перцем)", en: "Vodka Pepper" },
    tags: [...baseAlcohol.tags, TAGS.SPICY, TAGS.MEDICINAL], // Лечит простуду
    // 0.5л, ~140 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 140 },
    assets: { icon: "icons/drink/vodka_pepper.png" }
  },

  {
    ...baseAlcohol,
    id: "alco_moonshine",
    name: { ru: "Самогон (Мутный)", en: "Moonshine" },
    tags: [...baseAlcohol.tags, TAGS.HOMEMADE, TAGS.TOXIC], // Риск отравления сивухой
    // 1л (банка или пластик), ~80 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 80, rarity: "COMMON" },
    nutrition: { calories: 250, hydration: -30 },
    risks: [{ type: "POISONING", chanceBase: 0.1, severity: "MEDIUM" }],
    assets: { icon: "icons/drink/moonshine.png" }
  },

  // --- АЛКОГОЛЬ (Пиво) ---

  {
    ...baseDrink,
    id: "alco_beer_zhiguli",
    name: { ru: "Пиво 'Жигулевское'", en: "Zhigulevskoe Beer" },
    tags: [TAGS.LIQUID, TAGS.ALCOHOL_LOW, TAGS.CARBONATED, TAGS.DIURETIC], // Мочегонное
    packaging: { type: "BOTTLE_GLASS", returnItem: "bottle_glass_empty", maxServings: 1 },
    // 0.5л, ~25 грн
    inventory: { maxStack: 10, weight: 0.9, basePrice: 25, rarity: "COMMON" },
    nutrition: { calories: 43, hydration: 50, carbs: 4 }, // Немного утоляет жажду
    assets: { icon: "icons/drink/beer_zhiguli.png" }
  },

  {
    ...baseDrink,
    id: "alco_beer_obolon_light",
    name: { ru: "Пиво 'Оболонь' (Светлое)", en: "Obolon Light" },
    tags: [TAGS.LIQUID, TAGS.ALCOHOL_LOW, TAGS.CARBONATED],
    packaging: { type: "BOTTLE_PLASTIC", returnItem: "bottle_plastic_empty", maxServings: 2 }, // 1л (сиська)
    inventory: { maxStack: 5, weight: 1.0, basePrice: 40 },
    assets: { icon: "icons/drink/beer_obolon.png" }
  },

  {
    ...baseDrink,
    id: "alco_beer_obolon_strong",
    name: { ru: "Пиво 'Оболонь' (Мицне)", en: "Obolon Strong" },
    tags: [TAGS.LIQUID, TAGS.ALCOHOL_MED, TAGS.CARBONATED],
    inventory: { maxStack: 5, weight: 1.0, basePrice: 45 },
    assets: { icon: "icons/drink/beer_strong.png" }
  },

  {
    ...baseDrink,
    id: "alco_beer_slavutich",
    name: { ru: "Пиво 'Славутич'", en: "Slavutich" },
    packaging: { type: "BOTTLE_GLASS", returnItem: "bottle_glass_empty" },
    inventory: { maxStack: 10, weight: 0.9, basePrice: 30 },
    assets: { icon: "icons/drink/beer_slavutich.png" }
  },

  {
    ...baseDrink,
    id: "alco_beer_baltika",
    name: { ru: "Пиво 'Балтика'", en: "Baltika" }, // Или аналог
    inventory: { maxStack: 10, weight: 0.9, basePrice: 35 },
    assets: { icon: "icons/drink/beer_baltika.png" }
  },

  {
    ...baseDrink,
    id: "alco_beer_chernigivske",
    name: { ru: "Пиво 'Черниговское' (Белое)", en: "Chernigivske White" },
    tags: [TAGS.LIQUID, TAGS.ALCOHOL_LOW, TAGS.UNFILTERED], // Нефильтрованное
    inventory: { maxStack: 10, weight: 0.9, basePrice: 32 },
    assets: { icon: "icons/drink/beer_white.png" }
  },

  // --- АЛКОГОЛЬ (Вино/Настойки) ---

  {
    ...baseAlcohol,
    id: "alco_wine_777",
    name: { ru: "Портвейн '777'", en: "Port Wine 777" },
    tags: [TAGS.ALCOHOL_MED, TAGS.SWEET, TAGS.CHEAP],
    // 0.7л, ~60 грн (шмурдяк)
    inventory: { maxStack: 5, weight: 1.2, basePrice: 60, rarity: "COMMON" },
    nutrition: { calories: 150, hydration: -10, carbs: 15 },
    assets: { icon: "icons/drink/wine_777.png" }
  },

  {
    ...baseAlcohol,
    id: "alco_wine_isabella",
    name: { ru: "Вино 'Изабелла'", en: "Isabella Wine" },
    tags: [TAGS.ALCOHOL_MED, TAGS.SWEET],
    // 0.7л, ~90 грн
    inventory: { maxStack: 5, weight: 1.2, basePrice: 90 },
    nutrition: { calories: 80, hydration: -5, carbs: 5 },
    assets: { icon: "icons/drink/wine_isabella.png" }
  },

  {
    ...baseAlcohol,
    id: "alco_cognac",
    name: { ru: "Коньяк 'Закарпатский'", en: "Transcarpathian Cognac" },
    tags: [TAGS.ALCOHOL_HIGH, TAGS.PREMIUM],
    // 0.5л, ~250 грн
    inventory: { maxStack: 5, weight: 0.9, basePrice: 250, rarity: "UNCOMMON" },
    nutrition: { calories: 240, hydration: -20 },
    assets: { icon: "icons/drink/cognac.png" }
  },

  {
    ...baseAlcohol,
    id: "alco_mead",
    name: { ru: "Медовуха", en: "Mead" },
    tags: [TAGS.ALCOHOL_MED, TAGS.SWEET, TAGS.HONEY, TAGS.HOMEMADE],
    // 1л, ~100 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 100 },
    nutrition: { calories: 100, hydration: -5, carbs: 10 },
    assets: { icon: "icons/drink/mead.png" }
  }

];