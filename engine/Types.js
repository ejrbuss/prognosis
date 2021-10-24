import { ClassUtil } from "./data/ClassUtil.js";
import { Util } from "./Util.js";

const IdentifierRegexp = /^[_A-Za-z][_A-Za-z0-9]*$/;

const Primitves = new Set([Boolean, Number, BigInt, String, Symbol, Function]);

const TypeofToPrimitive = {
	boolean: Boolean,
	number: Number,
	bigint: BigInt,
	string: String,
	symbol: Symbol,
	function: Function,
};

export class Any {}

export class Explanation {
	/** @type {type} */ type = Any;
	/** @type {value} */ value = Any;
	/** @type {{ path: string[], type: any, value: any }} */ problems = [
		{
			path: [String],
			type: Any,
			value: Any,
		},
	];

	/**
	 *
	 * @param {Explanation} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export const Types = {};

/**
 *
 * @param {Object} type
 * @returns {String}
 */
Types.nameOf = function (type) {
	if (typeof type === "function") {
		return type.name;
	}
	if (type instanceof Array) {
		if (type.length === 0) {
			return "Array";
		}
		const namedTypes = [];
		for (const i in type) {
			namedTypes.push(Util.tab("\t", Types.nameOf(type[i])));
		}
		const multiline = namedTypes.some((text) => text.includes("\n"));
		if (multiline) {
			return `[\n\t${namedTypes.join(",\n\t")}\n]`;
		} else {
			return `[${namedTypes.join(", ")}]`;
		}
	}
	if (type instanceof Object) {
		const keys = Object.keys(type);
		if (keys.length === 0) {
			return "Object";
		}
		const namedTypes = [];
		for (const key of keys) {
			let keyName;
			if (IdentifierRegexp.test(key)) {
				keyName = key;
			} else if (key === String.toString()) {
				keyName = "[String]";
			} else {
				keyName = JSON.stringify(key);
			}
			namedTypes.push(`${keyName}: ${Util.tab("\t", Types.nameOf(type[key]))}`);
		}
		return `{\n\t${namedTypes.join(",\n\t")}\n}`;
	}
	throw new Error(`Not a valid type: ${type}!`);
};

/**
 *
 * @param {Object} type
 * @param {Any} value
 * @returns {Explanation}
 */
Types.explain = function (type, value) {
	// Explanation for no problems
	const noProblems = new Explanation({ type, value, problems: [] });
	// Explanation if this is the failing type
	const topLevelProblem = new Explanation({
		type,
		value,
		problems: [{ type, value, path: [] }],
	});
	if (type === Any) {
		return noProblems;
	}
	if (Primitves.has(type)) {
		return TypeofToPrimitive[typeof value] === type
			? noProblems
			: topLevelProblem;
	}
	if (value === null) {
		return topLevelProblem;
	}
	if (typeof type === "function") {
		return value instanceof type ? noProblems : topLevelProblem;
	}
	if (type instanceof Array) {
		if (!(value instanceof Array)) {
			return topLevelProblem;
		}
		// Handle tuples
		if (type.length !== 1) {
			const problems = [];
			for (const i in type) {
				const explanation = Types.explain(type[i], value[i]);
				for (const problem of explanation.problems) {
					problems.push({ ...problem, path: [i, ...problem.path] });
				}
			}
			return new Explanation({ value, type, problems });
		}
		// Handle arrays
		const problems = [];
		const subType = type[0];
		for (const i in value) {
			const explanation = explain(subType, value[i]);
			for (const problem of explanation.problems) {
				problems.push({ ...problem, path: [i, ...problem.path] });
			}
		}
		return new Explanation({ value, type, problems });
	}
	if (type instanceof Object) {
		if (!(value instanceof Object)) {
			return topLevelProblem;
		}
		const keys = Object.keys(type);
		// String key
		if (keys.length === 1 && keys[0] === String.toString()) {
			const problems = [];
			const subType = type[keys[0]];
			for (const key in value) {
				const explanation = explain(subType, value[key]);
				for (const problem of explanation.problems) {
					problems.push({ ...problem, path: [i, ...problem.path] });
				}
			}
			return new Explanation({ value, type, problems });
		}
		const problems = [];
		for (const key in type) {
			const explanation = Types.explain(type[key], value[key]);
			for (const problem of explanation.problems) {
				problems.push({ ...problem, path: [key, ...problem.path] });
			}
		}
		return new Explanation({ type, value, problems });
	}
	throw new Error(`Not a valid type: ${type}!`);
};

/**
 *
 * @param {Object} type
 * @param {Any} value
 */
Types.conforms = function (type, value) {
	if (type === Any) {
		return true;
	}
	if (Primitves.has(type)) {
		return TypeofToPrimitive[typeof value] === type;
	}
	if (value === null) {
		return false;
	}
	if (typeof type === "function") {
		return value instanceof type;
	}
	if (type instanceof Array) {
		if (!(value instanceof Array)) {
			return false;
		}
		// Handle tuples
		if (type.length !== 1) {
			for (const i in type) {
				if (!Types.conforms(type[i], value[i])) {
					return false;
				}
			}
			return true;
		}
		// Handle arrays
		const subType = type[0];
		for (const i in value) {
			if (!Types.conforms(subType, value[i])) {
				return false;
			}
		}
		return true;
	}
	if (type instanceof Object) {
		if (!(value instanceof Object)) {
			return false;
		}
		const keys = Object.keys(type);
		// String key
		if (keys.length === 1 && keys[0] === String.toString()) {
			const subType = type[keys[0]];
			for (const key in value) {
				if (!Types.conforms(subType, value[key])) {
					return false;
				}
			}
			return true;
		}
		for (const key of keys) {
			if (!Types.conforms(type[key], value[key])) {
				return false;
			}
		}
		return true;
	}
	throw new Error(`Not a valid type: ${type}!`);
};

/**
 * @param {Objecy} type
 * @param {Any} value
 */
Types.check = function (type, value) {
	if (!Types.conforms(type, value)) {
		const explanation = Types.explain(type, value);
		const error = new Error(
			`Value does not conform to type!\n${Types.inspectExplanation(
				explanation
			)}`
		);
		Object.assign(error, explanation);
		throw error;
	}
	return value;
};

/**
 *
 * @param {Explanation} explanation
 * @returns {String}
 */
Types.inspectExplanation = function (explanation) {
	Types.check(Explanation, explanation);
	const annotations = [];
	for (const problem of explanation.problems) {
		annotations.push({
			path: problem.path,
			message: `<<< Expected ${Types.nameOf(problem.type)}`,
		});
		let value = explanation.value;
		for (const part of problem.path) {
			value[part] = value[part];
			value = value[part];
		}
	}
	return Util.inspect(explanation.value, { annotations });
};
