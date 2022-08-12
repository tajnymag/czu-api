import { addDays, subDays } from 'date-fns';

export function parseCzuDate(date: string, time: string): Date {
	const dateRegex = /(\d\d)[./](\d\d)[./](\d\d\d\d)/;
	const extractedDate = dateRegex.exec(date);
	const [day, month, year] = extractedDate.slice(1);
	const [hours, minutes] = time.split(':');

	return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
}

export function getClosestDate(day: number | string, referentialDate: Date) {
	const normalizedDay = normalizeDayOfWeek(day);

	let tmpDate = new Date(referentialDate.valueOf());

	while (normalizeDayOfWeek(tmpDate.getDay()) !== normalizedDay) {
		if (normalizeDayOfWeek(tmpDate.getDay()) > normalizedDay) {
			tmpDate = subDays(tmpDate, 1);
		} else {
			tmpDate = addDays(tmpDate, 1);
		}
	}

	return tmpDate;
}

export function normalizeDayOfWeek(day: number | string) {
	if (typeof day === 'string') {
		if (day === 'Mon') {
			return 1;
		}
		if (day === 'Tue') {
			return 2;
		}
		if (day === 'Wed') {
			return 3;
		}
		if (day === 'Thu') {
			return  4;
		}
		if (day === 'Fri') {
			return  5;
		}
		if (day === 'Sat') {
			return  6;
		}
		if (day === 'Sun') {
			return  7;
		}

		throw new Error('Could not parse day string!');
	}

	if (typeof day === 'number') {
		if (day > 6) {
			throw new Error('The date is already normalized. Check your sources!');
		}

		if (day === 0) {
			return 7;
		}

		return day;
	}

	throw new Error('Could not normalize day of the week!');
}
