/*
sx kx x
ky sy y
0  0  1
*/

export class Transform {
	sx: number = 1;
	ky: number = 0;
	kx: number = 0;
	sy: number = 1;
	x: number = 0;
	y: number = 0;

	constructor(properties?: Partial<Transform>) {
		Object.assign(this, properties);
	}

	get array(): [number, number, number, number, number, number] {
		return [this.sx, this.ky, this.kx, this.sy, this.x, this.y];
	}

	scale(sx: number, sy: number): Transform {
		this.sx *= sx;
		this.sy *= sy;
		return this;
	}

	translte(x: number, y: number): Transform {
		this.x += x;
		this.y += y;
		return this;
	}

	rotateTurns(turns: number): Transform {
		return this.rotateRadians(turns * 2 * Math.PI);
	}

	rotateDegrees(degrees: number): Transform {
		return this.rotateRadians((degrees / 180) * Math.PI);
	}

	rotateRadians(radians: number): Transform {
		const s = Math.sin(radians);
		const c = Math.cos(radians);
		const sx = this.sx;
		const ky = this.ky;
		const kx = this.kx;
		const sy = this.sy;
		const x = this.x;
		const y = this.y;
		this.sx = c * sx + s * ky;
		this.ky = c * kx + s * sy;
		this.kx = c * x + s * y;
		this.sy = c * ky - s * sx;
		this.x = c * sy - s * kx;
		this.y = c * y - s * x;
		return this;
	}

	transform(transform: Transform): Transform {
		const sx = this.sx;
		const ky = this.ky;
		const kx = this.kx;
		const sy = this.sy;
		const x = this.x;
		const y = this.y;
		this.sx = transform.sx * sx + transform.kx * ky;
		this.kx = transform.sx * kx + transform.kx * sy;
		this.x = transform.sx * x + transform.kx * y + transform.x;
		this.ky = transform.ky * sx + transform.sy * ky;
		this.sy = transform.ky * kx + transform.sy * sy;
		this.y = transform.ky * x + transform.sy * y + transform.y;
		return this;
	}
}
