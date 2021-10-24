import { Types } from "../Types.js";

export const ClassUtil = {};

/**
 * @template T
 * @param {T} instance
 * @param {any} values
 * @param {boolean} checked
 * @returns {T}
 */
ClassUtil.dataClassConstructor = function (instance, values, checked) {
	if (checked) {
		Types.check(instance, values);
	}
	for (const property in instance) {
		instance[property] = values[property];
	}
};

/**
 * @template T
 * @param {T & { name: String}} instance
 * @param {{ [name: String]: T }} namedInstances
 */
ClassUtil.defineNamedInstance = function (instance, namedInstances) {
	if (instance.name in namedInstances) {
		throw new Error(
			`Duplicate ${instance.constructor} name: ${instance.name}!`
		);
	}
	namedInstances[instance.name] = instance;
};

/**
 * @template T
 * @param {string[]} names
 * @param {typeof T} type
 * @param {{ [name: string]: T }} namedInstances
 * @returns {T[]}
 */
ClassUtil.resolveNamedInstances = function (names, type, namedInstances) {
	let resolved = [];
	for (let name of names) {
		if (!(name in namedInstances)) {
			throw new Error(`Unknown name of ${type}: ${name}`);
		}
		resolved.push(namedInstances[name]);
	}
	return resolved;
};
