import { Types } from "./Types.js";

const Loader = {};

/**
 * @template T
 * @param {typeof T} type
 * @param {any} json
 * @returns {Promise<T>}
 */
Loader.load = async function (type, json) {
	// Check for trivial load
	if (Types.conforms(type, json)) {
		return json;
	}
	// Custom laoder
	if (type.load !== undefined) {
		return type.load(json);
	}
	// Fallback to constructor
	return new type(json);
};
