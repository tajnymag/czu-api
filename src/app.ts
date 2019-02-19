import * as express from 'express';
import * as responseTime from 'response-time';

import timetableHandler from './routes/timetable-handler';

const app = express();
app.use(responseTime());

app.get('/api/v1/:lang/timetable/:id.:format', timetableHandler);
app.get('/api/v1/:lang/timetable/*', async (req, res) => {
	res.sendStatus(400);
});

export default app;
