import { Types } from "./Types.js";

export class Loader {
	static loadBehaviour() {}
}

const LoaderByType = new Map();

const load = async (type, json) => {
	const loader = LoaderByType.get(type);
	if (!loader) {
		// Try trivial loader
		Types.check(type, json);
		return json;
	}
	return await loader(json);
};

const loadAll = async (type, json) => {
	const promises = [];
	for (const subJson of json) {
		promises.push(load(type, subJson));
	}
	return await Promise.all(promises);
};

const define = (type, loader) => {
	Types.check(Types.Function, loader);
	LoaderByType.set(type, loader);
};

export const Loader = {
	load,
	loadAll,
	define,
};
