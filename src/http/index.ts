import { parseHeader, UISCookie } from '../cookie';
import axios, { AxiosRequestConfig } from 'axios';
import * as qs from 'qs';

export class Http {
	private cookie: UISCookie;

	async get(url: string, config: AxiosRequestConfig) {
		if (this.cookie) {
			config.headers = { Cookie: this.cookie.toString() };
		}

		return await axios.get(url, config);
	}

	async post(config: AxiosRequestConfig);
	async post(url: string, data: any, config?: AxiosRequestConfig);
	async post(urlOrConfig: string | AxiosRequestConfig, data?: any, config?: AxiosRequestConfig) {
		if (typeof urlOrConfig === 'string') {
			if (this.cookie) {
				config.headers = { Cookie: this.cookie.toString() };
			}

			return await axios.post(urlOrConfig, data, config);
		}

		if (this.cookie) {
			urlOrConfig.headers = { Cookie: this.cookie.toString() };
		}
		return axios(urlOrConfig);
	}

	async login(username: string, password: string): Promise<void> {
		if (!this.cookie) {
			const requestData = qs.stringify({
				login_hidden: 1,
				destination: '/auth/',
				auth_id_hidden: 0,
				credential_0: username,
				credential_1: password,
				credential_k: '',
				credential_2: 86400 * 24 //4 days
			});
			const requestConfig: AxiosRequestConfig = {
				maxRedirects: 0,
				validateStatus: status => status === 302
			};

			try {
				const response = await this.post(
					'https://is.czu.cz/system/login.pl',
					requestData,
					requestConfig
				);
				this.cookie = new UISCookie(parseHeader(response.headers['set-cookie'][0]).value);
			} catch (e) {
				throw new Error('Could not get the login cookie!');
			}
		}
	}
}

export const http = new Http();
