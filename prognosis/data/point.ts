import { Tweenable } from "../tween.js";
import { Schema, SchemaType } from "./schema.js";
import { JsonData } from "./store.js";

const PointPropsSchema = Schema.object({
	x: Schema.number,
	y: Schema.number,
});

type PointProps = SchemaType<typeof PointPropsSchema>;

export class Point implements Tweenable<Point> {
	static Origin = new Point(0, 0);
	static Right = new Point(1, 0);
	static Left = new Point(-1, 0);
	static Up = new Point(0, 1);
	static Down = new Point(0, -1);

	static copy(point: Point) {
		return point;
	}

	static toStore(point: Point): JsonData {
		return { x: point.x, y: point.y };
	}

	static fromStore(data: JsonData): Point {
		return Point.Origin.with(PointPropsSchema.assert(data));
	}

	constructor(readonly x: number, readonly y: number = x) {}

	with(props: Partial<PointProps>): Point {
		return new Point(props.x ?? this.x, props.y ?? this.y);
	}

	get angle(): number {
		return Math.atan2(this.y, this.x);
	}

	get magnitudeSquared(): number {
		return this.x * this.x + this.y * this.y;
	}

	get magnitude(): number {
		return Math.sqrt(this.magnitudeSquared);
	}

	negated(): Point {
		return new Point(-this.x, -this.y);
	}

	flipX(): Point {
		return new Point(-this.x, this.y);
	}

	flipY(): Point {
		return new Point(this.x, -this.y);
	}

	normalized(): Point {
		let factor = this.magnitudeSquared;
		if (factor > 0) {
			factor = 1 / Math.sqrt(factor);
		}
		return new Point(this.x * factor, this.y * factor);
	}

	abs(): Point {
		return new Point(Math.abs(this.x), Math.abs(this.y));
	}

	normal(): Point {
		return new Point(-this.y, this.x);
	}

	distanceTo(point: Point): number {
		const dx = this.x - point.x;
		const dy = this.y - point.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	lerp(point: Point, amount: number): Point {
		const w1 = 1 - amount;
		const w2 = amount;
		return new Point(this.x * w1 + point.x * w2, this.y * w1 + point.y * w2);
	}

	add(a: number | Point): Point {
		if (typeof a === "number") {
			return new Point(this.x + a, this.y + a);
		}
		return new Point(this.x + a.x, this.y + a.y);
	}

	sub(a: number | Point): Point {
		if (typeof a === "number") {
			return new Point(this.x - a, this.y - a);
		}
		return new Point(this.x - a.y, this.y - a.y);
	}

	mul(a: number | Point): Point {
		if (typeof a === "number") {
			return new Point(this.x * a, this.y * a);
		}
		return new Point(this.x * a.x, this.y * a.y);
	}

	div(a: number | Point): Point {
		if (typeof a === "number") {
			return new Point(this.x / a, this.y / a);
		}
		return new Point(this.x / a.x, this.y / a.y);
	}

	dot(point: Point): number {
		return this.x * point.x + this.y * point.y;
	}

	max(point: Point): Point {
		return new Point(Math.max(this.x, point.x), Math.max(this.y, point.y));
	}

	min(point: Point): Point {
		return new Point(Math.min(this.x, point.x), Math.min(this.y, point.y));
	}

	isDirNorth(): Boolean {
		return this.angle == -(Math.PI / 2);
	}
	isDirSouth(): Boolean {
		return this.angle == Math.PI / 2;
	}
	isDirEast(): Boolean {
		return this.angle == 0;
	}
	isDirWest(): Boolean {
		return this.angle == Math.PI;
	}
	isDirNorthWest(): Boolean {
		return this.angle < -(Math.PI / 2) && this.angle > -Math.PI;
	}
	isDirNorthEast(): Boolean {
		return this.angle < 0 && this.angle > -(Math.PI / 2);
	}
	isDirSouthWest(): Boolean {
		return this.angle > Math.PI / 2 && this.angle < Math.PI;
	}
	isDirSouthEast(): Boolean {
		return this.angle > 0 && this.angle < Math.PI / 2;
	}
}
