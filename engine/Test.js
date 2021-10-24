import { ClassUtil } from "./data/ClassUtil.js";
import { Util } from "./Util.js";
import { Types } from "./Types.js";

export class AssertionError extends Error {
	constructor(message) {
		super(message);
	}
}

class TestDefinition {
	/** @type {string} */ suite = String;
	/** @type {string} */ description = String;
	/** @type {function} */ test = Function;

	/**
	 *
	 * @param {TestDefinition} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(values, checked);
	}
}

export const Test = {};

/** @type {TestDefinition[]} */
Test.testDefinitions = [];
/** @type {string} */
test.currentSuite = "";

Test.load = async function (json) {
	Types.check(String, json);
	Test.currentSuite = Util.basename(json, ".js");
	await Util.importFromRoot(json);
};

/**
 *
 * @param {String} description
 * @param {Function} test
 */
Test.describe = function (description, test) {
	Test.testDefinitions.push(
		new TestDefinition({
			suite: currentSuite,
			description,
			test,
		})
	);
};

/**
 *
 * @param {String} message
 * @param {Object | undefined} expectedActual
 */
Test.fail = function (message, expectedActual) {
	const error = new AssertionError(message);
	error.hasExpectedActual = !!expectedActual;
	if (expectedActual) {
		error.expected = expectedActual.expected;
		error.actual = expectedActual.actual;
	}
	throw error;
};

/**
 *
 * @param {Boolean} condition
 */
Test.assertTrue = function (condition) {
	if (!condition) {
		Test.fail("Assertion Test.failed!", {
			expected: true,
			actual: condition,
		});
	}
};

/**
 *
 * @param {Boolean} condition
 */
Test.assertFalse = function (condition) {
	if (condition) {
		Test.fail("Assertion Test.failed!", {
			expected: false,
			actual: condition,
		});
	}
};

/**
 *
 * @param {any} expected
 * @param {any} actual
 */
Test.assertEquals = function (expected, actual) {
	if (!Util.equals(expected, actual)) {
		Test.fail(`Expected ${actual} to equal ${expected}!`, {
			expected,
			actual,
		});
	}
};

/**
 *
 * @param {any} expected
 * @param {any} actual
 */
Test.assertIdentical = function (expected, actual) {
	if (expected !== actual) {
		Test.fail(`Expected ${actual} to be ${expected}!`, {
			actual,
			expected,
		});
	}
};

/**
 *
 * @param {function} callback
 */
Test.assertThrows = function (callback) {
	try {
		callback();
		Test.fail(`Expected callback to throw!`);
	} catch {}
};

/**
 *
 * @param {any} type
 * @param {any} value
 */
Test.assertType = function (type, value) {
	const explanation = Types.explain(type, value);
	if (explanation.problems.length === 1) {
		Test.fail(Types.inspectExplanation(explanation));
	}
};

/**
 *
 * @returns {{ passes: number, fails: number, errors: number }}
 */
Test.run = async function () {
	let passes = 0;
	let fails = 0;
	let errors = 0;
	for (const { suite, description, test } of Test.testDefinitions) {
		try {
			await test();
			passes++;
			console.log(`${suite} - ${description} passed.`);
		} catch (error) {
			if (error instanceof AssertionError) {
				fails++;
				console.warn(`${suite} - ${description} Test failed!`);
				console.warn(error);
				if (error.hasExpectedActual) {
					console.warn("Expected:", error.expected);
					console.warn("Actual:", error.actual);
				}
			} else {
				errors++;
				console.error(`${suite} - ${description} threw an error!`);
				console.error(error);
			}
		}
	}
	const results = { passes, fails, errors };
	console.log(results);
	return results;
};
