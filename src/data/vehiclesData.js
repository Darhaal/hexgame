// =================================================================================
// 1. ТИПЫ МЕСТНОСТИ (TERRAIN)
// =================================================================================
// Коэффициенты: 1.0 = норма, <1 = замедление, 0 = непроходимо (Infinity)
// water: 1.0 = вода, 0.0 = суша
export const TERRAIN_MODIFIERS = {
    village:      { name: "Село/Асфальт", hard: 1.0, soft: 0.95, water: 0.0, risk: 0.0 },
    field:        { name: "Поле/Грунтовка", hard: 0.8, soft: 0.8, water: 0.0, risk: 0.1 },
    forest:       { name: "Лес/Чаща",      hard: 0.5, soft: 0.6, water: 0.0, risk: 0.3 }, // Высокий риск прокола
    river:        { name: "Река (Течение)", hard: 0.0, soft: 0.0, water: 1.0, risk: 0.2 },
    lake:         { name: "Озеро (Спокойное)", hard: 0.0, soft: 0.0, water: 1.0, risk: 0.1 },
    lough_river: { name: "Заводь/Камыш", hard: 0.0, soft: 0.0, water: 0.6, risk: 0.6 }, // Застревание винта
    great_river: { name: "Днепр (Фарватер)", hard: 0.0, soft: 0.0, water: 1.0, risk: 0.4 }, // Волны
    island:       { name: "Остров (Песок)", hard: 0.6, soft: 0.5, water: 0.0, risk: 0.1 },
};

// =================================================================================
// 2. ОБУВЬ (FOOTWEAR) - Влияет на пешую скорость и усталость
// =================================================================================
export const FOOTWEAR = {
    // --- TIER 0: Бесплатно / Самодел ---
    barefoot: {
        id: "barefoot", name: "Босиком",
        speedMod: 0.8, fatigueMod: 1.5,
        terrain: { village: 0.9, field: 1.0, forest: 0.4, island: 0.8 },
        desc: "Больно, но бесплатно."
    },
    slippers_diy: {
        id: "slippers_diy", name: "Тапки из камеры",
        speedMod: 0.85, fatigueMod: 1.4,
        terrain: { village: 0.9, field: 0.8, forest: 0.5, island: 0.6 },
        desc: "Самодельные, вечные, неудобные."
    },

    // --- TIER 1: Рынок / Дача ---
    slippers_foam: {
        id: "slippers_foam", name: "Шлепанцы (Пенка)",
        speedMod: 0.9, fatigueMod: 1.3,
        terrain: { village: 1.0, field: 0.6, forest: 0.2, island: 0.4 },
        desc: "Слетают в грязи."
    },
    galoshes_black: {
        id: "galoshes_black", name: "Галоши блестящие",
        speedMod: 0.95, fatigueMod: 1.2,
        terrain: { village: 1.0, field: 0.9, forest: 0.8, lough_river: 0.3 },
        desc: "На шерстяной носок - идеально."
    },
    sneakers_old: {
        id: "sneakers_old", name: "Кеды стоптанные",
        speedMod: 1.05, fatigueMod: 1.1,
        terrain: { village: 1.1, field: 1.0, forest: 0.8, island: 0.9 },
        desc: "Для сухого асфальта."
    },

    // --- TIER 2: Советская Классика ---
    boots_kirza: {
        id: "boots_kirza", name: "Кирзовые сапоги",
        speedMod: 1.0, fatigueMod: 1.3,
        terrain: { village: 1.0, field: 1.0, forest: 1.2, island: 1.0 },
        desc: "Солдатские. Неубиваемые."
    },
    boots_rubber_green: {
        id: "boots_rubber_green", name: "Сапоги болотные (Зеленые)",
        speedMod: 0.9, fatigueMod: 1.25,
        terrain: { village: 0.9, field: 0.9, forest: 1.0, lough_river: 0.7 },
        desc: "Высокие, можно зайти по колено."
    },
    sneakers_moscow: {
        id: "sneakers_moscow", name: "Кеды 'Москва'",
        speedMod: 1.1, fatigueMod: 1.0,
        terrain: { village: 1.2, field: 1.0, forest: 0.9, island: 0.9 },
        desc: "Легенда спорта."
    },

    // --- TIER 3: Спец-снаряжение ---
    boots_waders_ozk: {
        id: "boots_waders_ozk", name: "Бахилы ОЗК",
        speedMod: 0.6, fatigueMod: 1.8,
        terrain: { village: 0.5, field: 0.6, lough_river: 1.0, river: 0.8 },
        desc: "Химзащита. Тяжелые, но сухие."
    },
    boots_waders_pvc: {
        id: "boots_waders_pvc", name: "Заброды ПВХ",
        speedMod: 0.8, fatigueMod: 1.4,
        terrain: { village: 0.8, field: 0.9, lough_river: 1.0, river: 0.9 },
        desc: "Современные, легче резины."
    },

    // --- TIER 4: Импорт (Дорого) ---
    boots_lemigo: {
        id: "boots_lemigo", name: "Lemigo (EVA пенка)",
        speedMod: 1.1, fatigueMod: 0.8,
        terrain: { village: 1.0, field: 1.1, forest: 1.1, lough_river: 0.6 },
        desc: "Польские. Невесомые и теплые."
    },
    boots_norfin: {
        id: "boots_norfin", name: "Norfin Klondike",
        speedMod: 1.05, fatigueMod: 1.0,
        terrain: { village: 1.0, field: 1.1, forest: 1.2, island: 1.1 },
        desc: "Для зимней рыбалки. Шипы."
    },
    sneakers_adidas: {
        id: "sneakers_adidas", name: "Adidas Torsion",
        speedMod: 1.3, fatigueMod: 0.7,
        terrain: { village: 1.3, field: 1.2, forest: 0.9, island: 1.1 },
        desc: "Настоящая фирма. Бегать одно удовольствие."
    }
};

// =================================================================================
// 3. НЕСОСТАВНОЙ ТРАНСПОРТ (Simple)
// =================================================================================
export const SIMPLE_VEHICLES = {
    // --- РУЧНОЙ ---
    kickscooter_diy: {
        id: "kickscooter_diy", name: "Самокат на подшипниках",
        type: "scooter", speedBase: 12, cargo: 2,
        terrain: { village: 1.2, field: 0.1, forest: 0.0 },
        desc: "Грохочет на все село."
    },
    wheelbarrow: {
        id: "wheelbarrow", name: "Тачка строительная",
        type: "cart", speedBase: 2, cargo: 100,
        terrain: { village: 0.8, field: 0.6, forest: 0.3 },
        desc: "Одно колесо. Тяжело толкать."
    },
    kravchuchka: {
        id: "kravchuchka", name: "Кравчучка",
        type: "cart", speedBase: 4, cargo: 40,
        terrain: { village: 1.0, field: 0.9, forest: 0.5 },
        desc: "Народная тележка."
    },

    // --- ЖИВОТНЫЕ ---
    donkey: {
        id: "donkey", name: "Ослик",
        type: "animal", speedBase: 6, cargo: 60, fuelType: "oats",
        terrain: { village: 1.0, field: 1.0, forest: 1.0, island: 1.0 },
        desc: "Упрямый, но пройдет везде."
    },
    horse_old: {
        id: "horse_old", name: "Старая кобыла",
        type: "animal", speedBase: 8, cargo: 80, fuelType: "oats",
        terrain: { village: 1.0, field: 1.0, forest: 0.9 },
        desc: "Спокойная."
    },
    horse_draft: {
        id: "horse_draft", name: "Владимирский тяжеловоз",
        type: "animal", speedBase: 10, cargo: 200, fuelType: "oats",
        terrain: { village: 1.0, field: 1.1, forest: 0.8 },
        desc: "Тянет телегу с лодкой."
    },
    horse_race: {
        id: "horse_race", name: "Орловский рысак",
        type: "animal", speedBase: 30, cargo: 50, fuelType: "oats",
        terrain: { village: 1.3, field: 1.6, forest: 0.7 },
        desc: "Ветер в гриве."
    }
};

// =================================================================================
// 4. КОМПОНЕНТЫ: КУЗОВА (BODIES)
// =================================================================================
export const VEHICLE_BODIES = {
    // --- ВЕЛОСИПЕДЫ ---
    bike_shkolnik: {
        id: "bike_shkolnik", name: "Велосипед 'Школьник'", type: "bike",
        weight: 10, slots: { engine: false, wheels: "velo" }, durability: 60, desc: "Маленький, для подростков."
    },
    bike_kama: {
        id: "bike_kama", name: "Велосипед 'Кама'", type: "bike",
        weight: 14, slots: { engine: false, wheels: "velo" }, durability: 75, desc: "Складной, колеса 20 дюймов."
    },
    bike_ukraina: {
        id: "bike_ukraina", name: "Велосипед 'Украина'", type: "bike",
        weight: 16, slots: { engine: false, wheels: "velo" }, durability: 100, desc: "Рабочая лошадка. Рама вечная."
    },
    bike_ural: {
        id: "bike_ural", name: "Велосипед 'Урал'", type: "bike",
        weight: 17, slots: { engine: false, wheels: "velo" }, durability: 110, desc: "Тяжелый, неубиваемый."
    },
    bike_start: {
        id: "bike_start", name: "ХВЗ 'Старт-Шоссе'", type: "bike",
        weight: 11, slots: { engine: false, wheels: "velo" }, durability: 50, desc: "Спорт. Боится ям."
    },
    bike_kellys: {
        id: "bike_kellys", name: "MTB Kellys Spider", type: "bike",
        weight: 13, slots: { engine: false, wheels: "velo" }, durability: 90, desc: "Алюминий, амортизаторы."
    },

    // --- МОТО / МОПЕДЫ ---
    moped_riga13: {
        id: "moped_riga13", name: "Рига-13", type: "moto",
        weight: 40, slots: { engine: "moped", wheels: "moped" }, durability: 40, desc: "Газулька. Педали обязательны."
    },
    moped_karpaty: {
        id: "moped_karpaty", name: "Карпаты-2", type: "moto",
        weight: 55, slots: { engine: "moped", wheels: "moped" }, durability: 50, desc: "Легенда. Ломается чаще, чем ездит."
    },
    moped_delta: {
        id: "moped_delta", name: "РМЗ Дельта", type: "moto",
        weight: 57, slots: { engine: "moped", wheels: "moped" }, durability: 60, desc: "Чуть надежнее Карпат."
    },
    moto_minsk: {
        id: "moto_minsk", name: "Минск ММВЗ", type: "moto",
        weight: 105, cargo: 50, slots: { engine: "moto", wheels: "moto" }, durability: 120, desc: "Простой, легкий, надежный."
    },
    moto_voskhod: {
        id: "moto_voskhod", name: "Восход-3М", type: "moto",
        weight: 125, cargo: 60, slots: { engine: "moto", wheels: "moto" }, durability: 80, desc: "Заводится с толкача."
    },
    moto_izh_yup: {
        id: "moto_izh_yup", name: "ИЖ Юпитер-5", type: "moto",
        weight: 160, cargo: 100, slots: { engine: "moto", wheels: "moto" }, durability: 130, desc: "Два цилиндра, мощный."
    },
    moto_izh_plan: {
        id: "moto_izh_plan", name: "ИЖ Планета-5", type: "moto",
        weight: 158, cargo: 100, slots: { engine: "moto", wheels: "moto" }, durability: 150, desc: "Один цилиндр, тяговитый как трактор."
    },
    moto_jawa: {
        id: "moto_jawa", name: "Jawa 638", type: "moto",
        weight: 150, cargo: 80, slots: { engine: "moto", wheels: "moto" }, durability: 140, desc: "Бабьемагнит. Дефицит."
    },
    moto_dnepr: {
        id: "moto_dnepr", name: "Днепр МТ-11 (Коляска)", type: "moto",
        weight: 350, cargo: 300, slots: { engine: "moto", wheels: "moto" }, durability: 160, desc: "Тяжелый танк. Везет картошку."
    },
    moto_yamaha: {
        id: "moto_yamaha", name: "Yamaha YBR 125", type: "moto",
        weight: 110, cargo: 60, slots: { engine: "moto", wheels: "moto" }, durability: 250, desc: "Японец. Просто едет."
    },

    // --- ЛОДКИ ---
    // Дерево / Самодел
    boat_raft: {
        id: "boat_raft", name: "Плот из камер", type: "boat", material: "rubber",
        weight: 15, slots: { engine: false, wheels: "water" }, durability: 10, desc: "Опасно. Только для отчаянных."
    },
    boat_wood_punt: {
        id: "boat_wood_punt", name: "Плоскодонка", type: "boat", material: "wood",
        weight: 80, slots: { engine: "boat", wheels: "water" }, durability: 50, desc: "Самодельная из досок."
    },
    boat_oak: {
        id: "boat_oak", name: "Дубовка", type: "boat", material: "wood",
        weight: 120, slots: { engine: "boat", wheels: "water" }, durability: 150, desc: "Тяжелая, устойчивая."
    },
    // Резина / ПВХ
    boat_lisichanka: {
        id: "boat_lisichanka", name: "Лисичанка", type: "boat", material: "rubber",
        weight: 12, slots: { engine: false, wheels: "water" }, durability: 30, desc: "Легкая, но гниет."
    },
    boat_ufimka: {
        id: "boat_ufimka", name: "Уфимка-22", type: "boat", material: "rubber",
        weight: 18, slots: { engine: false, wheels: "water" }, durability: 40, desc: "Классика."
    },
    boat_nyrok: {
        id: "boat_nyrok", name: "Нырок-2", type: "boat", material: "rubber",
        weight: 20, slots: { engine: false, wheels: "water" }, durability: 45, desc: "Надувное дно."
    },
    boat_bark: {
        id: "boat_bark", name: "Bark B-260", type: "boat", material: "pvc",
        weight: 22, slots: { engine: "boat", wheels: "water" }, durability: 100, desc: "Украинский ПВХ. Надежная."
    },
    boat_zodiac: {
        id: "boat_zodiac", name: "Zodiac Cadet 310", type: "boat", material: "pvc",
        weight: 35, slots: { engine: "boat", wheels: "water" }, durability: 130, desc: "Франция. Киль, жесткий пол."
    },
    // Металл
    boat_yaz: {
        id: "boat_yaz", name: "Язь", type: "boat", material: "amg",
        weight: 60, slots: { engine: "boat", wheels: "water" }, durability: 120, desc: "Легкая дюралька на одного."
    },
    boat_kazanka: {
        id: "boat_kazanka", name: "Казанка-М (Южанка)", type: "boat", material: "dural",
        weight: 145, slots: { engine: "boat", wheels: "water" }, durability: 200, desc: "С булями. Бьет волну."
    },
    boat_krym: {
        id: "boat_krym", name: "Крым", type: "boat", material: "amg",
        weight: 170, slots: { engine: "boat", wheels: "water" }, durability: 400, desc: "Сварная, вечная."
    },
    boat_progress4: {
        id: "boat_progress4", name: "Прогресс-4", type: "boat", material: "dural",
        weight: 220, slots: { engine: "boat", wheels: "water" }, durability: 300, desc: "Утюг. Грузоподъемный."
    },
    boat_buster: {
        id: "boat_buster", name: "Buster M", type: "boat", material: "amg",
        weight: 230, slots: { engine: "boat", wheels: "water" }, durability: 500, desc: "Финский идеал."
    },

    // --- АВТОМОБИЛИ ---
    car_zaz965: {
        id: "car_zaz965", name: "ЗАЗ-965 'Горбатый'", type: "car",
        weight: 650, cargo: 50, slots: { engine: "auto", wheels: "auto" }, durability: 70, desc: "Тесно, жарко, весело."
    },
    car_zaz968m: {
        id: "car_zaz968m", name: "ЗАЗ-968М 'Мыльница'", type: "car",
        weight: 840, cargo: 100, slots: { engine: "auto", wheels: "auto" }, durability: 80, desc: "Проходимость за счет плоского дна."
    },
    car_luaz: {
        id: "car_luaz", name: "ЛуАЗ-969 'Волынь'", type: "car",
        weight: 960, cargo: 300, slots: { engine: "auto", wheels: "auto" }, durability: 120, desc: "Танк. Комфорт отсутствует."
    },
    car_moskvich412: {
        id: "car_moskvich412", name: "Москвич 412", type: "car",
        weight: 1040, cargo: 400, slots: { engine: "auto", wheels: "auto" }, durability: 90, desc: "Дачный вариант."
    },
    car_vaz2101: {
        id: "car_vaz2101", name: "ВАЗ-2101 'Копейка'", type: "car",
        weight: 955, cargo: 200, slots: { engine: "auto", wheels: "auto" }, durability: 85, desc: "Итальянские корни."
    },
    car_vaz2106: {
        id: "car_vaz2106", name: "ВАЗ-2106 'Шаха'", type: "car",
        weight: 1035, cargo: 200, slots: { engine: "auto", wheels: "auto" }, durability: 85, desc: "Мягкая, престижная."
    },
    car_niva: {
        id: "car_niva", name: "ВАЗ-2121 'Нива'", type: "car",
        weight: 1150, cargo: 250, slots: { engine: "auto", wheels: "auto" }, durability: 100, desc: "4x4. Лучшее для рыбалки."
    },
    car_uaz469: {
        id: "car_uaz469", name: "УАЗ-469 'Бобик'", type: "car",
        weight: 1650, cargo: 600, slots: { engine: "auto", wheels: "auto" }, durability: 200, desc: "Военный козел."
    },
    car_uaz452: {
        id: "car_uaz452", name: "УАЗ-452 'Буханка'", type: "car",
        weight: 1760, cargo: 800, slots: { engine: "auto", wheels: "auto" }, durability: 180, desc: "Дом на колесах."
    },
    car_volga24: {
        id: "car_volga24", name: "ГАЗ-24 'Волга'", type: "car",
        weight: 1420, cargo: 400, slots: { engine: "auto", wheels: "auto" }, durability: 150, desc: "Баржа."
    },
    car_opel: {
        id: "car_opel", name: "Opel Kadett E Caravan", type: "car",
        weight: 1000, cargo: 450, slots: { engine: "auto", wheels: "auto" }, durability: 90, desc: "Немецкий сарай."
    },
    car_audi: {
        id: "car_audi", name: "Audi 100 C3 (Сигара)", type: "car",
        weight: 1300, cargo: 500, slots: { engine: "auto", wheels: "auto" }, durability: 160, desc: "Оцинкованный, не гниет."
    },
    car_passat: {
        id: "car_passat", name: "VW Passat B3 Variant", type: "car",
        weight: 1350, cargo: 600, slots: { engine: "auto", wheels: "auto" }, durability: 170, desc: "Контрабандист. Огромный багажник."
    },
    car_cruiser: {
        id: "car_cruiser", name: "Toyota Land Cruiser 80", type: "car",
        weight: 2200, cargo: 800, slots: { engine: "auto", wheels: "auto" }, durability: 300, desc: "Японский император."
    },
    car_gelik: {
        id: "car_gelik", name: "Mercedes G-Class W460", type: "car",
        weight: 2000, cargo: 500, slots: { engine: "auto", wheels: "auto" }, durability: 250, desc: "Для серьезных людей."
    }
};

// =================================================================================
// 5. КОМПОНЕНТЫ: ДВИГАТЕЛИ И ХОДОВАЯ
// =================================================================================
export const ENGINES = {
    // --- НОГИ ---
    legs_tired: { id: "legs_tired", name: "Ноги (Уставшие)", power: 0.1, fuel: "food", noise: 0 },
    legs_norm: { id: "legs_norm", name: "Ноги (Обычные)", power: 0.15, fuel: "food", noise: 0 },
    legs_strong: { id: "legs_strong", name: "Ноги (Тренированные)", power: 0.25, fuel: "food", noise: 0 },

    // --- МОПЕДЫ/МОТО (СССР) ---
    d6: { id: "d6", name: "Д-6 (1.2 л.с.)", power: 1.2, fuel: "petrol", noise: 4, desc: "Дырчик" },
    v50: { id: "v50", name: "V-50 (1.8 л.с.)", power: 1.8, fuel: "petrol", noise: 5, desc: "Шауляй" },
    minsk_eng: { id: "minsk_eng", name: "ММВЗ-3.112 (10 л.с.)", power: 10, fuel: "petrol", noise: 6, desc: "Надежный" },
    izh_yup_eng: { id: "izh_yup_eng", name: "Юпитер-5 (24 л.с.)", power: 24, fuel: "petrol", noise: 8, desc: "Звенит пальцами" },
    izh_plan_eng: { id: "izh_plan_eng", name: "Планета-5 (22 л.с.)", power: 22, fuel: "petrol", noise: 9, desc: "Тракторная тяга" },
    dnepr_eng: { id: "dnepr_eng", name: "МТ-10-36 (36 л.с.)", power: 36, fuel: "petrol", noise: 9, desc: "Греется, ест масло" },
    // --- МОТО (ИМПОРТ) ---
    jawa_eng: { id: "jawa_eng", name: "Jawa 638 (26 л.с.)", power: 26, fuel: "petrol", noise: 5, desc: "Мягкий звук" },
    yamaha_eng: { id: "yamaha_eng", name: "Yamaha 125 (10 л.с.)", power: 10, fuel: "petrol", noise: 3, desc: "Шепчет" },

    // --- ЛОДОЧНЫЕ (СССР) ---
    salut: { id: "salut", name: "Салют-Э (2 л.с.)", power: 2, fuel: "petrol", noise: 5, desc: "Миксер" },
    veterok8: { id: "veterok8", name: "Ветерок-8М", power: 8, fuel: "petrol", noise: 7, desc: "Народный" },
    veterok12: { id: "veterok12", name: "Ветерок-12", power: 12, fuel: "petrol", noise: 8, desc: "Ресурс меньше" },
    moskva10: { id: "moskva10", name: "Москва-10", power: 10, fuel: "petrol", noise: 7, desc: "Сложный редуктор" },
    neptun23: { id: "neptun23", name: "Нептун-23", power: 23, fuel: "petrol", noise: 8, desc: "Надежный, тяговитый" },
    vihr25: { id: "vihr25", name: "Вихрь-M (25 л.с.)", power: 25, fuel: "petrol", noise: 9, desc: "Классика" },
    vihr30: { id: "vihr30", name: "Вихрь-30 Электрон", power: 30, fuel: "petrol", noise: 10, desc: "Мощь и боль" },
    privet22: { id: "privet22", name: "Привет-22", power: 22, fuel: "petrol", noise: 7, desc: "Тихий, редкий" },
    // --- ЛОДОЧНЫЕ (ИМПОРТ) ---
    suzuki25: { id: "suzuki25", name: "Suzuki DF 2.5", power: 2.5, fuel: "petrol", noise: 2, desc: "4-тактный малыш" },
    tohatsu98: { id: "tohatsu98", name: "Tohatsu 9.8", power: 9.8, fuel: "petrol", noise: 4, desc: "Легенда веса" },
    yamaha15: { id: "yamaha15", name: "Yamaha 15FMHS", power: 15, fuel: "petrol", noise: 5, desc: "Эталон" },
    mercury30: { id: "mercury30", name: "Mercury 30 ELPT", power: 30, fuel: "petrol", noise: 6, desc: "США" },
    honda50: { id: "honda50", name: "Honda BF50", power: 50, fuel: "petrol", noise: 4, desc: "Вечный" },
    johnson: { id: "johnson", name: "Johnson 4hp (Старый)", power: 4, fuel: "petrol", noise: 6, desc: "Неубиваемый" },

    // --- АВТО (СССР) ---
    memz965: { id: "memz965", name: "МеМЗ-965 (27 л.с.)", power: 27, fuel: "petrol", noise: 8, desc: "V4 Воздушка" },
    memz968: { id: "memz968", name: "МеМЗ-968 (40 л.с.)", power: 40, fuel: "petrol", noise: 8, desc: "Перегревается" },
    uzam412: { id: "uzam412", name: "УЗАМ-412 (75 л.с.)", power: 75, fuel: "petrol", noise: 6, desc: "Гильзованный" },
    vaz2101: { id: "vaz2101", name: "ВАЗ-2101 (64 л.с.)", power: 64, fuel: "petrol", noise: 5, desc: "Копеечный" },
    vaz2103: { id: "vaz2103", name: "ВАЗ-2103 (72 л.с.)", power: 72, fuel: "petrol", noise: 5, desc: "Резвый" },
    zmz402: { id: "zmz402", name: "ЗМЗ-402 (100 л.с.)", power: 100, fuel: "petrol", noise: 7, desc: "На 76-м бензине" },
    zmz511: { id: "zmz511", name: "ЗМЗ-511 V8 (120 л.с.)", power: 120, fuel: "petrol", noise: 9, desc: "От Газона. Жрет 30л" },
    // --- АВТО (ИМПОРТ) ---
    opel_diesel: { id: "opel_diesel", name: "Opel 1.6D (54 л.с.)", power: 54, fuel: "diesel", noise: 7, desc: "Трахтит, но едет" },
    audi_23: { id: "audi_23", name: "Audi 2.3E (136 л.с.)", power: 136, fuel: "petrol", noise: 4, desc: "5 цилиндров, Jetronic" },
    vw_19td: { id: "vw_19td", name: "VW 1.9 TD (75 л.с.)", power: 75, fuel: "diesel", noise: 6, desc: "Работяга" },
    toyota_1hz: { id: "toyota_1hz", name: "Toyota 1HZ (130 л.с.)", power: 130, fuel: "diesel", noise: 5, desc: "4.2 Атмосферник" },
    merc_om617: { id: "merc_om617", name: "Mercedes OM617 (88 л.с.)", power: 88, fuel: "diesel", noise: 6, desc: "Миллионник" }
};

export const WHEELS = {
    // --- ВЕЛО ---
    velo_ussr: { id: "velo_ussr", name: "Сток (Украина)", mod: { village: 1.0, field: 0.9, forest: 0.7 } },
    velo_kama: { id: "velo_kama", name: "Малые (Кама/Десна)", mod: { village: 0.9, field: 0.7, forest: 0.5 } },
    velo_racing: { id: "velo_racing", name: "Трубки (Шоссе)", mod: { village: 1.3, field: 0.3, forest: 0.1 } },
    velo_mtb: { id: "velo_mtb", name: "Злая резина (Maxxis)", mod: { village: 0.9, field: 1.2, forest: 1.1 } },

    // --- МОТО ---
    moped_thin: { id: "moped_thin", name: "Узкие (Рига)", mod: { village: 1.0, field: 0.7, forest: 0.5 } },
    moto_road: { id: "moto_road", name: "ИЖ Дорожные (И-151)", mod: { village: 1.1, field: 0.8, forest: 0.5 } },
    moto_cross: { id: "moto_cross", name: "Кросс (Петрошина)", mod: { village: 0.8, field: 1.3, forest: 1.2 } },
    moto_sidecar: { id: "moto_sidecar", name: "Колясочные", mod: { village: 0.9, field: 0.9, forest: 0.7 } },

    // --- АВТО ---
    auto_bald: { id: "auto_bald", name: "Лысая БЛ-85", mod: { village: 1.1, field: 0.5, forest: 0.2 } },
    auto_moskvich: { id: "auto_moskvich", name: "И-151 (Узкая)", mod: { village: 1.0, field: 0.8, forest: 0.6 } },
    auto_winter: { id: "auto_winter", name: "Снежинка (Шипы)", mod: { village: 0.9, field: 0.9, forest: 0.8 } },
    auto_niva: { id: "auto_niva", name: "Вли-5 (Нива)", mod: { village: 0.8, field: 1.2, forest: 1.2 } },
    auto_uaz: { id: "auto_uaz", name: "Я-245 (Шашка)", mod: { village: 0.7, field: 1.2, forest: 1.3 } },
    auto_tractor: { id: "auto_tractor", name: "Елочка (Тракторная)", mod: { village: 0.6, field: 1.4, forest: 1.5 } },
    auto_at: { id: "auto_at", name: "BFGoodrich A/T", mod: { village: 1.0, field: 1.2, forest: 1.1 } }, // Импорт
    auto_mud: { id: "auto_mud", name: "Simex Jungle Trekker", mod: { village: 0.6, field: 1.5, forest: 1.5 } }, // Импорт экстрим

    // --- ВОДА (ДВИЖИТЕЛИ) ---
    pole: { id: "pole", name: "Шест", mod: { river: 0.3, lake: 0.3, lough_river: 1.5, great_river: 0.1 } }, // В камышах топ
    oars_wood: { id: "oars_wood", name: "Весла деревянные", mod: { river: 0.5, lake: 0.6, lough_river: 1.0, great_river: 0.4 } },
    oars_dural: { id: "oars_dural", name: "Весла дюралевые", mod: { river: 0.6, lake: 0.7, lough_river: 0.9, great_river: 0.5 } },
    prop_std: { id: "prop_std", name: "Винт стандарт", mod: { river: 1.0, lake: 1.0, lough_river: 0.4, great_river: 1.0 } },
    prop_cargo: { id: "prop_cargo", name: "Винт грузовой (Шаг 260)", mod: { river: 0.9, lake: 0.9, lough_river: 0.5, great_river: 0.9 } },
    prop_speed: { id: "prop_speed", name: "Винт скоростной (Шаг 300)", mod: { river: 1.2, lake: 1.2, lough_river: 0.2, great_river: 1.2 } },
    prop_stainless: { id: "prop_stainless", name: "Винт Solas (Сталь)", mod: { river: 1.1, lake: 1.1, lough_river: 0.5, great_river: 1.1 } },
    jet: { id: "jet", name: "Водометная насадка", mod: { river: 0.9, lake: 0.9, lough_river: 1.2, great_river: 0.9 } } // Проходит мели
};