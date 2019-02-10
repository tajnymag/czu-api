import * as express from 'express';
import * as responseTime from 'response-time';
import { createHash } from 'crypto';
import * as ics from 'ics';

import UisApi from './uis';

import TempCache from './temp-cache';

const app = express();
const cache = new TempCache(10 * 1000);
const delay = time => new Promise(res => setTimeout(() => res(), time));

app.use(responseTime());

app.get('/api/v1/:lang/timetable/json', async (req, res) => {
	if (cache.get(process.env.CZUNAME)) {
		res.send(cache.get(process.env.CZUNAME));
	} else {
		const uis = new UisApi({
			username: process.env.CZUNAME,
			password: process.env.CZUPASSWORD
		});
		await uis.login();

		const events = await uis.getTimetable(new Date(), new Date('2019/09/06'), req.params.lang);

		cache.set(process.env.CZUNAME, JSON.stringify(events));
		res.json(events);
	}
});

app.get('/api/v1/:lang/timetable/ics', async (req, res) => {
	if (cache.get(process.env.CZUNAME)) {
		res.send(cache.get(process.env.CZUNAME));
	} else {
		const uis = new UisApi({
			username: process.env.CZUNAME,
			password: process.env.CZUPASSWORD
		});
		await uis.login();

        const events = await uis.getTimetable(new Date(), new Date('2019/09/06'), req.params.lang);
		const { error, value: ical } = ics.createEvents(events);

		if (error) {
			console.error(error);
		} else {
			cache.set(process.env.CZUNAME, ical);
			res.set('Content-Type', 'text/calendar');
			res.send(ical);
		}
	}
});

export default app;
