import { getGameDate } from "../time/DateSystem";

// Средние температуры (Днепр)
const AVG_TEMP_DAY =  [-2, -1, 5, 14, 21, 25, 28, 27, 21, 13, 5, 0];
const AVG_TEMP_NIGHT = [-7, -6, -2, 4, 11, 15, 17, 16, 11, 5, 1, -4];

// Шанс осадков
const PRECIP_CHANCE = [0.45, 0.45, 0.4, 0.35, 0.35, 0.4, 0.3, 0.25, 0.3, 0.4, 0.5, 0.5];

function getNoise(x) {
    return (Math.sin(x) + Math.sin(x * 2.1) * 0.5 + Math.sin(x * 0.5) * 0.5) / 2;
}

export function getWeather(totalMinutes, tile = null) {
    const date = getGameDate(totalMinutes);
    const m = date.monthIndex;

    // --- 1. ТЕМПЕРАТУРА ---
    const timeInDay = date.hours * 60 + date.minutes;
    const dayProgress = ((timeInDay - 900) / 720) * Math.PI;
    const diurnalFactor = Math.cos(dayProgress);

    let baseTemp = (diurnalFactor > 0)
        ? AVG_TEMP_NIGHT[m] + (AVG_TEMP_DAY[m] - AVG_TEMP_NIGHT[m]) * diurnalFactor
        : AVG_TEMP_NIGHT[m] + (AVG_TEMP_DAY[m] - AVG_TEMP_NIGHT[m]) * (1 + diurnalFactor) * 0.3;

    // Фронты меняются раз в 3 дня
    const frontNoise = getNoise(totalMinutes / (60 * 24 * 3));
    let temp = Math.round(baseTemp + frontNoise * 8);

    // --- 2. УСЛОВИЯ (CONDITION) ---
    const frontSeed = totalMinutes / (12 * 60);
    const frontVal = Math.sin(frontSeed);

    const rainThreshold = 1.0 - PRECIP_CHANCE[m] * 1.5;

    // A. Облачность (Предвестник)
    let cloudIntensity = 0;
    if (frontVal > rainThreshold - 0.25) {
        cloudIntensity = (frontVal - (rainThreshold - 0.25)) / (1 - (rainThreshold - 0.25));
        cloudIntensity = Math.min(1, Math.max(0, cloudIntensity));
    }

    // B. Осадки
    let precipIntensity = 0;
    let condition = "clear";

    if (frontVal > rainThreshold) {
        precipIntensity = (frontVal - rainThreshold) / (1 - rainThreshold);
        // Вариативность ливня внутри фронта
        const burstNoise = (Math.sin(totalMinutes / 20) + 1) / 2;
        precipIntensity = precipIntensity * 0.6 + burstNoise * 0.4;

        if (temp <= 0) {
            condition = "snow";
        } else {
            condition = "rain";
            // Шторм: Лето + Сильный ливень
            const stormNoise = Math.sin(totalMinutes / 15);
            if (m >= 4 && m <= 8 && precipIntensity > 0.75 && stormNoise > 0.6) {
                condition = "storm";
            }
        }
    } else {
        if (cloudIntensity > 0.3) condition = "cloudy";
    }

    // --- 3. ВЕТЕР ---
    // База от сезона (Зимой/Осенью сильнее)
    let windBase = (m < 2 || m > 9) ? 5 : 2;

    // Влияние погоды на ветер (СВЯЗЬ)
    // 1. Чем сильнее дождь, тем сильнее ветер (шквал)
    if (condition === "rain" || condition === "storm") {
        windBase += precipIntensity * 8;
    }
    // 2. В грозу еще сильнее
    if (condition === "storm") windBase += 10;

    // 3. Перед дождем (тучи) ветер поднимается
    if (condition === "cloudy" && cloudIntensity > 0.6) windBase += 3;

    // Порывы
    const windGust = Math.abs(Math.sin(totalMinutes / 10)) * 4;
    let wind = Math.round(windBase + windGust);

    // Влияние местности
    if (tile) {
        if (tile.type === 'forest') wind = Math.round(wind * 0.5);
        if (['river', 'great_river', 'lake'].includes(tile.type)) wind = Math.round(wind * 1.4);
    }

    // --- 4. ВЛАЖНОСТЬ ---
    let humidity = 50;
    if (condition !== "clear") humidity = 70 + cloudIntensity * 29; // До 99%
    if (tile && ['river', 'lake', 'great_river'].includes(tile.type)) humidity += 20;

    // --- 5. ТУМАН ---
    let isFoggy = false;
    const fogRandom = Math.sin(getGameDate(totalMinutes).day * 12.34);

    // Условие тумана: Влажно + Тихо + (Утро или Вечер)
    if (humidity > 90 && wind < 4 && fogRandom > 0) {
        if ((date.hours >= 4 && date.hours <= 8) || (date.hours >= 20 && date.hours <= 23)) {
            isFoggy = true;
        }
    }
    humidity = Math.min(100, Math.max(15, Math.round(humidity)));

    // --- 6. ОСВЕЩЕННОСТЬ ---
    let lightLevel = 0;
    const sunrise = 6 * 60;
    const sunset = 20 * 60;

    if (timeInDay > sunrise && timeInDay < sunset) {
        const noon = (sunrise + sunset) / 2;
        const dist = Math.abs(timeInDay - noon);
        const halfDay = (sunset - sunrise) / 2;
        lightLevel = Math.cos((dist / halfDay) * (Math.PI / 2));
        lightLevel = Math.pow(lightLevel, 0.5);
    }

    // Облака закрывают солнце
    lightLevel *= (1 - cloudIntensity * 0.7);
    if (condition === "storm") lightLevel *= 0.3;

    lightLevel = Math.max(0.02, lightLevel);

    // --- 7. ДАВЛЕНИЕ ---
    let pressure = 760 + (m < 2 || m > 10 ? 5 : -2);
    // Давление падает от облаков
    pressure -= cloudIntensity * 15;
    if (condition === "storm") pressure -= 15;

    return {
        temp,
        pressure: Math.round(pressure),
        wind,
        humidity,
        condition,
        intensity: precipIntensity,
        cloudIntensity,
        isFoggy,
        lightLevel,
        dateStr: date.dateString,
        monthName: date.monthName, // Для UI
        timeStr: date.timeString,
        hours: date.hours,
        minutes: date.minutes
    };
}