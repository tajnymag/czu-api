import { parseCzuDate } from '../czu-fns';
import * as cheerio from 'cheerio';

export class TimetableEvent {
	start: Date;
	end: Date;
	title: string;
	description: string;
	location: string;
	organizer: { name: string; email: string };
	categories: [string];

	constructor(data: Omit<TimetableEvent, 'startAsArray' | 'endAsArray'>) {
		Object.assign(this, data);
	}

	get startAsArray() {
		return [
			this.start.getFullYear(),
			this.start.getMonth(),
			this.start.getDate(),
			this.start.getHours(),
			this.start.getMinutes()
		];
	}

	get endAsArray() {
		return [
			this.end.getFullYear(),
			this.end.getMonth(),
			this.end.getDate(),
			this.end.getHours(),
			this.end.getMinutes()
		];
	}
}

export class Timetable {
	public events: TimetableEvent[];

	constructor(events: TimetableEvent[]) {
		this.events = events;
	}

	static fromHtml(html: string): Timetable {
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

			events.push(
				new TimetableEvent({
					start: startDate,
					end: endDate,
					title: row[3],
					description: row[4],
					location: row[5],
					organizer: { name: row[6], email: 'sorry@not.available.yet.com' },
					categories: [row[4]]
				})
			);
		});

		return new Timetable(events);
	}
}
