/**
 * GLOBAL GAME TAGS & MECHANICS
 * Полный список механик, химии, состояний и типов предметов.
 * Используется в logic/crafting, logic/cooking и UI.
 */

export const TAGS = {
  // --- 1. ТИП МАТЕРИАЛА (Material Source) ---
  MEAT: "MEAT",             // Любое мясо
  FISH: "FISH",             // Рыба
  VEG: "VEG",               // Овощ
  RED_VEG: "RED_VEG",       // Красный овощ (Свекла/Томат) -> Триггер цвета (Борщ)
  FRUIT: "FRUIT",           // Фрукт
  FUNGUS: "FUNGUS",         // Гриб
  GRAIN: "GRAIN",           // Зерно/Крупа
  FAT: "FAT",               // Жир (Сало/Масло) -> Разрешает жарку на сковороде
  LIQUID: "LIQUID",         // Жидкость -> Требует сосуд
  SPICE: "SPICE",           // Специя -> Вес 0, меняет вкус
  ALCOHOL: "ALCOHOL",       // Спирт -> Дезинфекция, Опьянение, Горение
  SUGAR: "SUGAR",           // Сахар -> Энергия, Карамелизация
  WATER: "WATER",           // Вода -> Основа супа

  // --- 2. СОСТОЯНИЕ (State & Condition) ---
  RAW: "RAW",               // Сырое -> Риск паразитов/бактерий
  RARE: "RARE",             // С кровью -> Бонус силы (для стейков)
  COOKED: "DONE",           // Готовое -> Безопасно, макс. калорийность
  CRISPY: "CRISPY",         // Хрустящее -> Жажда++, Долго хранится
  BURNT: "BURNT",           // Сгоревшее -> Отравление, Мусор
  CHARCOAL: "CHARCOAL",     // Уголь -> Топливо
  FROZEN: "FROZEN",         // Заморожено -> Не портится, нельзя есть
  DIRTY: "DIRTY",           // Грязное -> Шанс отравления (надо мыть)
  DRIED: "DRIED",           // Вяленое (Таранка) -> Влага 0, вечное хранение
  SMOKED: "SMOKED",         // Копченое -> Вкус++, Хранение++
  CURED: "CURED",           // Соленое -> Промежуточный этап вяления
  FERMENTED: "FERMENTED",   // Квашеное -> Полезно для желудка (пробиотик)
  STERILIZED: "STERILIZED", // Стерилизовано (Консервы)
  PASTEURIZED: "PASTEURIZED", // Пастеризовано (Магазинное молоко)

  // --- 3. СТРУКТУРА И ОБРАБОТКА (Structure) ---
  BONE: "BONE",             // Кость -> Урон при еде, База для бульона
  SHELL: "SHELL",           // Панцирь/Скорлупа -> Надо чистить
  SCALES: "SCALES",         // Чешуя -> Надо чистить (рыбочистка)
  FILLET: "FILLET",         // Филе -> Чистое мясо
  MINCED: "MINCED",         // Фарш -> Котлеты
  POWDER: "POWDER",         // Порошок (Мука/Соль)
  PASTE: "PASTE",           // Тесто/Паштет
  WHOLE: "WHOLE",           // Цельная тушка (нужна разделка)
  PITTED: "PITTED",         // Без косточки (фрукты)
  UNPITTED: "UNPITTED",     // С косточкой

  // --- 4. ХИМИЯ И РЕАКЦИИ (Cooking Chemistry) ---
  ACID: "ACID",             // Кислота (Лимон/Уксус) -> Маринад, Борщ
  STARCH: "STARCH",         // Крахмал (Картофель/Мука) -> Густота
  GELLING: "GELLING",       // Желирующее (Кости/Мелочь) -> Уха/Холодец
  SOLUBLE: "SOLUBLE",       // Растворимое (Соль/Сахар)
  MELTABLE: "MELTABLE",     // Плавкое (Сыр/Сало)
  LEAVENING: "LEAVENING",   // Разрыхлитель (Дрожжи/Сода)
  CARAMEL: "CARAMEL",       // Карамелизация (Лук/Сахар при жарке)
  EMULSIFIER: "EMULSIFIER", // Эмульгатор (Яйцо/Горчица) -> Майонез

  // --- 5. ЭФФЕКТЫ (Effects) ---
  SALTY: "SALTY",           // Соленое -> Жажда++
  SPICY: "SPICY",           // Острое -> Согрев, Жажда++
  THIRSTY: "THIRSTY",       // Сушит (Сухари) -> Гидратация минус
  ANTIBIOTIC: "ANTIBIOTIC", // Антисептик (Чеснок/Водка) -> Иммунитет
  HANGOVER_CURE: "HANGOVER",// Антипохмелин (Рассол/Уха)
  CAFFEINE: "CAFFEINE",     // Кофеин -> Бодрость
  LAXATIVE: "LAXATIVE",     // Слабительное
  STRONG_SMELL: "SMELL",    // Ароматное -> Аппетит / Приманивание

  // --- 6. ИНВЕНТАРЬ И УПАКОВКА (Inventory) ---
  CANNED: "CANNED",         // Консерва -> Нужен нож, Долго хранится
  FRAGILE: "FRAGILE",       // Хрупкое -> Бьется при падении
  GRANULAR: "GRANULAR",     // Сыпучее
  LIQUID_CONTAINER: "VESSEL", // Может хранить жидкости
  NO_UTENSILS: "NO_UTENSILS", // Можно есть руками
  READY_TO_EAT: "READY"     // Не требует готовки
};