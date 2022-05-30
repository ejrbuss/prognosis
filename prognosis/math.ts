declare global {
	interface Math {
		clamp(value: number, min: number, max: number): number;
		lerp(start: number, end: number, amount: number): number;
	}
}

Object.assign(Math, {
	clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	},

	lerp(start: number, end: number, amount: number): number {
		return start + (end - start) * amount;
	},
});

export {};
