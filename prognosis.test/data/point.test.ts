import { Point } from "../../prognosis/data/point.js";

function expectClosePoints(actual: Point, expected: Point) {
	expect(actual.x).toBeCloseTo(expected.x);
	expect(actual.y).toBeCloseTo(expected.y);
}

test("Point#with", () => {
	expectClosePoints(Point.Origin.with({ x: 2 }), new Point(2, 0));
	expectClosePoints(Point.Left.with({ y: 7 }), new Point(-1, 7));
});

test("Point#angle", () => {
	expect(Point.Origin.angle).toBeCloseTo(0);
	expect(Point.Up.angle).toBeCloseTo(Math.PI / 2);
	expect(Point.Down.angle).toBeCloseTo(-Math.PI / 2);
});

test("Point#magnitudeSquared", () => {
	expect(Point.Origin.magnitudeSquared).toBeCloseTo(0);
	expect(Point.Up.magnitudeSquared).toBeCloseTo(1);
	expect(new Point(3, 4).magnitudeSquared).toBe(25);
});

test("Point#magnitude", () => {
	expect(Point.Origin.magnitude).toBeCloseTo(0);
	expect(Point.Up.magnitude).toBeCloseTo(1);
	expect(new Point(3, 4).magnitude).toBeCloseTo(5);
});

test("Point#negated", () => {
	expectClosePoints(Point.Origin.negated(), Point.Origin);
	expectClosePoints(Point.Up.negated(), Point.Down);
	expectClosePoints(new Point(-4, 5).negated(), new Point(4, -5));
});

test("Point#normalzied()", () => {
	expectClosePoints(Point.Origin.normalized(), Point.Origin);
	expectClosePoints(Point.Up.normalized(), Point.Up);
	expectClosePoints(new Point(3, 4).normalized(), new Point(3 / 5, 4 / 5));
});

test("Point#abs", () => {
	expectClosePoints(Point.Origin.abs(), Point.Origin);
	expectClosePoints(Point.Up.abs(), Point.Up);
	expectClosePoints(Point.Down.abs(), Point.Up);
});

test("Point#normal", () => {
	expectClosePoints(Point.Origin.normal(), Point.Origin);
	expectClosePoints(Point.Up.normal(), Point.Left);
	expectClosePoints(Point.Left.normal(), Point.Down);
});

test("Point#distanceTo", () => {
	expect(Point.Origin.distanceTo(Point.Origin)).toBeCloseTo(0);
	expect(Point.Origin.distanceTo(Point.Up)).toBeCloseTo(1);
	expect(Point.Up.distanceTo(Point.Left)).toBeCloseTo(Math.sqrt(2));
});

test("Point#lerp", () => {
	expectClosePoints(Point.Origin.lerp(Point.Left, 0.5), new Point(-0.5, 0));
	expectClosePoints(Point.Down.lerp(Point.Left, 1), Point.Left);
});
