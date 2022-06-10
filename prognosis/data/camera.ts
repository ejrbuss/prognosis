import { Point } from "./point.js";

export type CameraProps = {
	x: number;
	y: number;
	position: Point;
	zoom: number;
	rotation: number;
};

export class Camera {
	position: Point = Point.Origin;
	zoom: number = 1;
	rotation: number = 0;

	with(props: Partial<CameraProps>): Camera {
		const camera = new Camera();
		camera.x = props.x ?? props.position?.x ?? this.x;
		camera.y = props.y ?? props.position?.y ?? this.y;
		camera.zoom = props.zoom ?? this.zoom;
		camera.rotation = props.rotation ?? this.rotation;
		return camera;
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
