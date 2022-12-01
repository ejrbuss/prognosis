declare interface Math {
	clamp(value: number, min: number, max: number): number;
	lerp(start: number, end: number, amount: number): number;
}

Math.clamp = function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
};

Math.lerp = function lerp(start, end, amount) {
	return start + (end - start) * amount;
};
