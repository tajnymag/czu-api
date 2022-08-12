import UisApi from '../src/uis';

async function test() {
	const uis = new UisApi({ username: process.env.CZUNAME, password: process.env.CZUPASSWORD });

	//console.log(await uis.getTimetable(new Date()));
	console.log(await uis.getRooms(new Date()));
}
test().catch(console.error);
