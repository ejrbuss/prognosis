export const Util = {};

/**
 *
 * @param {string} message
 * @param {Error} cause
 * @returns {Error}
 */
Util.errorWithCause = function (message, cause) {
	const error = new Error(message);
	error.stack = `${error.stack}\nCaused by: ${cause.stack}`;
	return error;
};

/**
 *
 * @param {any} value
 * @param {string[]} path
 * @returns {any}
 */
Util.atPath = function (value, path) {
	let result = value;
	for (const part of path) {
		if (typeof result !== "object" || result == null) {
			return undefined;
		}
		result = result[part];
	}
	return result;
};

/**
 *
 * @param {number} begin
 * @param {number} end
 * @param {number} step
 * @returns {number[]}
 */
Util.range = function (begin, end, step) {
	if (typeof end === "undefined") {
		return range(0, end, 1);
	}
	if (typeof step === "undefined") {
		step = begin < end ? 1 : -1;
	}
	const result = [];
	for (let i = begin; i < end; i += step) {
		result.push(i);
	}
	return result;
};

/**
 * @template T
 * @param {T} value
 * @param {number} times
 * @returns {T[]}
 */
Util.repeat = function (value, times) {
	const result = new Array(times);
	result.fill(value);
	return result;
};

/**
 * @template T
 * @param {T[]} array
 * @param {number} times
 * @returns {T[]}
 */
Util.repeatArray = function (array, times) {
	const result = [];
	for (let i = 0; i < times; i += 1) {
		result.push(...array);
	}
	return result;
};

/**
 *
 * @param {string} tab
 * @param {string} text
 * @returns {string}
 */
Util.tab = function (tab, text) {
	return text.replace(/\n/g, `\n${tab}`);
};

/**
 *
 * @param {string} name
 * @returns {string}
 */
Util.capitalize = function (name) {
	return name.charAt(0).toUpperCase() + name.substring(1);
};

/**
 *
 * @param {string} name
 * @returns {string}
 */
Util.unCapitalize = function (name) {
	return name.charAt(0).toLowerCase() + name.substring(1);
};

/**
 *
 * @param {any} first
 * @param {any} second
 * @returns {boolean}
 */
Util.equals = function (first, second) {
	if (first === second) {
		return true;
	}
	if (typeof first !== typeof second || typeof first !== "object") {
		return false;
	}
	if (first === null || second === null) {
		return false;
	}
	const firstKeys = Object.keys(first);
	const secondKeys = Object.keys(second);
	if (firstKeys.length !== secondKeys.length) {
		return false;
	}
	for (const key of firstKeys) {
		if (!Util.equals(first[key], second[key])) {
			return false;
		}
	}
	return true;
};

/**
 *
 * @param {any} value
 * @param {{ annotations: { path: string[], message: string }[], maxDepth: number, tab: string }} options
 * @returns
 */
Util.inspect = function (value, options = {}) {
	const inspectAtPath = (value, path, suffix) => {
		for (const annotation of annotations) {
			if (equals(annotation.path, path)) {
				suffix += annotation.message;
				break;
			}
		}

		if (typeof value === "undefined") {
			return `undefined${suffix}`;
		}
		if (typeof value === "function") {
			return `${value}${suffix}`;
		}
		if (typeof value !== "object" || value === null) {
			return `${JSON.stringify(value)}${suffix}`;
		}
		if (value instanceof Array) {
			if (value.length === 0) {
				return `[]${suffix}`;
			}
			if (path.length > maxDepth) {
				return `[ ... ]${suffix}`;
			}
			const inspectedValues = [];
			for (const i in value) {
				path.push(i);
				inspectedValues.push(tab(tab, inspectAtPath(value[i], path, ",")));
				path.pop();
			}
			return `[\n${tab}${inspectedValues.join(`\n${tab}`)}\n]${suffix}`;
		}
		if (Object.keys(value).length === 0) {
			return `{}${suffix}`;
		}
		if (path.length > maxDepth) {
			return `{ ... }${suffix}`;
		}
		const inspectedValues = [];
		for (const key in value) {
			path.push(key);
			inspectedValues.push(
				tab(tab, inspectKey(key) + ": " + inspectAtPath(value[key], path, ","))
			);
			path.pop();
		}
		return `{\n${tab}${inspectedValues.join(`\n${tab}`)}\n}${suffix}`;
	};

	const inspectKey = (key) => {
		if (/[_A-Za-z][_A-Za-z0-9]*/.test(key)) {
			return key;
		}
		return JSON.stringify(key);
	};

	const depthForAnnotations = () => {
		let depth = 2;
		for (const annotation of annotations) {
			depth = Math.max(depth, annotation.path);
		}
		return depth;
	};

	const annotations = options.annotations ?? [];
	const maxDepth = options.maxDepth ?? depthForAnnotations();
	const tab = options.tab ?? "\t";

	return inspectAtPath(value, [], "", "");
};

/**
 *
 * @param {number} timeMs
 */
Util.delayMs = async function (timeMs) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeMs);
	});
};

/**
 *
 * @param {function} func
 * @returns {Promise<any>}
 */
Util.doAsync = async function (func) {
	await delayMs(0);
	return func();
};

/**
 *
 * @param {string} path
 * @param {string} suffix
 * @returns {string}
 */
Util.basename = function (path, suffix = "") {
	const parts = path.split("/");
	const basename = parts[parts.length - 1];
	if (basename && basename.endsWith(suffix)) {
		return basename.substring(0, basename.length - suffix.length);
	}
	return basename;
};

/**
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
Util.fetchJson = async function (url) {
	return await (await fetch(url)).json();
};

/**
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
Util.fetchText = async function (url) {
	return await (await fetch(url)).text();
};

/**
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
Util.importFromRoot = async function (url) {
	return await import(`../${url}`);
};
