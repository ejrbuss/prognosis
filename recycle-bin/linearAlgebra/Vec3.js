/**
 * Select code from https://glmatrix.net/
 */

const Zeros = new Float32Array(3);

const create = (x, y = x, z = x) => {
	const out = new Float32Array(3);
	out[0] = x;
	out[1] = y;
	out[2] = z;
	return out;
};

const random = (scale = 1.0) => {
	const out = new Float32Array(3);
	const r = Math.random() * 2 * Math.PI;
	const z = Math.random() * 2 - 1;
	const zScale = Math.sqrt(1 - z * z) * scale;
	out[0] = Math.cos(r) * zScale;
	out[1] = Math.sin(r) * zScale;
	out[2] = z * scale;
	return out;
};

const map = (a, fn) => {
	const out = new Float32Array(3);
	out[0] = fn(a[0]);
	out[1] = fn(a[1]);
	out[2] = fn(a[2]);
	return out;
};

const zip = (a, b, fn) => {
	const out = new Float32Array(3);
	out[0] = fn(a[0], b[0]);
	out[1] = fn(a[1], b[1]);
	out[2] = fn(a[2], b[2]);
	return out;
};

const length = (a) => {
	return Math.hypot(a[0], a[1], a[2]);
};

const distance = (a, b) => {
	const x = b[0] - a[0];
	const y = b[1] - a[1];
	const z = b[2] - a[2];
	return Math.hypot(x, y, z);
};

const normalize = (a) => {
	const out = new Float32Array(3);
	const x = a[0];
	const y = a[1];
	const z = a[2];
	const unitFactor = x * x + y * y + z * z;
	if (unitFactor > 0) {
		unitFactor = 1 / Math.sqrt(unitFactor);
	}
	out[0] = x * unitFactor;
	out[1] = y * unitFactor;
	out[2] = z * unitFactor;
	return out;
};

const dotProduct = (a, b) => {
	return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

const crossProduct = (a, b) => {
	const out = new Float32Array(3);
	const ax = a[0];
	const ay = a[1];
	const az = a[2];
	const bx = b[0];
	const by = b[1];
	const bz = b[2];
	out[0] = ay * bz - az * by;
	out[1] = az * bx - ax * bz;
	out[2] = ax * by - ay * bx;
	return out;
};

const lerp = (a, b, t) => {
	const out = new Float32Array(3);
	const ax = a[0];
	const ay = a[1];
	const az = a[2];
	out[0] = ax + t * (b[0] - ax);
	out[1] = ay + t * (b[1] - ay);
	out[2] = az + t * (b[2] - az);
	return out;
};

const transform = (a, m) => {
	const out = new Float32Array(3);
	const x = a[0];
	const y = a[1];
	const z = a[2];
	out[0] = x * m[0] + y * m[3] + z * m[6];
	out[1] = x * m[1] + y * m[4] + z * m[7];
	out[2] = x * m[2] + y * m[5] + z * m[8];
	return out;
};

export const Vec3 = {
	Zeros,
	create,
	random,
	map,
	zip,
	length,
	distance,
	normalize,
	dotProduct,
	crossProduct,
	lerp,
	transform,
};
