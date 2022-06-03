import { Node } from "../../prognosis/nodes/node.js";
import { Point } from "../../prognosis/data/point.js";

test("Node#started", () => {
	const node = new Node();
	expect(node.started).toBe(false);
	node._start();
	expect(node.started).toBe(true);
});

test("Node#children", () => {
	const parent = new Node();
	const child1 = new Node();
	const child2 = new Node();
	expect(parent.children).toEqual([]);
	parent.add(child1);
	expect(parent.children).toEqual([child1]);
	parent._start();
	expect(parent.started).toBe(true);
	expect(child1.started).toBe(true);
	expect(child2.started).toBe(false);
	parent.add(child2);
	expect(parent.children).toEqual([child1, child2]);
	expect(child2.started).toBe(true);
});

test("Node#localPosition", () => {
	const node = new Node();
	expect(node.localPosition).toEqual(Point.Origin);
	expect(node.localX).toBe(0);
	expect(node.localY).toBe(0);
	node.localPosition = Point.Up;
	expect(node.localPosition).toEqual(Point.Up);
	expect(node.localX).toBe(0);
	expect(node.localY).toBe(1);
});

test("Node#position", () => {
	const parent = new Node();
	const child = new Node();
	parent.add(child);
	expect(child.position).toEqual(Point.Origin);
	expect(child.x).toBe(0);
	expect(child.y).toBe(0);
	child.position = Point.Up;
	expect(child.position).toEqual(Point.Up);
	expect(child.x).toBe(0);
	expect(child.y).toBe(1);
	parent.position = Point.Left;
	expect(child.position).toEqual(new Point(-1, 1));
	expect(child.x).toBe(-1);
	expect(child.y).toBe(1);
	child.x = 4;
	expect(child.position).toEqual(new Point(4, 1));
	expect(child.x).toBe(4);
	expect(child.y).toBe(1);
	expect(child.localPosition).toEqual(new Point(5, 1));
	expect(child.localX).toBe(5);
	expect(child.localY).toBe(1);
});

test("Node#add", () => {
	const parent1 = new Node();
	const parent2 = new Node();
	const child = new Node();
	expect(parent1.children).toEqual([]);
	expect(parent2.children).toEqual([]);
	parent1.add(child);
	expect(parent1.children).toEqual([child]);
	expect(parent2.children).toEqual([]);
	parent2.add(child);
	expect(parent1.children).toEqual([]);
	expect(parent2.children).toEqual([child]);
});

test("Node#remove", () => {
	const parent = new Node();
	const child = new Node();
	expect(parent.children).toEqual([]);
	parent.add(child);
	expect(parent.children).toEqual([child]);
	parent.remove(child);
	expect(parent.children).toEqual([]);
});

test("Node#has", () => {
	class TestNode extends Node {}
	const parent = new Node();
	const child = new TestNode();
	expect(parent.has(TestNode)).toBe(false);
	parent.add(child);
	expect(parent.has(TestNode)).toBe(true);
	parent.remove(child);
	expect(parent.has(TestNode)).toBe(false);
});

test("Node#get", () => {
	class TestNode extends Node {}
	const parent = new Node();
	const child = new TestNode();
	expect(parent.get(TestNode)).toBeUndefined();
	parent.add(child);
	expect(parent.get(TestNode)).toBe(child);
	parent.remove(child);
	expect(parent.get(TestNode)).toBeUndefined();
});

test("Node#clone", () => {
	const original = new Node("Test");
	const clone = original.clone();
	expect(original).not.toBe(clone);
	expect(original.name).toBe("Test");
	expect(clone.name).toBe("Test");
});
