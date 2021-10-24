import { ClassUtil } from "./data/ClassUtil.js";
import { Behaviour, Behaviours } from "./Behaviour.js";
import { Loader } from "./Loader.js";
import { Util } from "./Util.js";
import { Vec2 } from "./Vec2.js";
import { Vec3 } from "./Vec3.js";

/** @type {{ [name: String]: GameObject }} */
export const GameObjects = {};

export class GameObject {
	/** @type {string} */ name = String;
	/** @type {boolean} */ visible = Boolean;
	/** @type {Vec3} */ position = Vec3;
	/** @type {Vec2} */ scale = Vec2;
	/** @type {string[]} */ tags = [String];
	/** @type {GameObject[]} */ childdren = [GameObject];
	/** @type {Behaviour[]} */ behaviours = [Behaviour];

	/**
	 *
	 * @param {GameObject} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
		ClassUtil.defineNamedInstance(this, GameObjects);
	}
}

/**
 *
 * @param {any} json
 * @returns {GameObject}
 */
GameObject.load = function (json) {
	const behaviours = ClassUtil.resolveNamedInstances(
		json.behaviours,
		Behaviour,
		Behaviours
	);
	for (let name of json.behaviours) {
		let behaviour = Behaviours[name];
		if (!behaviour) {
			throw new Error();
		}
	}
	let values = { ...json, behaviours };
	for (let behaviour of behaviours) {
		for (let property in behaviour.properties) {
			try {
				let type = behaviour.properties[property];
				let value = Loader.load(type, json[property]);
				values[property] = value;
			} catch (cause) {
				throw Util.errorWithCause(
					`Failed to load property for GameObject ${json.name}: ${property}!`
				);
			}
		}
	}
	return new GameObject(values);
};
