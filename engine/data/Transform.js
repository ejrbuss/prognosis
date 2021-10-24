import { ClassUtil } from "./ClassUtil.js";
import { Mat3 } from "./Mat3.js";
import { Vec2 } from "./Vec2.js";
import { Vec3 } from "./Vec3.js";

export class Transform {
	/** @type {Vec3} */ position = Vec3;
	/** @type {number} */ rotation = Number;
	/** @type {Vec2} */ vscale = Vec2;

	/**
	 *
	 * @param {Transform} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

/**
 *
 * @param {Transform} transform1
 * @param {Transform} transform2
 * @returns {Transform}
 */
Transform.compose = function (transform1, transform2) {
	return new Transform({
		position: Vec3.add(transform1.position, transform2.position),
		rotation: transform1.rotation + transform2.rotation,
		scale: Vec2.mul(transform1.scale, transform2.scale),
	});
};

/**
 *
 * @param {Transform} transform
 */
Transform.toMat3 = function (transform) {
	let { x: px, y: py } = transform.position;
	let { x: sx, y: sy } = transform.scale;
	let s = Math.sin((transform.rotation * Math.PI) / 180);
	let c = Math.cos((transform.rotation * Math.PI) / 180);
	// prettier-ignore
	return new Mat3([
		sx * c, sy * -s, px,
		sx * s, sy * c,  py,
		0,      0,       1,
	]);
};
