import { endOfWeek } from 'date-fns';
import * as ics from 'ics';

import UisApi from '../uis';

import TempCache from './../temp-cache';

const cache = new TempCache(10 * 1000);

export default async function(req, res, next) {
	if (!['json', 'ics'].includes(req.params.format)) {
		res.sendStatus(415);
		return;
	}

	if (cache.get(req.params.id + req.params.format)) {
		res.send(cache.get(req.params.id + req.params.format));
		return;
	}

	const uis = new UisApi({
		username: req.params.id,
		password: process.env.CZUPASSWORD
	});

	try {
		await uis.login();
	} catch (e) {
		console.error(e);
		res.sendStatus(401);
		return;
	}

	let tilDate: Date;
	if (req.query.til && req.query.til.split('-').length === 3) {
		const [year, month, day] = req.query.til.split('-').map(Number);
		tilDate = new Date(year, month - 1, day);
	} else {
		tilDate = endOfWeek(new Date());
	}

	const events = await uis.getTimetable(new Date(), tilDate, req.params.lang);

	if (req.params.format === 'json') {
		res.status(200).json(events);
		return;
	} else if (req.params.format === 'ics') {
		const { error, value: ical } = ics.createEvents(events);

		if (error) {
			console.error(error);
		} else {
			cache.set(req.params.id + req.params.format, ical);
			res.type('ics');
			res.status(200).send(ical);
		}
		return;
	}
}
