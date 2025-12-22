import { GAME_DAY_MINUTES, MONTHS, START_YEAR, START_DATE_OFFSET, isLeapYear, getDaysInMonth } from "./timeModels";

/**
 * Преобразует общее игровое время (минуты с начала сессии) в объект даты.
 * Учитывает високосные годы.
 */
export function getGameDate(totalMinutesPlayed) {
    // 1. Абсолютное время от начала 1 Января стартового года
    // (totalMinutesPlayed - это сколько мы сыграли, offset - это сдвиг до 25 января)
    let currentMinutes = totalMinutesPlayed + START_DATE_OFFSET;

    // 2. Определяем Текущий Год
    let year = START_YEAR;
    while (true) {
        const daysInYear = isLeapYear(year) ? 366 : 365;
        const minutesInYear = daysInYear * GAME_DAY_MINUTES;

        if (currentMinutes < minutesInYear) {
            break; // Мы нашли текущий год
        }

        currentMinutes -= minutesInYear;
        year++;
    }

    // 3. Определяем День Года и Месяц
    let dayOfYear = Math.floor(currentMinutes / GAME_DAY_MINUTES); // 0-based (0 = 1 янв)

    let monthIdx = 0;
    let day = 0;

    for (let i = 0; i < MONTHS.length; i++) {
        const daysInMonth = getDaysInMonth(i, year);

        if (dayOfYear < daysInMonth) {
            monthIdx = i;
            day = dayOfYear + 1; // 1-based (число месяца)
            break;
        }

        dayOfYear -= daysInMonth;
    }

    // 4. Время суток
    const minutesInDay = Math.floor(currentMinutes % GAME_DAY_MINUTES);
    const hours = Math.floor(minutesInDay / 60);
    const mins = Math.floor(minutesInDay % 60);

    // Красивое форматирование
    const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const dateString = `${day} ${MONTHS[monthIdx].name} ${year} года`; // "25 Января 2005 года"

    return {
        year,
        monthName: MONTHS[monthIdx].name,
        monthIndex: monthIdx,
        day,
        hours,
        minutes: mins,
        timeString,
        dateString
    };
}