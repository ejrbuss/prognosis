import { ClassUtil } from "./ClassUtil.js";

export class Vec3 {
	/** @type {number} */ x = Number;
	/** @type {number} */ y = Number;
	/** @type {number} */ z = Number;

	/**
	 *
	 * @param {Vec3} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

Vec3.Zeros = new Vec3({ x: 0, y: 0, z: 0 });

/**
 *
 * @param {Vec3 | number} v
 * @returns {Vec3}
 */
Vec3.broadcast = function (v) {
	if (v instanceof Vec3) {
		return v;
	} else {
		return new Vec3({
			x: v,
			y: v,
			z: v,
		});
	}
};

/**
 *
 * @param {Vec3} vec1
 * @param {Vec3 | number} vec2
 * @returns {Vec3}
 */
Vec3.add = function (vec1, vec2) {
	vec1 = Vec3.broadcast(vec1);
	vec2 = Vec3.broadcast(vec2);
	return new Vec3({
		x: vec1.x + vec2.x,
		y: vec1.y + vec2.y,
		z: vec1.z + vec2.z,
	});
};

/**
 *
 * @param {Vec3} vec1
 * @param {Vec3 | number} vec2
 * @returns {Vec3}
 */
Vec3.mul = function (vec1, vec2) {
	vec1 = Vec3.broadcast(vec1);
	vec2 = Vec3.broadcast(vec2);
	return new Vec3({
		x: vec1.x * vec2.x,
		y: vec1.y * vec2.y,
		z: vec1.z * vec2.z,
	});
};
