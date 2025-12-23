import { GAME_DAY_MINUTES, MONTHS, START_YEAR, START_DATE_OFFSET, isLeapYear, getDaysInMonth } from "./timeModels";

export function getGameDate(totalMinutesPlayed) {
    let currentMinutes = totalMinutesPlayed + START_DATE_OFFSET;

    // Год
    let year = START_YEAR;
    while (true) {
        const daysInYear = isLeapYear(year) ? 366 : 365;
        const minutesInYear = daysInYear * GAME_DAY_MINUTES;

        if (currentMinutes < minutesInYear) break;

        currentMinutes -= minutesInYear;
        year++;
    }

    // День года
    let dayOfYear = Math.floor(currentMinutes / GAME_DAY_MINUTES);

    // Месяц и число
    let monthIdx = 0;
    let day = 0;

    for (let i = 0; i < MONTHS.length; i++) {
        const daysInMonth = getDaysInMonth(i, year);

        if (dayOfYear < daysInMonth) {
            monthIdx = i;
            day = dayOfYear + 1;
            break;
        }
        dayOfYear -= daysInMonth;
    }

    // Время
    const minutesInDay = Math.floor(currentMinutes % GAME_DAY_MINUTES);
    const hours = Math.floor(minutesInDay / 60);
    const mins = Math.floor(minutesInDay % 60);

    const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    const dateString = `${day} ${MONTHS[monthIdx].name} ${year} года`;

    return {
        year,
        monthName: MONTHS[monthIdx].name,
        monthIndex: monthIdx,
        day,
        hours,
        minutes: mins,
        timeString,
        dateString,
        dayOfYear // Полезно для сезонной логики
    };
}