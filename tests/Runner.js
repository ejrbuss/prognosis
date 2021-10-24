import { Test } from "../engine/Test.js";

const tests = [
	"tests/engine/Types.js",
	"tests/engine/data/Record.js",
	"tests/engine/data/Enum.js",
];

for (const test of tests) {
	await Test.load(test);
}
Test.run();
