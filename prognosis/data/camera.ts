import { Point } from "./point.js";
import { Schema, SchemaType } from "./schema.js";
import { JsonData } from "./store.js";

const CameraPropsSchema = Schema.object({
	x: Schema.number,
	y: Schema.number,
	zoom: Schema.number,
	rotation: Schema.number,
});

type CameraProps = SchemaType<typeof CameraPropsSchema>;

export class Camera {
	static copy(camera: Camera): Camera {
		return camera.with({});
	}

	static toStore(camera: Camera): JsonData {
		return {
			x: camera.x,
			y: camera.y,
			zoom: camera.zoom,
			rotation: camera.rotation,
		};
	}

	static fromStore(data: JsonData): Camera {
		return new Camera().with(CameraPropsSchema.assert(data));
	}

	x: number = 0;
	y: number = 0;
	zoom: number = 1;
	rotation: number = 0;

	get position(): Point {
		return new Point(this.x, this.y);
	}

	set position(position: Point) {
		this.x = position.x;
		this.y = position.y;
	}

	with(props: Partial<CameraProps>): Camera {
		const camera = new Camera();
		camera.x = props.x ?? this.x;
		camera.y = props.y ?? this.y;
		camera.zoom = props.zoom ?? this.zoom;
		camera.rotation = props.rotation ?? this.rotation;
		return camera;
	}
}
