Math.clamp = function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
};

Math.lerp = function lerp(start, end, amount) {
	return start + (end - start) * amount;
};
