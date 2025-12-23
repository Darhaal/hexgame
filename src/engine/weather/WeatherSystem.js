import { getGameDate } from "../time/DateSystem";

// --- ПЕРЕМЕННЫЕ ДЛЯ "РУКИ БОГА" (OVERRIDE) ---
let weatherOverride = null;

export function setOverrideWeather(type) {
    if (type === 'auto') {
        weatherOverride = null;
        return;
    }

    const presets = {
        'clear': { condition: 'clear', cloudDensity: 0.0, intensity: 0, fogDensity: 0, humidity: 40, wind: 2, pressure: 765, lightMod: 1.0 },
        'rain': { condition: 'rain', cloudDensity: 0.7, intensity: 0.6, fogDensity: 0.2, humidity: 85, wind: 6, pressure: 745, lightMod: 0.8 },
        'heavy_rain': { condition: 'heavy_rain', cloudDensity: 0.9, intensity: 1.0, fogDensity: 0.3, humidity: 95, wind: 12, pressure: 735, lightMod: 0.6 },
        'storm': { condition: 'storm', cloudDensity: 1.0, intensity: 1.0, fogDensity: 0.4, humidity: 98, wind: 18, pressure: 725, lightMod: 0.4 },
        'snow': { condition: 'snow', cloudDensity: 0.8, intensity: 0.6, fogDensity: 0.3, humidity: 70, wind: 4, pressure: 750, lightMod: 0.9 },
        'fog': { condition: 'fog', cloudDensity: 0.4, intensity: 0, fogDensity: 1.0, humidity: 99, wind: 0.5, pressure: 755, lightMod: 0.7 },
        'windy': { condition: 'windy', cloudDensity: 0.3, intensity: 0, fogDensity: 0, humidity: 50, wind: 15, pressure: 760, lightMod: 1.0 },
    };

    weatherOverride = presets[type] || null;
}

const KIEV_CLIMATE = [
    { tMin: -6, tMax: -1, wind: 5, humid: 85 },
    { tMin: -5, tMax: 0,  wind: 5, humid: 82 },
    { tMin: -1, tMax: 5,  wind: 4, humid: 77 },
    { tMin: 5,  tMax: 14, wind: 4, humid: 65 },
    { tMin: 11, tMax: 21, wind: 3, humid: 60 },
    { tMin: 14, tMax: 24, wind: 3, humid: 65 },
    { tMin: 16, tMax: 26, wind: 2, humid: 63 },
    { tMin: 15, tMax: 25, wind: 2, humid: 62 },
    { tMin: 10, tMax: 19, wind: 3, humid: 70 },
    { tMin: 5,  tMax: 12, wind: 4, humid: 77 },
    { tMin: 0,  tMax: 5,  wind: 5, humid: 85 },
    { tMin: -4, tMax: 0,  wind: 5, humid: 88 },
];

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

export function getWeather(totalMinutes, tile = null) {
    const date = getGameDate(totalMinutes);

    // Астрономический день
    const summerSolstice = 172;
    const dayOfYear = date.dayOfYear;
    const seasonFactor = Math.cos(((dayOfYear - summerSolstice) / 365) * 2 * Math.PI);
    const sunrise = 6 * 60 + seasonFactor * 60; // 5:00 - 7:00
    const sunset = 21 * 60 - seasonFactor * 60; // 20:00 - 22:00

    if (weatherOverride) {
        const climate = KIEV_CLIMATE[date.monthIndex];
        let baseTemp = (climate.tMin + climate.tMax) / 2;
        if (weatherOverride.condition === 'snow' && baseTemp > 0) baseTemp = -2;
        if (weatherOverride.condition === 'rain' && baseTemp < 0) baseTemp = 2;

        return {
            ...weatherOverride,
            temp: baseTemp,
            isFoggy: weatherOverride.fogDensity > 0.5,
            sunrise, sunset,
            lightLevel: 1.0 * weatherOverride.lightMod, // Базовый свет
            dateStr: date.dateString, monthName: date.monthName
        };
    }

    const mIdx = date.monthIndex;
    const climate = KIEV_CLIMATE[mIdx];
    const timeOfDay = date.hours * 60 + date.minutes;

    const pressureSeed = totalMinutes / 5000;
    const pressureNorm = fbm(pressureSeed);
    const pressure = Math.round(730 + pressureNorm * 50);

    let windBase = climate.wind + (1 - pressureNorm) * 6;
    const dayWindMod = Math.sin(((timeOfDay - 600)/1440) * Math.PI * 2) * 0.5 + 0.5;
    let wind = windBase + dayWindMod * 2;
    wind += (fbm(totalMinutes / 40) - 0.5) * 5;

    if (tile) {
        if (tile.type === 'forest') wind *= 0.5;
        if (['village', 'base'].includes(tile.type)) wind *= 0.7;
        if (['river', 'lake', 'great_river'].includes(tile.type)) wind *= 1.5;
    }
    wind = Math.max(0, parseFloat(wind.toFixed(1)));

    let cloudDensity = 1.0 - ((pressure - 735) / 40);
    cloudDensity += (fbm(totalMinutes / 100) - 0.5) * 0.3;
    cloudDensity = Math.max(0, Math.min(1, cloudDensity));

    const dayProgress = Math.sin(((timeOfDay - 420) / 1440) * Math.PI * 2);
    const dailySwing = (climate.tMax - climate.tMin);
    let temp = climate.tMin + (dayProgress + 1)/2 * dailySwing;

    const isDay = timeOfDay > sunrise && timeOfDay < sunset;
    if (cloudDensity > 0.7) temp += isDay ? -2 : 2;
    if (wind > 8) temp -= 2;
    temp += (fbm(totalMinutes / 3000) - 0.5) * 6;
    temp = Math.round(temp);

    let humidity = climate.humid + (cloudDensity * 20);
    if (isDay) humidity -= 15;
    if (tile && ['river', 'lake'].includes(tile.type)) humidity += 15;
    humidity = Math.min(100, Math.max(30, Math.round(humidity)));

    let condition = "clear";
    let intensity = 0;

    if (cloudDensity > 0.7 && humidity > 75) {
        intensity = (cloudDensity - 0.7) / 0.3;
        intensity *= (0.7 + fbm(totalMinutes / 20) * 0.6);
        intensity = Math.min(1, Math.max(0, intensity));

        if (intensity > 0.1) {
            condition = temp < 0 ? "snow" : "rain";
            if (condition === "rain") {
                if (intensity > 0.8 && wind > 10) condition = "storm";
                else if (intensity > 0.7) condition = "heavy_rain";
                else if (intensity < 0.3) condition = "drizzle";
            }
        } else {
            condition = "cloudy";
        }
    } else if (cloudDensity > 0.4) {
        condition = "partly_cloudy";
    } else if (cloudDensity > 0.8) {
        condition = "overcast"; // Пасмурно без дождя
    }

    if (wind > 12 && condition === "clear") condition = "windy";

    let isFoggy = false;
    let fogDensity = 0;
    if (wind < 3 && humidity > 92 && !condition.includes('rain') && condition !== 'storm' && condition !== 'windy') {
        isFoggy = true;
        condition = 'fog';
        fogDensity = (humidity - 90) / 10;
    }

    // --- РАСЧЕТ СВЕТА (Light Level) ---
    // 1.0 = Полный день, 0.0 = Полная тьма
    let lightLevel = 0;

    // Плавный рассвет и закат (Sine wave around noon)
    if (timeOfDay >= sunrise && timeOfDay <= sunset) {
        const noon = (sunrise + sunset) / 2;
        const dayLength = sunset - sunrise;
        // Используем sine^0.5 для более широкого пика дня (чтобы не было темно в 16:00)
        const dayProgress = Math.sin((timeOfDay - sunrise) / dayLength * Math.PI);
        lightLevel = Math.pow(dayProgress, 0.3); // Делаем кривую более "квадратной"
    } else {
        // Сумерки (Civil Twilight) - примерно 30-40 минут до/после
        const twilightDuration = 40;
        if (timeOfDay > sunset && timeOfDay < sunset + twilightDuration) {
             lightLevel = 1 - (timeOfDay - sunset) / twilightDuration;
             lightLevel *= 0.3; // Быстро темнеет, но не сразу в ноль
        } else if (timeOfDay < sunrise && timeOfDay > sunrise - twilightDuration) {
             lightLevel = 1 - (sunrise - timeOfDay) / twilightDuration;
             lightLevel *= 0.3;
        }
    }

    // Влияние погоды на свет
    lightLevel *= (1 - cloudDensity * 0.5); // Облака крадут до 50% света
    if (condition === "storm" || condition === "heavy_rain") lightLevel *= 0.5; // Шторм крадет еще
    if (isFoggy) lightLevel *= 0.8;

    // !! FIX: Минимальный свет (луна/звезды), чтобы не было "Черного экрана" !!
    // Ночью lightLevel не должен падать ниже 0.15
    lightLevel = Math.max(0.15, lightLevel);

    return {
        condition, temp, wind, humidity, pressure, intensity,
        cloudDensity, fogDensity, isFoggy, lightLevel,
        sunrise, sunset,
        dateStr: date.dateString, monthName: date.monthName
    };
}