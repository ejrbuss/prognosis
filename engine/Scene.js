import { ClassUtil } from "./data/ClassUtil.js";
import { Color } from "./data/Color.js";
import { ColorAdjustments } from "./data/ColorAdjustments.js";
import { PostProcessingEffects } from "./data/PostProcessingEffects.js";
import { Transform } from "./data/Transform.js";
import { Behaviour } from "./Behaviour.js";
import { Layer, Layers } from "./Layers.js";

export class Scene {
	/** @type {string} */ name = String;
	/** @type {Transform} */ camera = Transform;
	/** @type {Color} */ backgroundColor = Color;
	/** @type {ColorAdjustments} */ colorAdjustments = ColorAdjustments;
	/** @type {PostProcessingEffects} */ postProcessingEffects =
		PostProcessingEffects;
	/** @type {Layer[]} */ layers = [Layer];
	/** @type {Behaviour[]} */ behaviours = [Behaviour];

	/**
	 *
	 * @param {Scene} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
		ClassUtil.defineNamedInstance(this, Scenes);
	}
}

/**
 *
 * @param {any} json
 * @returns {Scene}
 */
Scene.load = function (json) {
	let values = { ...json };
	values.layers = ClassUtil.resolveNamedInstances(values.layers, Layer, Layers);
	return new Scene(values);
};
