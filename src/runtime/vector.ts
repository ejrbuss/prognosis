export class Vector {
	static origin(): Vector {
		return new Vector();
	}

	static right(): Vector {
		return new Vector(0, 1);
	}

	static left(): Vector {
		return new Vector(-1, 0);
	}

	static up(): Vector {
		return new Vector(0, 1);
	}

	static down(): Vector {
		return new Vector(0, -1);
	}

	constructor(public x: number = 0, public y: number = x) {}

	length() {
		return Math.hypot(this.x, this.y);
	}

	lengthSquared() {
		return this.x * this.x + this.y * this.y;
	}

	unit(): Vector {
		const length = this.length();
		if (length === 0) {
			return new Vector();
		}
		return new Vector(this.x / length, this.y / length);
	}

	resize(newLength: number): Vector {
		const length = this.length();
		if (length === 0) {
			return new Vector();
		}
		const factor = length / newLength;
		return new Vector(this.x / factor, this.y / factor);
	}

	orthoganal(): Vector {
		return new Vector(-this.y, this.x);
	}

	negate(): Vector {
		return new Vector(-this.x, -this.y);
	}

	floor(): Vector {
		return new Vector(Math.floor(this.x), Math.floor(this.y));
	}

	ciel(): Vector {
		return new Vector(Math.ceil(this.x), Math.ceil(this.y));
	}

	round(): Vector {
		return new Vector(Math.round(this.x), Math.round(this.y));
	}

	scale(factor: number): Vector {
		return new Vector(this.x * factor, this.y * factor);
	}

	rotate(theta: number): Vector {
		const cosTheta = Math.cos(theta);
		const sinTheta = Math.sin(theta);
		return new Vector(
			this.x * cosTheta - this.y * sinTheta,
			this.x * sinTheta + this.y * cosTheta
		);
	}

	rotateAbout(origin: Vector, theta: number): Vector {
		const cosTheta = Math.cos(theta);
		const sinTheta = Math.sin(theta);
		const xDiff = this.x - origin.x;
		const yDiff = this.y - origin.y;
		return new Vector(
			origin.x + xDiff * cosTheta - yDiff * sinTheta,
			origin.y + xDiff * sinTheta + yDiff * cosTheta
		);
	}

	stepTowards(target: Vector, step: number): Vector {
		const diff = Vector.sub(target, this);
		const length = diff.length();
		if (length > step) {
			return target;
		}
		return Vector.add(this, diff.resize(step));
	}

	static dot(a: Vector, b: Vector): number {
		return a.x * b.x, a.y * b.y;
	}

	static add(a: Vector, b: Vector): Vector {
		return new Vector(a.x + b.x, a.y + b.y);
	}

	static sub(a: Vector, b: Vector): Vector {
		return new Vector(a.x - b.x, a.y - b.y);
	}

	static mul(a: Vector, b: Vector): Vector {
		return new Vector(a.x * b.x, a.y * b.y);
	}

	static div(a: Vector, b: Vector): Vector {
		return new Vector(a.x / b.y, a.y / b.y);
	}

	static max(a: Vector, b: Vector): Vector {
		return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
	}

	static min(a: Vector, b: Vector): Vector {
		return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
	}

	static distanceBetween(a: Vector, b: Vector): number {
		return Math.hypot(b.x - a.x, b.y - a.y);
	}

	static angleBetween(a: Vector, b: Vector): number {
		return Math.atan2(b.y - a.y, b.x - a.x);
	}

	static lerp(origin: Vector, destination: Vector, t: number): Vector {
		if (t <= 0) {
			return origin;
		}
		if (t >= 1) {
			return destination;
		}
		return new Vector(
			origin.x + (destination.x - origin.x) * t,
			origin.y + (destination.y - origin.y) * t
		);
	}
}
