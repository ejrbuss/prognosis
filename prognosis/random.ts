const RandomClass = class Random {
	seed = 0xdead;

	number() {
		// https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
		let z = (this.seed += 0x6d2b79f5);
		z = Math.imul(z ^ (z >>> 15), z | 1);
		z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
		return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
	}

	integer(min: number, max?: number) {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		return Math.floor(this.number() * (max - min)) + min;
	}

	choice<T>(...choices: T[]): T {
		return choices[this.integer(choices.length)];
	}
};

export const Random = new RandomClass();
