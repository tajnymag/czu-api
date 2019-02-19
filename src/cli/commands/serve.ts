import app from '../../app';

export default {
	command: 'serve',
	description: 'serve our custom api on 0.0.0.0 (HIGHLY EXPERIMENTAL!)',
	builder: {
		port: {
			default: 8080,
			type: 'number'
		}
	},
	handler(argv) {
		app.listen(argv.port);
		console.log(`Listening on port ${argv.port}...`);
	}
};
