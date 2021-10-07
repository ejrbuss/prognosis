const isConstructor = (value) => {
	return (
		typeof value === "object" &&
		value !== null &&
		"prototype" in value &&
		"constructor" in value.prototype &&
		value === value.prototype.constructor
	);
};

const errorWithCause = (message, cause) => {
	const error = new Error(message);
	error.stack = `${error.stack}\nCaused by: ${cause.stack}`;
	return error;
};

const atPath = (value, path) => {
	let result = value;
	for (const part of path) {
		if (typeof result !== "object" || result == null) {
			return undefined;
		}
		result = result[part];
	}
	return result;
};

const range = (begin, end, step) => {
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

const repeat = (value, times) => {
	const result = new Array(times);
	result.fill(value);
	return result;
};

const repeatArray = (array, times) => {
	const result = [];
	for (let i = 0; i < times; i += 1) {
		result.push(...array);
	}
	return result;
};

const capitalize = (name) => {
	return name.charAt(0).toUpperCase() + name.substring(1);
};

const unCapitalize = (name) => {
	return name.charAt(0).toLowerCase() + name.substring(1);
};

const isCapitalized = (name) => {
	return name.charAt(0).toUpperCase() === name.charAt(0);
};

const deepCopy = (value) => {
	if (typeof value !== "object" || value === null) {
		return value;
	}
	if (Array.isArray(value)) {
		return value.map(deepCopy);
	}
	const result = {};
	for (const key in value) {
		result[key] = deepCopy(value[key]);
	}
	return result;
};

const equals = (first, second) => {
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

const inspect = (value, options = {}) => {
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
				inspectedValues.push(insertTab(inspectAtPath(value[i], path, ",")));
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
				insertTab(inspectKey(key) + ": " + inspectAtPath(value[key], path, ","))
			);
			path.pop();
		}
		return `{\n${tab}${inspectedValues.join(`\n${tab}`)}\n}${suffix}`;
	};

	const inspectKey = (key) => {
		if (/[_A-Za-z][_A-Za-z0-9]*/.test(key)) {
			return key;
		}
		return `[${JSON.stringify(key)}]`;
	};

	const insertTab = (string) => {
		return string.replace(/\n/g, `\n${tab}`);
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

const delay = async (timeMs) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeMs);
	});
};

const doAsync = async (func) => {
	await delay(0);
	return func();
};

const basename = (path, suffix = "") => {
	const parts = path.split("/");
	const basename = parts[parts.length - 1];
	if (basename && basename.endsWith(suffix)) {
		return basename.substring(0, basename.length - suffix.length);
	}
	return basename;
};

const fetchJson = async (url) => {
	return await (await fetch(url)).json();
};

const fetchText = async (url) => {
	return await (await fetch(url)).text();
};

const importFromRoot = async (url) => {
	return await import(`../${url}`);
};

export const Util = {
	isConstructor,
	errorWithCause,
	atPath,
	range,
	repeat,
	repeatArray,
	capitalize,
	unCapitalize,
	isCapitalized,
	deepCopy,
	equals,
	inspect,
	delay,
	doAsync,
	basename,
	fetchJson,
	fetchText,
	importFromRoot,
};
