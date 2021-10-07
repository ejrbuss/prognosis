import { Util } from "./Util.js";
import { Types } from "./Types.js";
import { Loader } from "./Loader.js";

class AssertionError extends Error {
	constructor(message) {
		super(message);
	}
}

const HiddenFunctions = [
	"Tests.fail",
	"Tests.assertTrue",
	"Tests.assertFalse",
	"Tests.assertEquals",
	"Tests.assertIdentical",
	"Tests.assertThrows",
	"Tests.assertType",
];

let testDefinitions = [];
let currentSuite = "";

const describe = (description, test) => {
	testDefinitions.push({
		suite: currentSuite,
		description,
		test,
	});
};

const fail = (message, expectedActual) => {
	const error = new AssertionError(message);
	error.hasExpectedActual = !!expectedActual;
	if (expectedActual) {
		error.expected = expectedActual.expected;
		error.actual = expectedActual.actual;
	}

	// Remove hidden functions from stack trace
	error.stack = error.stack
		.split("\n")
		.filter(
			(line) =>
				!Test.HiddenFunctions.some((hiddenFunction) =>
					line.includes(hiddenFunction)
				)
		)
		.join("\n");

	throw error;
};

const assertTrue = (condition) => {
	if (!condition) {
		fail("Assertion Test.failed!", {
			expected: true,
			actual: condition,
		});
	}
};

const assertFalse = (condition) => {
	if (condition) {
		fail("Assertion Test.failed!", {
			expectedL: false,
			actual: condition,
		});
	}
};

const assertEquals = (expected, actual) => {
	if (!Util.equals(expected, actual)) {
		fail(`Expected ${actual} to equal ${expected}!`, {
			expected,
			actual,
		});
	}
};

const assertIdentical = (expected, actual) => {
	if (expected !== actual) {
		fail(`Expected ${actual} to be ${expected}!`, {
			actual,
			expected,
		});
	}
};

const assertThrows = (callback) => {
	try {
		callback();
	} catch (error) {
		return;
	}
	fail(`Expected callback to throw!`);
};

const assertType = (type, value) => {
	const explanation = Types.explain(type, value);
	if (explanation.problems.length === 1) {
		fail(Types.inspectExplanation(explanation));
	}
};

const run = async () => {
	let passes = 0;
	let fails = 0;
	let errors = 0;

	for (const { suite, description, test } of testDefinitions) {
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

export const Tests = {
	AssertionError,
	HiddenFunctions,
	describe,
	fail,
	assertTrue,
	assertFalse,
	assertEquals,
	assertIdentical,
	assertThrows,
	assertType,
	run,
};

Loader.define(Types.Test, async (json) => {
	Types.check(Types.String, json);
	currentSuite = Util.basename(json, ".js");
	await Util.importFromRoot(json);
});
