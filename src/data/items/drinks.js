export const drinkItems = [
  {
    id: "water_bottle_1l",
    name: "Бутылка воды (1л)",
    type: "drink",
    category: "water",
    weight: 1.0,
    thirst_quench: 100,
    description: "Чистая питьевая вода.",
    icon: "💧"
  },
  {
    id: "flask_tea",
    name: "Термос с чаем",
    type: "drink",
    category: "hot_drink",
    weight: 0.8,
    thirst_quench: 60,
    warming: 20, // Параметр согревания
    description: "Горячий сладкий чай. Согревает.",
    icon: "☕"
  },
  {
    id: "vodka",
    name: "Водка",
    type: "drink",
    category: "alcohol",
    weight: 0.5,
    thirst_quench: -10,
    warming: 40, // Ложное согревание/снятие стресса
    description: "Для дезинфекции и снятия стресса.",
    icon: "🍾"
  }
];