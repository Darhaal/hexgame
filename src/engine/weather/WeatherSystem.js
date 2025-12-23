import { getGameDate } from "../time/DateSystem";

// --- КОНФИГУРАЦИЯ КЛИМАТА (КИЕВ) ---
const KIEV_CLIMATE = [
    { tMin: -6, tMax: -1, wind: 2.9, humid: 86 }, // 0: Янв
    { tMin: -5, tMax: 0,  wind: 3.0, humid: 83 }, // 1: Фев
    { tMin: -1, tMax: 5,  wind: 2.8, humid: 77 }, // 2: Мар
    { tMin: 5,  tMax: 14, wind: 2.5, humid: 65 }, // 3: Апр
    { tMin: 11, tMax: 21, wind: 2.2, humid: 62 }, // 4: Май
    { tMin: 14, tMax: 24, wind: 2.0, humid: 65 }, // 5: Июн
    { tMin: 16, tMax: 26, wind: 1.9, humid: 63 }, // 6: Июл
    { tMin: 15, tMax: 25, wind: 1.9, humid: 62 }, // 7: Авг
    { tMin: 10, tMax: 19, wind: 2.3, humid: 72 }, // 8: Сен
    { tMin: 5,  tMax: 12, wind: 2.6, humid: 78 }, // 9: Окт
    { tMin: 0,  tMax: 5,  wind: 3.0, humid: 86 }, // 10: Ноя
    { tMin: -4, tMax: 0,  wind: 3.1, humid: 88 }, // 11: Дек
];

// --- ШУМ (PERLIN NOISE) ---
function noise(x) {
    const y = Math.sin(x * 12.9898) * 43758.5453;
    return y - Math.floor(y);
}
function smoothNoise(x) {
    const i = Math.floor(x);
    const f = x - i;
    const y0 = noise(i);
    const y1 = noise(i + 1);
    return y0 + (y1 - y0) * f;
}
function fbm(x) {
    return (smoothNoise(x) * 0.5 + smoothNoise(x * 2) * 0.25 + smoothNoise(x * 4) * 0.125) / 0.875;
}

// --- ПОИСК БЛИЖАЙШЕЙ ПОГОДЫ (Predictor) ---
export function findNextWeatherOccurrence(currentMinutes, targetType, timeOfDay = 'any') {
    let checkTime = currentMinutes;
    const step = 60; // Проверяем каждый час
    const maxDays = 365; // Ищем до 1 года вперед
    const limit = checkTime + (maxDays * 1440);

    while (checkTime < limit) {
        checkTime += step;
        const w = getWeather(checkTime);

        // 1. Проверка времени суток
        if (timeOfDay !== 'any') {
            const timeMod = checkTime % 1440;
            const isDay = timeMod > w.sunrise && timeMod < w.sunset;

            if (timeOfDay === 'day' && !isDay) continue;
            if (timeOfDay === 'night' && isDay) continue;
        }

        // 2. Проверка типа погоды
        let match = false;

        // Группировка для удобства
        if (targetType === 'clear' && w.condition === 'clear') match = true;
        else if (targetType === 'partly_cloudy' && w.condition === 'partly_cloudy') match = true;
        else if (targetType === 'overcast' && w.condition === 'overcast') match = true;

        else if (targetType === 'rain' && w.condition === 'rain') match = true;
        else if (targetType === 'drizzle' && w.condition === 'drizzle') match = true;
        else if (targetType === 'heavy_rain' && w.condition === 'heavy_rain') match = true;
        else if (targetType === 'storm' && w.condition === 'storm') match = true;

        else if (targetType === 'snow' && w.condition === 'snow') match = true;
        else if (targetType === 'blizzard' && w.condition === 'blizzard') match = true;

        else if (targetType === 'fog' && w.condition === 'fog') match = true;
        else if (targetType === 'mist' && w.condition === 'mist') match = true;

        else if (targetType === 'windy' && w.condition === 'windy') match = true;

        if (match) return checkTime;
    }
    return null;
}

// --- ОСНОВНОЙ РАСЧЕТ ПОГОДЫ ---
export function getWeather(totalMinutes, tile = null) {
    const date = getGameDate(totalMinutes);
    const mIdx = date.monthIndex;
    const climate = KIEV_CLIMATE[mIdx];
    const timeOfDay = date.hours * 60 + date.minutes;

    // 1. АТМОСФЕРНОЕ ДАВЛЕНИЕ
    const pressureSeed = totalMinutes / 4000;
    const pressureNorm = fbm(pressureSeed);
    const pressure = Math.round(730 + pressureNorm * 45);

    // 2. ВЕТЕР
    let wind = climate.wind;
    if (pressureNorm > 0.7) {
        wind *= 0.3; // Антициклон
    } else if (pressureNorm < 0.35) {
        wind += (0.35 - pressureNorm) * 15.0; // Циклон
    }

    const dayWindMod = Math.sin(((timeOfDay - 600)/1440) * Math.PI * 2);
    if (dayWindMod > 0) wind += dayWindMod * 1.0;

    wind += (fbm(totalMinutes / 20) - 0.5) * 2.5;

    if (tile) {
        if (tile.type === 'forest') wind *= 0.3;
        if (['village', 'base'].includes(tile.type)) wind *= 0.6;
        if (['river', 'lake', 'great_river'].includes(tile.type)) wind *= 1.4;
    }
    wind = Math.max(0, parseFloat(wind.toFixed(1)));

    // 3. ОБЛАЧНОСТЬ
    const pClamped = Math.max(730, Math.min(770, pressure));
    let cloudDensity = 1.0 - ((pClamped - 730) / 40);
    cloudDensity += (fbm(totalMinutes / 80) - 0.5) * 0.25;
    cloudDensity = Math.max(0, Math.min(1, cloudDensity));

    // 4. ТЕМПЕРАТУРА
    const dayProgress = Math.sin(((timeOfDay - 420) / 1440) * Math.PI * 2);
    const dailySwing = (climate.tMax - climate.tMin);
    let temp = climate.tMin + (dayProgress + 1)/2 * dailySwing;

    const summerSolstice = 172;
    const dayOfYear = date.dayOfYear;
    const seasonFactor = Math.cos(((dayOfYear - summerSolstice) / 365) * 2 * Math.PI);
    const sunrise = 6 * 60 + seasonFactor * 60;
    const sunset = 21 * 60 - seasonFactor * 60;
    const isDay = timeOfDay > sunrise && timeOfDay < sunset;

    if (cloudDensity < 0.25) {
        if (isDay) {
            if (climate.tMax > 15) temp += 3; else temp += 1;
        } else {
            temp -= 4;
        }
    } else if (cloudDensity > 0.7) {
        temp += isDay ? -2 : 2;
    }

    if (wind > 7) temp -= 2;
    temp += (fbm(totalMinutes / 3000) - 0.5) * 5;
    temp = Math.round(temp);

    // 5. ВЛАЖНОСТЬ
    let humidity = climate.humid + (cloudDensity * 25);
    if (isDay) humidity -= 15;
    if (tile && ['river', 'lake'].includes(tile.type)) humidity += 15;
    humidity = Math.min(100, Math.max(30, Math.round(humidity)));

    // 6. ФОРМИРОВАНИЕ ПОГОДЫ
    let condition = "clear";
    let intensity = 0;

    // --- ЛОГИКА ОСАДКОВ ---
    if (cloudDensity > 0.65 && humidity > 70) {
        intensity = (cloudDensity - 0.65) / 0.35;
        intensity *= (0.6 + fbm(totalMinutes / 15) * 0.8);
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity > 0.1) {
            // Гистерезис
            if (temp <= -1) {
                condition = "snow";
            } else if (temp >= 1) {
                condition = "rain";
            } else {
                condition = (mIdx === 11 || mIdx <= 2) ? "snow" : "rain";
            }

            // Уточнение типа дождя
            if (condition === "rain") {
                if (intensity > 0.8 && wind > 6) condition = "storm";
                else if (intensity > 0.7) condition = "heavy_rain";
                else if (intensity < 0.25) condition = "drizzle";
            }
        } else {
            condition = "cloudy";
        }
    } else {
        if (cloudDensity > 0.75) {
            condition = "overcast";
        } else if (cloudDensity > 0.35) {
            condition = "partly_cloudy";
        } else {
            condition = "clear";
        }
    }

    // --- ДОПОЛНИТЕЛЬНЫЕ МОДИФИКАТОРЫ ---

    // 1. Сильный ветер (Windy)
    if (wind > 11 && ['clear', 'partly_cloudy', 'overcast'].includes(condition)) {
        condition = "windy";
    }

    // 2. Метель (Blizzard)
    if (condition === 'snow' && temp <= -2 && wind >= 6 && cloudDensity > 0.6) {
        condition = 'blizzard';
    }

    // 3. Грозы (Весна-Лето-Ранняя Осень)
    if (mIdx >= 3 && mIdx <= 8 && temp > 12 && humidity > 60 && fbm(totalMinutes / 5000) > 0.75) {
        condition = "storm";
        // [FIX] ГЛАВНОЕ ИСПРАВЛЕНИЕ: Если сработала "сезонная гроза",
        // но базовая интенсивность была низкой (0), принудительно ставим дождь.
        if (intensity < 0.8) intensity = 0.8 + Math.random() * 0.2;
    }

    // 4. Туман и Дымка
    let isFoggy = false;
    let fogDensity = 0;
    const isColdSurface = !isDay || temp < 5;

    // Густой туман
    if (wind < 3 && humidity > 93 && isColdSurface && !['rain', 'heavy_rain', 'storm', 'snow', 'blizzard', 'windy'].includes(condition)) {
        isFoggy = true;
        condition = 'fog';
        fogDensity = (humidity - 90) / 10;
        wind = Math.max(0.4, wind * 0.2);
    }
    // Дымка (Mist)
    else if (humidity > 85 && humidity <= 93 && isColdSurface && !['rain', 'heavy_rain', 'storm', 'snow', 'blizzard'].includes(condition)) {
        if (['clear', 'partly_cloudy', 'overcast'].includes(condition)) {
            condition = 'mist';
            isFoggy = true;
            fogDensity = 0.2;
        }
    }

    // 8. ОСВЕЩЕННОСТЬ
    let lightLevel = 0;
    if (timeOfDay >= sunrise && timeOfDay <= sunset) {
        const dayLength = sunset - sunrise;
        const dayProgress = Math.sin((timeOfDay - sunrise) / dayLength * Math.PI);
        lightLevel = Math.pow(dayProgress, 0.3);
    } else {
        const twilightDuration = 50;
        if (timeOfDay > sunset && timeOfDay < sunset + twilightDuration) {
             lightLevel = 1 - (timeOfDay - sunset) / twilightDuration;
             lightLevel *= 0.3;
        } else if (timeOfDay < sunrise && timeOfDay > sunrise - twilightDuration) {
             lightLevel = 1 - (sunrise - timeOfDay) / twilightDuration;
             lightLevel *= 0.3;
        }
    }

    lightLevel *= (1 - cloudDensity * 0.6);
    if (condition === "storm" || condition === "heavy_rain" || condition === "blizzard") lightLevel *= 0.4;
    if (condition === 'fog') lightLevel *= 0.6;
    if (condition === 'mist') lightLevel *= 0.85;

    lightLevel = Math.max(0.15, lightLevel);

    return {
        condition, temp, wind, humidity, pressure, intensity,
        cloudDensity, fogDensity, isFoggy, lightLevel,
        sunrise, sunset,
        dateStr: date.dateString, monthName: date.monthName
    };
}