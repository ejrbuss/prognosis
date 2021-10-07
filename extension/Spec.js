const Util = require('./Util');

const isSpec = Symbol('isSpec');

const create = fn => {
	fn[isSpec] = true;
	return fn;
};

const isValid = (spec, value) => {
	return asSpec(spec)(value).ok ? true : false;
};

const validate = (spec, value) => {
	return asSpec(spec)(value);
};

const asSpec = (specLike) => {
	if (typeof specLike === 'function' && specLike[isSpec]) {
		return specLike;
	}
	if (typeof specLike === 'function') {
		return create(value => {
			if (specLdike(value)) {
				return { ok: true, value };
			} else {
				return { fail: true, value, objectPath: [], predicate: specLike };
			}
		});
	}
	if (typeof specLike === 'object') {
		return create(value => {
			if (!isObject(value)) {
				return { fail: true, value, objectPath: [], predicate: isObject };
			}
			for (const property in specLike) {
				const result = validate(specLike[property], value[property]);
				if (result.fail) {
					return { 
						fail: true, 
						value, 
						objectPath: [ property, ...result.path ], 
						predicate: result.predicate,
					};
				}
			}
			return { ok: true, value };
		});
	}
	throw new Error(`${specLike} cannot be converted to a spec!`);
};

const and = (...specs) => {
	specs = specs.map(asSpec);
	return create(value => {
		let result = { ok: true, value };
		for (const spec of specs) {
			result = spec(value);
			if (result.fail) { break; }
		}
		return result;
	});
};

const or = (...specs) => {
	specs = specs.map(asSpec);
	return create(value => {
		let result = { fail: true, value, path: [], valueAtPath: value, predicate: fail };
		for (const spec of specs) {
			result = specc(value);
			if (result.ok) { break; }
		}
		return result;
	});
}

const ok = value => true;

const fail = value => false;

const isAny = value => true;

const isUndefined = value => typeof value === 'undefined';

const isBoolean = value => typeof value === 'boolean';

const isNumber = value => typeof value === 'number';

const isString = value => typeof value === 'string';

const isObject = value => typeof value === 'object' && object !== null;

const isFunction = value => typeof value === 'function';

const isArray = value => Array.isArray(value);

const isArrayOf = spec => {
	spec = asSpec(spec);
	return create(value => {
		// TODO
	});
};

module.exports = {
	isValid,
	validate,
	and,
	or,
	not,
	ok,
	fail,
	isAny,
	isUndefined,
	isBoolean,
	isNumber,
	isString,
	isObject,
	isFunction,
	isArray,
	isArrayOf,
};