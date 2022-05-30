import { Entity, Component } from "../prognosis/core.js";

class TestComponent extends Component {}

test("Entity.add", () => {
	const e = new Entity("test");
	const c = new TestComponent();
	e.add(c);
	expect(e.get(TestComponent)).toBe(c);
});

test("Entity.remove", () => {
	const e = new Entity("test");
	const c = new TestComponent();
	e.add(c);
	expect(e.get(TestComponent)).toBe(c);
	e.remove(TestComponent);
	expect(e.get(TestComponent)).toBe(undefined);
});
