export default class Cookie {
	private name: string;
	private value: string;
	private options: string[];

	constructor(name, value, options) {
		this.name = name;
		this.value = value;
		this.options = options;
	}

	toString() {
		return `${this.name}=${this.value};${this.options.join(';')}`;
	}

	getValue() {
		return this.value;
	}

	getName() {
		return this.name;
	}
}

export class UISCookie extends Cookie {
	constructor(value) {
		super('UISAuth', value, ['path=/', 'secure', 'HttpOnly']);
	}
}

export function parseHeader(header: string) {
	const cookie = header.split(';').map(el => el.trim());
	const [name, value] = cookie[0].split('=');

	return {
		name: name,
		value: value,
		option: cookie.slice(1)
	};
}
