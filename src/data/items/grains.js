import { TAGS } from "../itemtags";


// =============================================================================
// БАЗОВЫЕ ШАБЛОНЫ (GROCERY TEMPLATES)
// =============================================================================

// 1. КРУПЫ (Сыпучие, требуют варки)
const baseGrain = {
  category: "FOOD",
  physicalState: "SOLID", // Но ведет себя как сыпучее
  tags: [TAGS.GRAIN, TAGS.DRY, TAGS.GRANULAR, TAGS.BOIL_REQUIRED, TAGS.LONG_LIFE],

  packaging: {
    type: "PLASTIC_BAG",
    isOpen: false,
    requiresTool: null, // Рвется руками
    returnItem: "trash_plastic",
    maxServings: 10,    // Из 1 кг крупы получается ~10 порций каши
    currentServings: 10,
    isDivisible: true   // Можно отсыпать
  },

  lifecycle: {
    creationDate: 1704067200,
    sealedDate: 1704070800,
    openedDate: null,
    shelfLifeOpen: 15768000,  // 6 месяцев открытым (риск жучков/влаги)
    shelfLifeSealed: 63072000,// 2 года закрытым
    aging: { isAgeable: false }
  },

  thermodynamics: {
    currentTemp: 20,
    specificHeat: 1.2,
    freezingPoint: -20,
    cookingPoint: 100, // Температура кипения воды
    burningPoint: 200,
    carbonizationPoint: 300
  },

  // В сухом виде рисков нет, если не старое
  risks: [
    { type: "DENTAL_DAMAGE", chanceBase: 0.05, severity: "MINOR" } // Если попался камешек
  ]
};

// 2. МАКАРОНЫ (Тесто сушеное)
const basePasta = {
  ...baseGrain,
  tags: [TAGS.GRAIN, TAGS.DRY, TAGS.BOIL_REQUIRED, TAGS.LONG_LIFE],
  // Макароны объемнее круп
  packaging: { ...baseGrain.packaging, maxServings: 8, currentServings: 8 }
};

// 3. БЫСТРАЯ ЕДА (Мивина)
const baseInstant = {
  category: "FOOD",
  physicalState: "SOLID",
  // Можно есть сухим (CRISPY) или варить
  tags: [TAGS.GRAIN, TAGS.DRY, TAGS.READY_TO_EAT, TAGS.CRISPY, TAGS.THIRSTY, TAGS.FRIED],

  packaging: {
    type: "FLOW_PACK",
    isOpen: false,
    returnItem: "trash_wrapper",
    maxServings: 1,
    currentServings: 1,
    isDivisible: false
  },

  lifecycle: {
    ...baseGrain.lifecycle,
    shelfLifeSealed: 31536000 // 1 год (масло прогоркает)
  },

  // Сухая мивина царапает небо, но дает энергию
  risks: []
};

// =============================================================================
// СПИСОК: КРУПЫ, МАКАРОНЫ, БЫСТРОЕ
// Нутрициология на 100г СУХОГО продукта.
// =============================================================================

export const grainItems = [

  // --- КРУПЫ / КАШИ ---

  {
    ...baseGrain,
    id: "grain_buckwheat",
    internalName: "Grechka",
    name: { ru: "Гречка", en: "Buckwheat" },
    tags: [...baseGrain.tags, TAGS.DIET], // Диетическая
    // 1 кг, ~35 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 35, rarity: "COMMON" },
    nutrition: {
      calories: 330, hydration: -10, proteins: 12.6, fats: 3.3, carbs: 64,
      digestibility: 0.9, volume: 1.0, gutStress: 0.0
    },
    flavor: { sweet: 0, salty: 0, sour: 0, bitter: 1, umami: 2, spicy: 0, texture: "HARD" },
    assets: { icon: "icons/food/grechka.png", model: "models/food/grain_sack.glb" }
  },

  {
    ...baseGrain,
    id: "grain_rice",
    internalName: "Rice",
    name: { ru: "Рис", en: "Rice" },
    tags: [...baseGrain.tags, TAGS.STARCH], // Крахмал (загуститель супа)
    // 1 кг, ~50 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 50, rarity: "COMMON" },
    nutrition: {
      calories: 340, hydration: -10, proteins: 6.7, fats: 0.7, carbs: 78,
      digestibility: 0.95, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/rice.png" }
  },

  {
    ...baseGrain,
    id: "grain_oats",
    internalName: "Ovsianka",
    name: { ru: "Овсянка", en: "Oat Flakes" },
    tags: [...baseGrain.tags, TAGS.SLIMY, TAGS.DIET], // Слизистая каша
    // Пачка 800г (часто картон), ~35 грн
    inventory: { maxStack: 5, weight: 0.8, basePrice: 35, rarity: "COMMON" },
    packaging: { ...baseGrain.packaging, type: "CARDBOARD_BOX", returnItem: "trash_cardboard" },
    nutrition: {
      calories: 360, hydration: -10, proteins: 12, fats: 6, carbs: 65,
      digestibility: 0.95, volume: 0.8, gutStress: 0.0
    },
    assets: { icon: "icons/food/oats.png" }
  },

  {
    ...baseGrain,
    id: "grain_semolina",
    internalName: "Manka",
    name: { ru: "Манка", en: "Semolina" },
    physicalState: "POWDER", // Почти порошок
    tags: [...baseGrain.tags, TAGS.POWDER],
    // 1 кг, ~25 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 25, rarity: "COMMON" },
    nutrition: {
      calories: 360, hydration: -5, proteins: 10, fats: 1, carbs: 70,
      digestibility: 0.95, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/manka.png" }
  },

  {
    ...baseGrain,
    id: "grain_pearl_barley",
    internalName: "Perlovka",
    name: { ru: "Перловка", en: "Pearl Barley" },
    tags: [...baseGrain.tags, TAGS.CHEAP, TAGS.BAIT], // Используется для рыбалки
    // 1 кг, ~18 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 18, rarity: "COMMON" },
    nutrition: {
      calories: 315, hydration: -10, proteins: 9, fats: 1, carbs: 73,
      digestibility: 0.8, volume: 1.0, gutStress: 0.1 // Тяжелая
    },
    assets: { icon: "icons/food/perlovka.png" }
  },

  {
    ...baseGrain,
    id: "grain_millet",
    internalName: "Psheno",
    name: { ru: "Пшено", en: "Millet" },
    tags: [...baseGrain.tags, TAGS.BAIT, TAGS.BITTER_IF_OLD], // Горчит если старое
    // 1 кг, ~25 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 25, rarity: "COMMON" },
    nutrition: {
      calories: 378, hydration: -10, proteins: 11, fats: 4, carbs: 70,
      digestibility: 0.9, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/psheno.png" }
  },

  {
    ...baseGrain,
    id: "grain_corn",
    internalName: "Kukuruza",
    name: { ru: "Кукурузная крупа", en: "Corn Grits" },
    tags: [...baseGrain.tags, TAGS.BAIT], // Мамалыга
    // 1 кг, ~20 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 20, rarity: "COMMON" },
    nutrition: {
      calories: 337, hydration: -10, proteins: 8, fats: 1, carbs: 75,
      digestibility: 0.85, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/corn_grits.png" }
  },

  {
    ...baseGrain,
    id: "grain_barley_grits",
    internalName: "Yachka",
    name: { ru: "Ячневая крупа", en: "Barley Grits" },
    tags: [...baseGrain.tags, TAGS.CHEAP],
    // 1 кг, ~16 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 16, rarity: "COMMON" },
    nutrition: {
      calories: 320, hydration: -10, proteins: 10, fats: 1.3, carbs: 72,
      digestibility: 0.85, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/yachka.png" }
  },

  {
    ...baseGrain,
    id: "grain_peas_split",
    internalName: "Goroh",
    name: { ru: "Горох (Колотый)", en: "Split Peas" },
    tags: [...baseGrain.tags, TAGS.VEG, TAGS.PROTEIN], // Для горохового супа
    // 1 кг, ~20 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 20, rarity: "COMMON" },
    nutrition: {
      calories: 298, hydration: -10, proteins: 20, fats: 2, carbs: 50,
      digestibility: 0.7, volume: 1.0, gutStress: 0.3 // Метеоризм
    },
    assets: { icon: "icons/food/goroh.png" }
  },

  {
    ...baseGrain,
    id: "grain_artek",
    internalName: "Artek",
    name: { ru: "Артек", en: "Wheat Grits 'Artek'" },
    tags: [...baseGrain.tags, TAGS.CHEAP],
    // 1 кг, ~20 грн
    inventory: { maxStack: 5, weight: 1.0, basePrice: 20, rarity: "COMMON" },
    nutrition: {
      calories: 330, hydration: -10, proteins: 11, fats: 1, carbs: 70,
      digestibility: 0.9, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/artek.png" }
  },

  // --- МАКАРОНЫ (Pasta) ---

  {
    ...basePasta,
    id: "pasta_horns",
    internalName: "Rozhki",
    name: { ru: "Рожки / Перья", en: "Macaroni" },
    tags: [...basePasta.tags, TAGS.HOLLOW], // Полые внутри
    // 1 кг, ~30 грн (развесные или дешевая пачка)
    inventory: { maxStack: 5, weight: 1.0, basePrice: 30, rarity: "COMMON" },
    nutrition: {
      calories: 350, hydration: -5, proteins: 11, fats: 1, carbs: 72,
      digestibility: 0.9, volume: 1.0, gutStress: 0.0
    },
    assets: { icon: "icons/food/pasta_horns.png" }
  },

  {
    ...basePasta,
    id: "pasta_spaghetti",
    internalName: "Spaghetti",
    name: { ru: "Спагетти", en: "Spaghetti" },
    tags: [...basePasta.tags, TAGS.LONG], // Нужна кастрюля побольше или ломать
    // 400г пачка, ~35 грн (хорошие)
    inventory: { maxStack: 10, weight: 0.4, basePrice: 35, rarity: "COMMON" },
    nutrition: {
      calories: 350, hydration: -5, proteins: 12, fats: 1, carbs: 72,
      digestibility: 0.9, volume: 0.4, gutStress: 0.0
    },
    assets: { icon: "icons/food/spaghetti.png" }
  },

  {
    ...basePasta,
    id: "pasta_vermicelli",
    internalName: "Pautinka",
    name: { ru: "Вермишель Паутинка", en: "Vermicelli" },
    tags: [...basePasta.tags, TAGS.FAST_COOK], // Варится 2 минуты
    // 400г пачка, ~30 грн
    inventory: { maxStack: 10, weight: 0.4, basePrice: 30, rarity: "COMMON" },
    nutrition: {
      calories: 350, hydration: -5, proteins: 11, fats: 1, carbs: 72,
      digestibility: 0.95, volume: 0.4, gutStress: 0.0
    },
    assets: { icon: "icons/food/vermicelli.png" }
  },

  // --- БЫСТРОЕ (Instant) ---

  {
    ...baseInstant,
    id: "instant_mivina",
    internalName: "Mivina",
    name: { ru: "Мивина", en: "Instant Noodles" },
    tags: [...baseInstant.tags, TAGS.SALTY, TAGS.SPICY, TAGS.SURVIVAL],
    // 60г пачка, ~12 грн
    inventory: { maxStack: 20, weight: 0.06, basePrice: 12, rarity: "COMMON" },
    // Очень калорийная и жирная (фритированная лапша + масло)
    nutrition: {
      calories: 450, hydration: -20, proteins: 8, fats: 20, carbs: 55,
      digestibility: 0.8, volume: 0.06, gutStress: 0.2 // Гастрит
    },
    flavor: { sweet: 0, salty: 8, sour: 0, bitter: 0, umami: 8, spicy: 5, texture: "CRISPY" },
    assets: { icon: "icons/food/mivina.png" }
  }

];