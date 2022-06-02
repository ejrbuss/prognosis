import { Camera } from "../camera.js";
import { Component, Entity, Space } from "../core.js";
import { Point } from "../point.js";
import { Project } from "../project.js";

export class Surface extends Component {
	camera: Camera = new Camera();
	rotation: number = 0;
	scale: Point = new Point(1, 1);

	renderChildren(entity: Entity, context: CanvasRenderingContext2D) {
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		const hw = w / 2;
		const hh = h / 2;
		const sxy = this.camera.zoom;
		const tx = hw - this.camera.x;
		const ty = hh - this.camera.y;
		const r = this.camera.rotation;
		context.save();
		context.rotate(this.rotation);
		context.scale(this.scale.x, this.scale.y);
		context.rect(0, 0, w, h);
		context.clip();
		for (const child of entity.children) {
			if (child.space === Space.World) {
				context.save();
				context.translate(tx, ty);
				context.rotate(r);
				context.scale(sxy, sxy);
				child.render(context);
				context.restore();
			} else {
				child.render(context);
			}
		}
		context.restore();
	}
}
