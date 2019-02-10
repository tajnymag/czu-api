interface CacheEntry {
	value: string;
	expirationDate: number;
}

class TempCache {
	private defaultExpirationTime: number;
	private cacheMap: Map<string, CacheEntry>;

	constructor(defaultExpirationTime: number = 8 * 60 * 60 * 1000) {
		this.defaultExpirationTime = defaultExpirationTime;
		this.cacheMap = new Map<string, CacheEntry>();
	}

	set(key: string, value: string): void {
		this.cacheMap.set(key, {
			value: value,
			expirationDate: Date.now() + this.defaultExpirationTime
		});
	}

	get(key: string): string {
		const entry = this.cacheMap.get(key);

		if (!entry || entry.expirationDate < Date.now()) {
			this.cacheMap.delete(key);
			return null;
		} else {
			return this.cacheMap.get(key).value;
		}
	}
}

export default TempCache;
