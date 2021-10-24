import { Util } from "./Util.js";

function Any() {}
function Undefined() {}
function Function() {}
function Event() {}
function Behaviour() {}
function Scene() {}
function Layer() {}
function Image() {}
function Sound() {}
function GameObject() {}
function Test() {}

const Color = {
	red: Number,
	green: Number,
	blue: Number,
	alpha: Number,
};

const Point2D = {
	x: Number,
	y: Number,
};

const Point3D = {
	x: Number,
	y: Number,
	z: Number,
};

const BoundingBox = {
	width: Number,
	height: Number,
	offset: Point2D,
};

const Transform = {
	position: Point3D,
	rotation: Number,
	scale: Point2D,
};

const Font = {
	family: String,
	style: String,
	size: Number,
	horizontalAlignment: String,
	verticalAlignment: String,
	color: Color,
};

const SpriteSheet = {
	image: Image,
	jsonData: Object,
};

const TypeRegister = new Map();

const define = (representative, predicate) => {
	TypeRegister.set(representative, predicate);
	return representative;
};

const isFundamental = (type) => {
	return TypeRegister.has(type);
};

const typeOf = (value) => {
	for (const [representative, predicate] of TypeRegister.entries()) {
		if (predicate(value)) {
			return representative;
		}
	}
	if (value instanceof Array) {
		const types = [];
		let lastType;
		let allMatch = true;
		for (const v of value) {
			const type = typeOf(v);
			types.push(type);
			lastType = lastType ?? type;
			allMatch = allMatch && Util.equals(type, lastType);
			lastType = type;
		}
		if (allMatch && lastType) {
			return [lastType];
		}
		return types;
	}
	if (value instanceof Object) {
		if (value.constructor !== Object) {
			return value.constructor;
		}
		const type = {};
		for (const key in value) {
			type[key] = typeOf(value[key]);
		}
		return type;
	}
	throw new Error(`Could not determine type of ${value}!`);
};

const nameOf = (type) => {
	if (TypeRegister.has(type) || Util.isConstructor(type)) {
		return type.name;
	}
	if (type instanceof Array) {
		// Special case the empty Array
		if (type.length === 0) {
			return "Array";
		}
		return Util.inspect(type.map(nameOf));
	}
	if (type instanceof Object) {
		if (Object.keys(type).length === 0) {
			return "Object";
		}
		const nameObject = {};
		for (const key in type) {
			nameObject[key] = nameOf(type[key]);
		}
		return Util.inspect(nameObject);
	}
	throw new Error(`Not a valid type: ${type}!`);
};

const explain = (type, value) => {
	const predicate = TypeRegister.get(type);
	if (predicate) {
		return predicate(value)
			? { type, value, problems: [] }
			: { type, value, problems: [{ value, type, path: [] }] };
	}
	if (Util.isConstructor(type)) {
		return value instanceof type
			? { type, value, problems: [] }
			: { type, value, problems: [{ value, type, path: [] }] };
	}
	if (type instanceof Array) {
		if (!(value instanceof Array)) {
			return { type, value, problems: [{ value, type, path: [] }] };
		}
		// Handle tuple of type
		if (type.length !== 1) {
			const problems = [];
			for (const i in type) {
				const explanation = explain(type[i], value[i]);
				for (const problem of explanation.problems) {
					problems.push({ ...problem, path: [i, ...problem.path] });
				}
			}
			return { value, type, problems };
		}
		// Handle array of type
		const problems = [];
		for (const i in value) {
			const explanation = explain(type[0], value[i]);
			for (const problem of explanation.problems) {
				problems.push({ ...problem, path: [i, ...problem.path] });
			}
		}
		return { value, type, problems };
	}
	if (type instanceof Object) {
		if (!(value instanceof Object)) {
			return { type, value, problems: [{ value, type, path: [] }] };
		}
		const problems = [];
		for (const key in type) {
			const explanation = Types.explain(type[key], value[key]);
			for (const problem of explanation.problems) {
				problems.push({ ...problem, path: [key, ...problem.path] });
			}
		}
		return { type, value, problems };
	}
	throw new Error(`Not a valid type: ${type}!`);
};

const conforms = (type, value) => {
	const predicate = TypeRegister.get(type);
	if (predicate) {
		return predicate(value);
	}
	if (Util.isConstructor(type)) {
		return value instanceof type;
	}
	if (type instanceof Array) {
		if (!(value instanceof Array)) {
			return false;
		}
		// Handle tuple of type
		if (type.length !== 1) {
			for (const i in type) {
				if (!conforms(type[i], value[i])) {
					return false;
				}
			}
			return true;
		}
		// Handle array of type
		for (const i in value) {
			if (!conforms(type[0], value[i])) {
				return false;
			}
		}
		return true;
	}
	if (type instanceof Object) {
		if (!(value instanceof Object)) {
			return false;
		}
		for (const key in type) {
			if (!conforms(type[key], value[key])) {
				return false;
			}
		}
		return true;
	}
	throw new Error(`Not a valid type: ${type}!`);
};

const check = (type, value) => {
	if (!conforms(type, value)) {
		const explanation = explain(type, value);
		const error = new Error(
			`Value does not conform to type!\n${inspectExplanation(explanation)}`
		);
		Object.assign(error, explanation);
		throw error;
	}
	return value;
};

const inspectExplanation = (explanation) => {
	const annotations = [];
	for (const problem of explanation.problems) {
		annotations.push({
			path: problem.path,
			message: ` <<< Expected ${nameOf(problem.type)}`,
		});
		let value = explanation.value;
		for (const part of problem.path) {
			value[part] = value[part];
			value = value[part];
		}
	}
	return Util.inspect(explanation.value, { annotations });
};

export const Types = {
	// Fundamental Types
	Any,
	Undefined,
	Function,
	Number,
	Boolean,
	Number,
	BigInt,
	String,
	Symbol,
	Object,
	Array,
	Event,
	Behaviour,
	Scene,
	Layer,
	Image,
	SpriteSheet,
	Sound,
	GameObject,
	Test,
	// Composite Types
	Color,
	Point2D,
	Point3D,
	BoundingBox,
	Transform,
	Font,

	define,
	isFundamental,
	typeOf,
	nameOf,
	explain,
	conforms,
	check,
	inspectExplanation,
};

define(Any, (_value) => true);
define(Undefined, (value) => typeof value === "undefined");
define(Function, (value) => typeof value === "function");
define(Boolean, (value) => typeof value === "boolean");
define(Number, (value) => typeof value === "number");
define(BigInt, (value) => typeof value === "bigint");
define(String, (value) => typeof value === "string");
define(Symbol, (value) => typeof value === "symbol");
