import { Test } from "../../engine/Test.js";
import { Types } from "../../engine/Types.js";

Test.describe("Types.nameOf", () => {
	Test.assertEquals("Boolean", Types.nameOf(Boolean));
	Test.assertEquals("Number", Types.nameOf(Number));
	Test.assertEquals("BigInt", Types.nameOf(BigInt));
	Test.assertEquals("String", Types.nameOf(String));
	Test.assertEquals("Symbol", Types.nameOf(Symbol));
	Test.assertEquals("Function", Types.nameOf(Function));
	Test.assertEquals("Object", Types.nameOf(Object));
	Test.assertEquals("Array", Types.nameOf(Array));
	Test.assertEquals("RegExp", Types.nameOf(RegExp));
	Test.assertEquals("[Number]", Types.nameOf([Number]));
	Test.assertEquals("[Number, Object]", Types.nameOf([Number, Object]));
	Test.assertEquals("{\n\tx: Number\n}", Types.nameOf({ x: Number }));
	Test.assertEquals("{\n\t[String]: Array\n}", Types.nameOf({ [String]: Array }));
});

Test.describe("Types.conforms true cases", () => {
	Test.assertTrue(Types.conforms(Boolean, true));
	Test.assertTrue(Types.conforms(Number, 1234));
	Test.assertTrue(Types.conforms(BigInt, 1234n));
	Test.assertTrue(Types.conforms(String, "string"));
	Test.assertTrue(Types.conforms(Symbol, Symbol("symbol")));
	Test.assertTrue(Types.conforms(Function, function () {}));
	Test.assertTrue(Types.conforms(Object, {}));
	Test.assertTrue(Types.conforms(Array, []));
	Test.assertTrue(Types.conforms(RegExp, /ab+/));
	Test.assertTrue(Types.conforms([], [1, 2, 3]));
	Test.assertTrue(Types.conforms([String, Number], ["string", 2]));
	Test.assertTrue(Types.conforms([Number], [1, 2, 3]));
	Test.assertTrue(Types.conforms({}, {}));
	Test.assertTrue(Types.conforms({ x: Number, y: Object }, { x: 4, y: {} }));
	Test.assertTrue(Types.conforms({ [String]: Number }, { x: 4 }));
});

Test.describe("Types.conforms false cases", () => {
	Test.assertFalse(Types.conforms(Boolean, "true"));
	Test.assertFalse(Types.conforms(Number, false));
	Test.assertFalse(Types.conforms(BigInt, 1234));
	Test.assertFalse(Types.conforms(String, Symbol("string")));
	Test.assertFalse(Types.conforms(Symbol, {}));
	Test.assertFalse(Types.conforms(Function, /ab+/));
	Test.assertFalse(Types.conforms(Object, ""));
	Test.assertFalse(Types.conforms(Array, { 0: 1, length: 1 }));
	Test.assertFalse(Types.conforms(RegExp, "ab+"));
	Test.assertFalse(Types.conforms([], {}));
	Test.assertFalse(Types.conforms([String, Number], ["string"]));
	Test.assertFalse(Types.conforms([Number], [1, 2, 3, true]));
	Test.assertFalse(Types.conforms({}, Symbol("{}")));
	Test.assertFalse(Types.conforms({ x: Number, y: Object }, { x: 4, y: null }));
	Test.assertFalse(Types.conforms({ [String]: Number }, { x: "4" }));
});

Test.describe("Types.explain", () => {
	Test.assertEquals(
		{
			type: Boolean,
			value: "string",
			problems: [{ type: Boolean, value: "string", path: [] }],
		},
		Types.explain(Boolean, "string")
	);
	Test.assertEquals(
		{
			type: { x: Number },
			value: { x: "string" },
			problems: [{ type: Number, value: "string", path: ["x"] }],
		},
		Types.explain({ x: Number }, { x: "string" })
	);
});
