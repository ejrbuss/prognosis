import { Point } from "./point.js";

export type CameraComponents = {
	position: Point;
	zoom: number;
	rotation: number;
};

export class Camera {
	position: Point;
	zoom: number;
	rotation: number;

	constructor(components?: Partial<CameraComponents>) {
		this.position = components?.position ?? Point.Origin;
		this.zoom = components?.zoom ?? 1;
		this.rotation = components?.rotation ?? 0;
	}

	get x(): number {
		return this.position.x;
	}

	set x(x: number) {
		this.position = this.position.with({ x });
	}

	get y(): number {
		return this.position.y;
	}

	set y(y: number) {
		this.position = this.position.with({ y });
	}
}
