// Рыбы Днепра и озер в районе Канева
export const fishItems = [
  // --- Хищники ---
  {
    id: "fish_pike",
    name: "Щука",
    type: "food_raw",
    category: "fish_predator",
    weight: 2.5, // Средний вес
    calories: 200,
    description: "Хищная рыба. Обитает в зарослях прибрежной зоны Днепра.",
    rarity: "common",
    icon: "🐟"
  },
  {
    id: "fish_zander",
    name: "Судак",
    type: "food_raw",
    category: "fish_predator",
    weight: 1.8,
    calories: 180,
    description: "Ценная промысловая рыба. Любит чистое дно и течение.",
    rarity: "uncommon",
    icon: "🐟"
  },
  {
    id: "fish_perch",
    name: "Окунь",
    type: "food_raw",
    category: "fish_predator",
    weight: 0.4,
    calories: 80,
    description: "Полосатый хищник. Часто встречается стаями.",
    rarity: "common",
    icon: "🐠"
  },
  {
    id: "fish_catfish",
    name: "Сом",
    type: "food_raw",
    category: "fish_predator",
    weight: 8.0,
    calories: 1200,
    description: "Гигант днепровских ям. Очень сильная рыба.",
    rarity: "rare",
    icon: "🐋"
  },
  {
    id: "fish_asp",
    name: "Жерех",
    type: "food_raw",
    category: "fish_predator",
    weight: 2.0,
    calories: 220,
    description: "Осторожный хищник, охотится на поверхности.",
    rarity: "rare",
    icon: "🐟"
  },

  // --- Мирная рыба ---
  {
    id: "fish_roach",
    name: "Плотва",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 0.3,
    calories: 70,
    description: "Самая распространенная рыба. Клюет на все.",
    rarity: "very_common",
    icon: "🐟"
  },
  {
    id: "fish_bream",
    name: "Лещ",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 1.5,
    calories: 250,
    description: "Крупная стайная рыба. Любит глубину.",
    rarity: "common",
    icon: "🐟"
  },
  {
    id: "fish_carp",
    name: "Сазан (Дикий карп)",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 4.0,
    calories: 600,
    description: "Сильная рыба, обитающая в глубоких закоряженных местах.",
    rarity: "uncommon",
    icon: "🐟"
  },
  {
    id: "fish_crucian",
    name: "Карась",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 0.5,
    calories: 100,
    description: "Живучий обитатель озер и заводей Каневского водохранилища.",
    rarity: "common",
    icon: "🐟"
  },
  {
    id: "fish_tench",
    name: "Линь",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 0.8,
    calories: 120,
    description: "Осторожная рыба, обитающая в густой тине озер.",
    rarity: "rare",
    icon: "🐠"
  },
  {
    id: "fish_silver_bream",
    name: "Густера",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 0.2,
    calories: 50,
    description: "Похожа на леща, но мельче. Часто мешает ловить крупную рыбу.",
    rarity: "common",
    icon: "🐟"
  },
  {
    id: "fish_rudd",
    name: "Красноперка",
    type: "food_raw",
    category: "fish_peaceful",
    weight: 0.3,
    calories: 60,
    description: "Красивая рыба, обитающая в камышах на мелководье.",
    rarity: "common",
    icon: "🐠"
  }
];
