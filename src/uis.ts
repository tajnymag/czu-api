import * as request from 'request-promise-native';
import { addWeeks, format as formatDate } from 'date-fns';
import { UISCookie, parseHeader } from './cookie';
import { parseTimetableHtml } from './czu-fns';

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
	private timetableId: number;

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

		if (credentials.timetableId) {
			this.timetableId = credentials.timetableId;
		}
	}

	async login(): Promise<void> {
		if (!this.cookie) {
			const requestConfig = {
				method: 'POST',
				uri: 'https://is.czu.cz/system/login.pl',
				form: {
					login_hidden: 1,
					destination: '/auth/',
					auth_id_hidden: 0,
					credential_0: this.username,
					credential_1: this.password,
					credential_k: '',
					credential_2: 86400 * 24 //4 days
				},
				followRedirect: false,
				resolveWithFullResponse: true,
				simple: false
			};

			try {
				const response = await request(requestConfig);
				this.cookie = new UISCookie(parseHeader(response.headers['set-cookie'][0]).value);
			} catch (e) {
				throw new Error('Could not get the login cookie!');
			}
		}
	}

	async getTimetable(
		from: Date = new Date(),
		to: Date = addWeeks(new Date(), 1),
		lang: string = 'cz'
	) {
		if (!this.cookie) {
			await this.login();
		}

		const requestConfig = {
			method: 'POST',
			uri: 'https://is.czu.cz/auth/katalog/rozvrhy_view.pl',
			form: {
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
			},
			headers: {
				Cookie: this.cookie.toString()
			}
		};

		try {
			const response = await request(requestConfig);
			return parseTimetableHtml(response);
		} catch (e) {
			console.error(e);
		}
	}
}
