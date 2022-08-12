import * as qs from 'qs';
import { AxiosRequestConfig } from 'axios';
import { addWeeks, format as formatDate } from 'date-fns';

import { UISCookie } from './cookie';
import { http } from './http';
import { Timetable } from './timetable';
import { RoomSchedule } from './rooms';

export interface CredentialsWithPassword {
	username: string;
	password: string;
	cookie?: number;
	timetableId?: number;
}
export interface CredentialsWithCookie {
	username?: never;
	password?: never;
	cookie: number;
	timetableId?: number;
}
export type Credentials = CredentialsWithCookie | CredentialsWithPassword;

export default class UisApi {
	private username: string;
	private password: string;
	private cookie: UISCookie;

	constructor(credentials: Credentials) {
		if ((!credentials.username || !credentials.password) && !credentials.cookie) {
			throw new Error('Tried to run UisApi constructor without credentials');
		}

		if (credentials.username) {
			this.username = credentials.username;
			this.password = credentials.password;
		} else {
			this.cookie = new UISCookie(credentials.cookie);
		}
	}

	async getTimetable(
		from: Date = new Date(),
		to: Date = addWeeks(new Date(), 1),
		lang: string = 'cz'
	) {
		if (!this.cookie) {
			await http.login(this.username, this.password);
		}

		const requestConfig: AxiosRequestConfig = {
			url: 'https://is.czu.cz/auth/katalog/rozvrhy_view.pl',
			params: {
				z: 1,
				k: 1,
				osobni: 1,
				rezervace: 0,
				poznamky_base: 1,
				poznamky_zmeny: 1,
				poznamky_parovani: 1,
				poznamky_dalsi_ucit: 1,
				poznamky_jiny_areal: 1,
				poznamky_dl_omez: 1,
				typ_vypisu: 'konani',
				konani_od: formatDate(from, 'DD.MM.YYYY'),
				konani_do: formatDate(to, 'DD.MM.YYYY'),
				format: 'list',
				poznamky: 1,
				zobraz: 1,
				zobraz2: 'Zobrazit',
				lang: lang
			}
		};

		try {
			const response = await http.get(requestConfig.url, requestConfig);
			return Timetable.fromHtml(response.data).events;
		} catch (e) {
			throw new Error('Could not get the timetable because:\n' + e.message);
		}
	}

	async getRooms(date: Date) {
		if (date.getDay() < 1 || date.getDay() > 5) {
			throw new Error('Incorrect day number. Day index must be inclusively between 1 and 5');
		}

		if (!this.cookie) {
			await http.login(this.username, this.password);
		}

		const requestConfig: AxiosRequestConfig = {};
		const requestData = qs.stringify({
			z: '1',
			k: '1',
			rozvrh: '1000',
			rezervace: '1',
			poznamky_base: '1',
			poznamky_zmeny: '1',
			poznamky_parovani: '1',
			poznamky_jiny_areal: '1',
			poznamky_dl_omez: '1',
			typ_vypisu: 'konani',
			konani_od: formatDate(date, 'DD.MM.YYYY'),
			konani_do: formatDate(date, 'DD.MM.YYYY'),
			format: 'list',
			poznamky: '1',
			poznamky_dalsi_ucit: '1',
			zobraz: '1',
			zobraz2: 'Zobrazit',
			lang: 'cz'
		});

		try {
			const response = await http.post(
				'https://is.czu.cz/auth/katalog/rozvrhy_view.pl',
				requestData,
				requestConfig
			);
			return RoomSchedule.fromHtml(response.data).findEmptyRooms();
		} catch (err) {
			throw new Error(err);
		}
	}
}
