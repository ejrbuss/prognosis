/**
 * Select code from https://glmatrix.net/
 */

// prettier-ignore
const Identity = new Float32Array([
	1, 0, 0,
	0, 1, 0,
	0, 0, 1,
]);

const Zeros = new Float32Array(9);

const create = (m00, m01, m02, m10, m11, m12, m20, m21, m22) => {
	let out = new Float32Array(9);
	out[0] = m00;
	out[1] = m01;
	out[2] = m02;
	out[3] = m10;
	out[4] = m11;
	out[5] = m12;
	out[6] = m20;
	out[7] = m21;
	out[8] = m22;
	return out;
};

const multiply = (a, b) => {
	const out = new Float32Array(9);
	const a00 = a[0];
	const a01 = a[1];
	const a02 = a[2];
	const a10 = a[3];
	const a11 = a[4];
	const a12 = a[5];
	const a20 = a[6];
	const a21 = a[7];
	const a22 = a[8];
	const b00 = b[0];
	const b01 = b[1];
	const b02 = b[2];
	const b10 = b[3];
	const b11 = b[4];
	const b12 = b[5];
	const b20 = b[6];
	const b21 = b[7];
	const b22 = b[8];
	out[0] = b00 * a00 + b01 * a10 + b02 * a20;
	out[1] = b00 * a01 + b01 * a11 + b02 * a21;
	out[2] = b00 * a02 + b01 * a12 + b02 * a22;
	out[3] = b10 * a00 + b11 * a10 + b12 * a20;
	out[4] = b10 * a01 + b11 * a11 + b12 * a21;
	out[5] = b10 * a02 + b11 * a12 + b12 * a22;
	out[6] = b20 * a00 + b21 * a10 + b22 * a20;
	out[7] = b20 * a01 + b21 * a11 + b22 * a21;
	out[8] = b20 * a02 + b21 * a12 + b22 * a22;
	return out;
};

const translate = (a, dx, dy) => {
	const out = new Float32Array(9);
	const a00 = a[0];
	const a01 = a[1];
	const a02 = a[2];
	const a10 = a[3];
	const a11 = a[4];
	const a12 = a[5];
	const a20 = a[6];
	const a21 = a[7];
	const a22 = a[8];
	out[0] = a00;
	out[1] = a01;
	out[2] = a02;
	out[3] = a10;
	out[4] = a11;
	out[5] = a12;
	out[6] = dx * a00 + dy * a10 + a20;
	out[7] = dx * a01 + dy * a11 + a21;
	out[8] = dx * a02 + dy * a12 + a22;
	return out;
};

const rotateRadians = (a, radians) => {
	const out = new Float32Array(9);
	const a00 = a[0];
	const a01 = a[1];
	const a02 = a[2];
	const a10 = a[3];
	const a11 = a[4];
	const a12 = a[5];
	const a20 = a[6];
	const a21 = a[7];
	const a22 = a[8];
	const s = Math.sin(radians);
	const c = Math.cos(radians);
	out[0] = c * a00 + s * a10;
	out[1] = c * a01 + s * a11;
	out[2] = c * a02 + s * a12;
	out[3] = c * a10 - s * a00;
	out[4] = c * a11 - s * a01;
	out[5] = c * a12 - s * a02;
	out[6] = a20;
	out[7] = a21;
	out[8] = a22;
	return out;
};

const scale = (a, sx, sy) => {
	const out = new Float32Array(9);
	out[0] = sx * a[0];
	out[1] = sx * a[1];
	out[2] = sx * a[2];
	out[3] = sy * a[3];
	out[4] = sy * a[4];
	out[5] = sy * a[5];
	out[6] = a[6];
	out[7] = a[7];
	out[8] = a[8];
	return out;
};

export const Mat3 = {
	Identity,
	Zeros,
	create,
	multiply,
	translate,
	rotateRadians,
	scale,
};
