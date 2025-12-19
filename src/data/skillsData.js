export const SKILLS_DATA = {
  hunting: {
    id: 'hunting',
    name: 'Охота',
    description: 'Умение выслеживать дичь и свежевать добычу.',
    icon: '🏹'
  },
  cooking: {
    id: 'cooking',
    name: 'Готовка',
    description: 'Способность готовить питательные блюда из простых ингредиентов.',
    icon: '🍳'
  },
  fishing: {
    id: 'fishing',
    name: 'Рыбалка',
    description: 'Мастерство ловли рыбы в любых водоемах.',
    icon: '🎣'
  },
  athletics: {
    id: 'athletics',
    name: 'Атлетика',
    description: 'Физическая выносливость и скорость бега.',
    icon: '🏃'
  },
  driving: {
    id: 'driving',
    name: 'Вождение',
    description: 'Навык управления транспортными средствами.',
    icon: '🚙'
  }
};

export const INITIAL_SKILLS = {
  hunting: { level: 1, xp: 0 },
  cooking: { level: 1, xp: 0 },
  fishing: { level: 1, xp: 0 },
  athletics: { level: 1, xp: 0 },
  driving: { level: 1, xp: 0 }
};

export const INITIAL_CHARACTER = {
  name: "Выживший",
  equipment: {
    head: null,
    body: null,
    legs: null,
    feet: null,
    mainHand: null,
    offHand: null
  }
};