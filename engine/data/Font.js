import { ClassUtil } from "./ClassUtil.js";
import { Vec2 } from "./Vec2.js";

export class Font {
	/** @type {string} */ family = String;
	/** @type {string} */ style = String;
	/** @type {number} */ size = Number;
	/** @type {Vec2} */ alignment = Vec2;

	/**
	 *
	 * @param {Font} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}
