import { ClassUtil } from "./ClassUtil.js";

// TODO implement as part of post processing
export class PostProcessingEffects {
	/** @type {{ size: number, intensity: number }} */ vignette = {
		size: Number,
		intensity: Number,
	};
	/** @type {{ size: number, intensity: number }} */ grain = {
		size: Number,
		intensity: Number,
	};
	/** @type {{ intensity: number }} */ blur = {
		intensity = Number,
	};
	/** @type {{ red: number, green: number, blue: Number }} */
	chromaticAberration = {
		red: Number,
		green: Number,
		blue: Number,
	};

	/**
	 *
	 * @param {PostProcessingEffects} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = boolean) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}
