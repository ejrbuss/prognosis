import { ClassUtil } from "./data/ClassUtil.js";

export class Sprite {
	/** @type {WebGLTexture} */ texture = WebGLTexture;
	/** @type {number} */ x = Number;
	/** @type {number} */ y = Number;
	/** @type {number} */ width = Number;
	/** @type {number} */ height = Number;

	/**
	 *
	 * @param {Sprite} values
	 * @param {boolean} checked
	 */
	constructor(values, checked) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}
