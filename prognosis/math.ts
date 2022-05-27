declare global {
	interface Math {
		clamp(value: number, min: number, max: number): number;
	}
}

Object.assign(Math, {
	clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	},
});

export {};
