export class Transform {
	static Identity = new Transform(1, 0, 0, 1, 0, 0);

	constructor(
		readonly sx: number,
		readonly ky: number,
		readonly kx: number,
		readonly sy: number,
		readonly x: number,
		readonly y: number
	) {}

	toArray(): [number, number, number, number, number, number] {
		return [this.sx, this.ky, this.kx, this.sy, this.x, this.y];
	}

	translate(x: number, y: number = 0): Transform {
		return new Transform(
			this.sx,
			this.ky,
			this.kx,
			this.sy,
			this.x + x,
			this.y + y
		);
	}

	scale(sx: number, sy: number = sx): Transform {
		return new Transform(
			this.sx * sx,
			this.ky,
			this.kx,
			this.sy * sy,
			this.x,
			this.y
		);
	}
}
