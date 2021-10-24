import { Types } from "../Types.js";
import { ClassUtil } from "./ClassUtil.js";

export class Color {
	/** @type {number} */ red = Number;
	/** @type {number} */ green = Number;
	/** @type {number} */ blue = Number;
	/** @type {number} */ alpha = Number;

	/**
	 *
	 * @param {Color} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

/**
 *
 * @param {Color} color
 * @returns {String}
 */
Color.toCssString = function (color) {
	Types.check(Color, color);
	let r = color.red * 255;
	let g = color.green * 255;
	let b = color.blue * 255;
	let a = color.alpha;
	return `rgba(${r},${g},${b},${a})`;
};
