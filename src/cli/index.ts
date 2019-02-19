import * as cli from 'yargs';
import timetable from './commands/timetable';
import serve from './commands/serve';

cli.env('CZU_');

cli.options({
	username: {
		alias: 'u',
		type: 'string',
		implies: 'password'
	},
	password: {
		alias: 'p',
		type: 'string',
		implies: 'username'
	},
	cookie: {
		type: 'number'
	},
	lang: {
		alias: 'l',
		choices: ['cz', 'en', 'sk'],
		default: 'cz'
	}
});

cli.demandCommand();
cli.help();

cli.command(timetable);
cli.command(serve);

const argv = cli.argv;
