import { TAGS } from "../itemtags";

// =============================================================================
// БАЗОВЫЕ КОНФИГУРАЦИИ
// =============================================================================

const baseRawFish = {
  category: "FOOD",
  physicalState: "SOLID",
  tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.BONE],
  packaging: {
    type: "NONE",
    isOpen: true,
    requiresTool: null,
    returnItem: "fish_bones_raw",
    maxServings: 1,
    currentServings: 1,
    isDivisible: false
  },
  lifecycle: {
    creationDate: 0,
    sealedDate: null,
    openedDate: null,
    shelfLifeOpen: 86400,
    shelfLifeSealed: 0,
    aging: { isAgeable: false }
  },
  thermodynamics: {
    currentTemp: 15,
    specificHeat: 3.6,
    freezingPoint: -2,
    meltingPoint: 0,
    cookingPoint: 55,
    burningPoint: 170,
    carbonizationPoint: 300
  },
  risks: [
    { type: "PARASITES", chanceBase: 0.25, chancePerDayExpired: 0.5, severity: "MEDIUM" },
    { type: "BONE_CHOKE", chanceBase: 0.1, severity: "MINOR" }
  ]
};

export const fishItems = [
  // --- МЕЛОЧЬ ---
  {
    ...baseRawFish,
    id: "fish_verkhovka",
    internalName: "Verkhovka",
    name: { ru: "Верховодка (Уклейка)", en: "Bleak" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.GELLING, TAGS.WHOLE, TAGS.FRAGILE],
    inventory: { maxStack: 50, weight: 0.04, basePrice: 2, rarity: "COMMON" },
    nutrition: { calories: 38, hydration: 0, proteins: 6.8, fats: 1.2, carbs: 0, digestibility: 0.9, volume: 0.04, gutStress: 0.0 },
    flavor: { sweet: 1, salty: 0, sour: 0, bitter: 0, umami: 2, spicy: 0, texture: "SOFT" },
    assets: { icon: "icons/fish/verkhovka.png", model: "models/fish/verkhovka.glb" }
  },
  {
    ...baseRawFish,
    id: "fish_gudgeon",
    internalName: "Peskar",
    name: { ru: "Пескарь", en: "Gudgeon" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.GELLING],
    inventory: { maxStack: 50, weight: 0.06, basePrice: 4, rarity: "COMMON" },
    nutrition: { calories: 42, hydration: 0, proteins: 9, fats: 0.6, carbs: 0, digestibility: 0.9, volume: 0.06, gutStress: 0.0 },
    assets: { icon: "icons/fish/peskar.png" }
  },
  {
    ...baseRawFish,
    id: "fish_ruffe",
    internalName: "Ersh",
    name: { ru: "Ерш", en: "Ruffe" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.GELLING, TAGS.BONE],
    inventory: { maxStack: 20, weight: 0.08, basePrice: 3, rarity: "COMMON" },
    nutrition: { calories: 50, hydration: 0, proteins: 10, fats: 0.8, carbs: 0, digestibility: 0.85, volume: 0.08, gutStress: 0.0 },
    assets: { icon: "icons/fish/ersh.png" }
  },
  {
    ...baseRawFish,
    id: "fish_goby_fresh",
    internalName: "Goby",
    name: { ru: "Бычок", en: "Goby" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.GELLING],
    inventory: { maxStack: 20, weight: 0.1, basePrice: 4, rarity: "COMMON" },
    nutrition: { calories: 70, hydration: 0, proteins: 12, fats: 2, carbs: 0, digestibility: 0.9, volume: 0.1, gutStress: 0.0 },
    assets: { icon: "icons/fish/goby.png" }
  },
  {
    ...baseRawFish,
    id: "fish_rotan",
    internalName: "Rotan",
    name: { ru: "Ротан", en: "Chinese Sleeper" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.FILLET],
    inventory: { maxStack: 10, weight: 0.2, basePrice: 2, rarity: "COMMON" },
    nutrition: { calories: 170, hydration: 0, proteins: 32, fats: 4, carbs: 0, digestibility: 0.9, volume: 0.2, gutStress: 0.0 },
    assets: { icon: "icons/fish/rotan.png" }
  },
  {
    ...baseRawFish,
    id: "fish_loach",
    internalName: "Vyun",
    name: { ru: "Вьюн", en: "Loach" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SLIMY],
    inventory: { maxStack: 10, weight: 0.15, basePrice: 15, rarity: "UNCOMMON" },
    nutrition: { calories: 130, hydration: 0, proteins: 24, fats: 3, carbs: 0, digestibility: 0.8, volume: 0.15, gutStress: 0.0 },
    assets: { icon: "icons/fish/vyun.png" }
  },
  // --- СТАНДАРТ ---
  {
    ...baseRawFish,
    id: "fish_crucian_silver",
    internalName: "Karas_Silver",
    name: { ru: "Карась (Серебряный)", en: "Prussian Carp" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.BONE, TAGS.CARAMEL],
    inventory: { maxStack: 5, weight: 0.4, basePrice: 24, rarity: "COMMON" },
    nutrition: { calories: 348, hydration: 0, proteins: 70.8, fats: 7.2, carbs: 0, digestibility: 0.85, volume: 0.4, gutStress: 0.0 },
    assets: { icon: "icons/fish/karas_silver.png" }
  },
  {
    ...baseRawFish,
    id: "fish_crucian_gold",
    internalName: "Karas_Gold",
    name: { ru: "Карась (Золотой)", en: "Crucian Carp" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.BONE],
    inventory: { maxStack: 5, weight: 0.6, basePrice: 42, rarity: "UNCOMMON" },
    nutrition: { calories: 522, hydration: 0, proteins: 106, fats: 10, carbs: 0, digestibility: 0.85, volume: 0.6, gutStress: 0.0 },
    assets: { icon: "icons/fish/karas_gold.png" }
  },
  {
    ...baseRawFish,
    id: "fish_roach_common",
    internalName: "Plotva",
    name: { ru: "Плотва", en: "Roach" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.BONE],
    lifecycle: { ...baseRawFish.lifecycle, drying: { canDry: true, dryTime: 259200, resultId: "dried_roach" } },
    inventory: { maxStack: 10, weight: 0.3, basePrice: 15, rarity: "COMMON" },
    nutrition: { calories: 264, hydration: 0, proteins: 54, fats: 5, carbs: 0, digestibility: 0.9, volume: 0.3, gutStress: 0.0 },
    assets: { icon: "icons/fish/plotva.png" }
  },
  {
    ...baseRawFish,
    id: "fish_rudd",
    internalName: "Krasnoperka",
    name: { ru: "Красноперка", en: "Rudd" },
    inventory: { maxStack: 10, weight: 0.25, basePrice: 11, rarity: "COMMON" },
    nutrition: { calories: 210, hydration: 0, proteins: 42, fats: 4, carbs: 0, digestibility: 0.85, volume: 0.25, gutStress: 0.0 },
    assets: { icon: "icons/fish/krasnoperka.png" }
  },
  {
    ...baseRawFish,
    id: "fish_blicca",
    internalName: "Gustera",
    name: { ru: "Густера", en: "Silver Bream" },
    inventory: { maxStack: 10, weight: 0.35, basePrice: 14, rarity: "COMMON" },
    nutrition: { calories: 340, hydration: 0, proteins: 60, fats: 10, carbs: 0, digestibility: 0.8, volume: 0.35, gutStress: 0.0 },
    assets: { icon: "icons/fish/gustera.png" }
  },
  {
    ...baseRawFish,
    id: "fish_bream_large",
    internalName: "Leshch",
    name: { ru: "Лещ", en: "Bream" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.FAT],
    inventory: { maxStack: 2, weight: 1.5, basePrice: 135, rarity: "COMMON" },
    nutrition: { calories: 1575, hydration: 0, proteins: 255, fats: 66, carbs: 0, digestibility: 0.85, volume: 1.5, gutStress: 0.1 },
    assets: { icon: "icons/fish/leshch.png" }
  },
  {
    ...baseRawFish,
    id: "fish_tench",
    internalName: "Lin",
    name: { ru: "Линь", en: "Tench" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SLIMY],
    inventory: { maxStack: 3, weight: 0.8, basePrice: 96, rarity: "UNCOMMON" },
    nutrition: { calories: 320, hydration: 0, proteins: 140, fats: 14, carbs: 0, digestibility: 0.9, volume: 0.8, gutStress: 0.0 },
    assets: { icon: "icons/fish/lin.png" }
  },
  {
    ...baseRawFish,
    id: "fish_sabrefish",
    internalName: "Chehon",
    name: { ru: "Чехонь", en: "Sabrefish" },
    lifecycle: { ...baseRawFish.lifecycle, drying: { canDry: true, dryTime: 259200, resultId: "dried_chehon" } },
    inventory: { maxStack: 10, weight: 0.4, basePrice: 44, rarity: "UNCOMMON" },
    nutrition: { calories: 300, hydration: 0, proteins: 70, fats: 8, carbs: 0, digestibility: 0.9, volume: 0.4, gutStress: 0.0 },
    assets: { icon: "icons/fish/chehon.png" }
  },
  // --- ТРОФЕИ ---
  {
    ...baseRawFish,
    id: "fish_carp_common",
    internalName: "Carp",
    name: { ru: "Карп (Чешуйчатый)", en: "Common Carp" },
    tags: [TAGS.FISH, TAGS.RAW, TAGS.SCALES, TAGS.FILLET, TAGS.FAT],
    inventory: { maxStack: 1, weight: 4.0, basePrice: 480, rarity: "UNCOMMON" },
    packaging: { ...baseRawFish.packaging, maxServings: 8, currentServings: 8, isDivisible: true },
    nutrition: { calories: 4480, hydration: 0, proteins: 640, fats: 212, carbs: 0, digestibility: 0.85, volume: 0.5, gutStress: 0.1 },
    flavor: { sweet: 4, salty: 0, sour: 0, bitter: 0, umami: 8, spicy: 0, texture: "SOFT" },
    assets: { icon: "icons/fish/carp_common.png" }
  }
];