import { ClassUtil } from "./data/ClassUtil.js";
import { GameObject } from "./GameObject.js";

export class Tween {
	durationMs = Number;
	easing = Function;
	target = GameObject;
	repeat = Number;
	yoyo = Boolean;
	from = Object;
	to = Object;

	/**
	 *
	 * @param {Tween} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		// get defaults such that the following would work
		// new Tween({
		// 	durationMs: 1000,
		// 	target: GameObject,
		// 	to: { x: 100 },
		// });
		// BETTER YET: implement as a seperate function, keep constructor
		// trivial
		throw new Error("TODO!");
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

/**
 *
 * @param {Tween} tween
 */
Tween.play = function (tween, target) {
	throw new Error("TODO!");
};

/**
 *
 * @param {Tween} tween
 */
Tween.stop = function (tween) {
	throw new Error("TODO!");
};
