import { Vec3 } from "./Vec3.js";
import { Vec2 } from "./Vec2.js";

export class Mat3 {
	/** @type {Float32Array} */ float32Array = Float32Array;

	constructor(values) {
		if (values instanceof Float32Array) {
			this.float32Array = values;
		} else {
			this.float32Array = new Float32Array(values);
		}
	}
}

// prettier-ignore
Mat3.Identity = new Mat3([
	1, 0, 0,
	0, 1, 0,
	0, 0, 1,
]);

/**
 *
 * @param {Mat3} mat
 * @param {Vec2} translation
 * @returns {Mat3}
 */
Mat3.translate = function (mat, translation) {
	let a = mat.float32Array;
	let { x, y } = Vec2.broadcast(translation);
	// prettier-ignore
	return new Mat3([
		a[0], a[1], x * a[0] + y * a[1] + a[2],
		a[3], a[4], x * a[3] + y * a[4] + a[5],
		a[6], a[7], x * a[6] + y * a[7] + a[8],
	]);
};

/**
 *
 * @param {Mat3} mat
 * @param {number} rads
 * @returns {Mat3}
 */
Mat3.rotateRadians = function (mat, rotationInRadians) {
	let a = mat.float32Array;
	let s = Math.sin(rotationInRadians);
	let c = Math.cos(rotationInRadians);
	// prettier-ignore
	return new Mat3([
		c * a[0] + s * a[1], c * a[1] - s * a[0], a[2],
		c * a[3] + s * a[4], c * a[4] - s * a[3], a[5],
		c * a[6] + s * a[7], c * a[7] - s * a[6], a[8],
	]);
};

/**
 *
 * @param {Mat3} mat
 * @param {Vec2} scale
 * @returns {Mat3}
 */
Mat3.scale = function (mat, scale) {
	let a = mat.float32Array;
	let { x, y } = Vec2.broadcast(scale);
	// prettier-ignore
	return new Mat3([
		x * a[0], y * a[1], a[2],
		x * a[3], y * a[4], a[5],
		x * a[6], y * a[7], a[8],
	]);
};

/**
 *
 * @param {Mat3} mat
 * @param {Vec3} vec
 * @returns {Vec3}
 */
Mat3.transform = function (mat, vec) {
	let a = mat.float32Array;
	let { x, y, z } = vec;
	return new Vec3({
		x: x * a[0] + y * a[1] + z * a[2],
		y: x * a[3] + y * a[4] + z * a[5],
		z: x * a[6] + y * a[7] + z * a[8],
	});
};
