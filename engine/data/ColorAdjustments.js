import { ClassUtil } from "./ClassUtil.js";

// TODO implement as part of post processing
export class ColorAdjustments {
	/** @type {number} */ exposure = Number;
	/** @type {number} */ contrast = Number;
	/** @type {number} */ highlights = Number;
	/** @type {number} */ shadows = Number;
	/** @type {number} */ saturation = Number;
	/** @type {number} */ temperature = Number;
	/** @type {Color} */ tint = Color;
	/** @type {number} */ /** @type {number} */ sepia = Number;

	/**
	 *
	 * @param {ColorAdjustments} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}
