import { ClassUtil } from "./ClassUtil.js";

export class Vec2 {
	/** @type {number} */ x = Number;
	/** @type {number} */ y = Number;

	/**
	 *
	 * @param {Vec2} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

Vec2.Zeros = new Vec2({ x: 0, y: 0 });

/**
 *
 * @param {Vec2 | number} v
 * @returns {Vec2}
 */
Vec2.broadcast = function (v) {
	if (v instanceof Vec2) {
		return v;
	} else {
		return new Vec2({
			x: v,
			y: v,
		});
	}
};

/**
 *
 * @param {Vec2} vec1
 * @param {Vec2 | number} vec2
 * @returns {Vec2}
 */
Vec2.add = function (vec1, vec2) {
	vec1 = Vec2.broadcast(vec1);
	vec2 = Vec2.broadcast(vec2);
	return new Vec2({
		x: vec1.x + vec2.x,
		y: vec1.y + vec2.y,
	});
};

/**
 *
 * @param {Vec2} vec1
 * @param {Vec2 | number} vec2
 * @returns {Vec2}
 */
Vec2.mul = function (vec1, vec2) {
	vec1 = Vec2.broadcast(vec1);
	vec2 = Vec2.broadcast(vec2);
	return new Vec2({
		x: vec1.x * vec2.x,
		y: vec1.y * vec2.y,
	});
};
