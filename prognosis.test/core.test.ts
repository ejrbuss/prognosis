import { Entity, Component } from "../prognosis/core.js";

class TestComponent extends Component {}

test("Entity.addComponent", () => {
	const e = new Entity("test");
	const c = new TestComponent();
	e.addComponent(c);
	expect(e.getComponent(TestComponent)).toBe(c);
});

test("Entity.removeComponent", () => {
	const e = new Entity("test");
	const c = new TestComponent();
	e.addComponent(c);
	expect(e.getComponent(TestComponent)).toBe(c);
	e.removeComponent(TestComponent);
	expect(e.getComponent(TestComponent)).toBe(undefined);
});
