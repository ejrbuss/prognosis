import { Point } from "./point.js";

type TransformComponents = {
	position: Point;
	localPosition: Point;
	scale: Point;
	localScale: Point;
	rotation: number;
	localRotation: number;
};

export class Transform {
	static Identity = new Transform(Point.Origin, new Point(1, 1), 0);

	constructor(
		readonly localPosition: Point,
		readonly localScale: Point,
		readonly localRotation: number,
		readonly parent?: Transform
	) {}

	get position(): Point {
		throw new Error("TODO");
	}

	get scale(): Point {
		throw new Error("TODO");
	}

	get rotation(): number {
		throw new Error("TODO");
	}

	with(components: Partial<TransformComponents>): Transform {
		return new Transform(
			components.position ?? this.position,
			components.scale ?? this.scale,
			components.rotation ?? this.rotation
		);
	}

	get matrix(): [number, number, number, number, number, number] {
		const c = Math.cos(this.rotation);
		const s = Math.sin(this.rotation);
		// prettier-ignore
		return [
			c * this.scale.x, -s,                 this.position.x,
			s,                 c  * this.scale.y, this.position.y,
		];
	}

	translateBy(x: number, y: number): Transform {
		return this.with({
			position: new Point(this.position.x + x, this.position.y + y),
		});
	}

	scaleBy(x: number, y: number = x): Transform {
		return this.with({ scale: new Point(this.scale.x * x, this.scale.y * y) });
	}

	rotateBy(radians: number): Transform {
		return this.with({ rotation: this.rotation + radians });
	}

	rotateAround(origin: Point, radians: number): Transform {
		throw new Error("TODO");
	}

	compose(transform: Transform): Transform {
		throw new Error("TODO");
	}
}
