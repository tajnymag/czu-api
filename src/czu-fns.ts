import * as cheerio from 'cheerio';

export function parseCzuDate(date, time): Date {
	const dateRegex = /(\d\d)[./](\d\d)[./](\d\d\d\d)/;
	const extractedDate = dateRegex.exec(date);
	const [day, month, year] = extractedDate.slice(1);
	const [hours, minutes] = time.split(':');

	return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes));
}

export function parseTimetableHtml(html) {
	const $ = cheerio.load(html);
	const events = [];

	$('#tmtab_1 tbody tr').each((i, el) => {
		const tr = $(el);
		const row = [];

		tr.find('td').each((i, el) => {
			row.push(
				$(el)
					.children('small')
					.text()
					.trim()
			);
		});

		const startDate = parseCzuDate(row[0], row[1]);
		const endDate = parseCzuDate(row[0], row[2]);

		events.push({
			start: [
				startDate.getFullYear(),
				startDate.getMonth() + 1,
				startDate.getDate(),
				startDate.getHours(),
				startDate.getMinutes()
			],
			end: [
				endDate.getFullYear(),
				endDate.getMonth() + 1,
				endDate.getDate(),
				endDate.getHours(),
				endDate.getMinutes()
			],
			title: row[3],
			description: row[4],
			location: row[5],
			organizer: { name: row[6], email: 'not@available.sorry' },
			categories: [row[4]]
		});
	});

	return events;
}
