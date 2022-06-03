import { Point } from "./point.js";

export type CameraProps = {
	position: Point;
	zoom: number;
	rotation: number;
};

export class Camera {
	position: Point;
	zoom: number;
	rotation: number;

	constructor(props?: Partial<CameraProps>) {
		this.position = props?.position ?? Point.Origin;
		this.zoom = props?.zoom ?? 1;
		this.rotation = props?.rotation ?? 0;
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
