import { ClassUtil } from "./data/ClassUtil.js";
import { Behaviour } from "./Behaviour.js";
import { GameObject } from "./GameObject.js";
import { GameObjects } from "./GameObjects.js";

/** @type {{ [name: String]: Layer }} */
export const Layers = {};

export class Layer {
	/** @type {string} */ name = String;
	/** @type {boolean} */ inWorldSpace = Boolean;
	/** @type {GameObject[]} */ gameObjects = [GameObject];
	/** @type {Behaviour[]} */ behaviours = [Behaviour];

	/**
	 *
	 * @param {Layer} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
		ClassUtil.defineNamedInstance(this, Layers);
	}
}

/**
 *
 * @param {any} json
 * @returns {Layer}
 */
Layer.load = function (json) {
	let values = { ...json };
	values.gameObjects = ClassUtil.resolveNamedInstances(
		values.gameObjects,
		GameObject,
		GameObjects
	);
	return new Layer(values);
};
