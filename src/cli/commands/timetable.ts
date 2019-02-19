import * as ics from 'ics';
import UisApi from '../../uis';

export default {
	command: 'timetable',
	desc: 'prints your timetable in given date and time',
	builder: {
		format: {
			alias: 'f',
			choices: ['ics', 'json'],
			default: 'json'
		},
		until: {
			type: 'string',
			coerce(passedDate) {
				return Date.parse(passedDate);
			}
		}
	},
	async handler(argv) {
		const uis = new UisApi({
			username: argv.username,
			password: argv.password,
			cookie: argv.cookie
		});

		try {
			await uis.login();
		} catch(e) {
			console.error(e.message);
			console.error('Check your credentials or internet connection!');
			return 1;
		}

		const timetable = await uis.getTimetable(new Date(), argv.until, argv.lang);

		if (argv.format === 'ics') {
			const { error, value: ical } = ics.createEvents(timetable);

			if (error) {
				console.error(
					'Sorry, something went wrong during parsing of your timetable. Try using the json format.'
				);
				return 1;
			}
			console.log(ical);
		} else {
			console.log(timetable);
		}
	}
};
