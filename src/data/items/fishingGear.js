export const fishingGear = [
  {
    id: "fishing_rod_simple",
    name: "Простая удочка",
    type: "gear",
    category: "fishing",
    weight: 0.8,
    description: "Старая бамбуковая удочка. Подходит для ловли мелкой и средней рыбы с берега.",
    durability: 100,
    icon: "🎣"
  },
  {
    id: "spinning_rod",
    name: "Спиннинг",
    type: "gear",
    category: "fishing",
    weight: 1.2,
    description: "Современный спиннинг с катушкой. Позволяет ловить хищную рыбу на блесну.",
    durability: 150,
    icon: "🎣"
  },
  {
    id: "fishing_line",
    name: "Леска (0.2мм)",
    type: "resource",
    category: "fishing",
    weight: 0.05,
    description: "Запасная леска. Необходима для ремонта удочек.",
    stackable: true,
    icon: "➰"
  },
  {
    id: "fishing_hooks",
    name: "Набор крючков",
    type: "resource",
    category: "fishing",
    weight: 0.02,
    description: "Коробка с крючками разного размера.",
    stackable: true,
    icon: "🪝"
  },
  {
    id: "worm_bait",
    name: "Черви",
    type: "consumable",
    category: "fishing_bait",
    weight: 0.1,
    description: "Банка с накопанными червями. Универсальная наживка.",
    stackable: true,
    icon: "🪱"
  },
  {
    id: "bread_bait",
    name: "Хлебный мякиш",
    type: "consumable",
    category: "fishing_bait",
    weight: 0.05,
    description: "Скатанный шарик хлеба. Любит мирная рыба.",
    stackable: true,
    icon: "🍘"
  }
];