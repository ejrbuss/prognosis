import { Camera } from "../data/camera.js";
import { Project } from "../project.js";
import { Node } from "./node.js";

export class Root extends Node {
	camera: Camera = new Camera();

	_render(context: CanvasRenderingContext2D) {
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(w / 2 - this.camera.x, h / 2 - this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		context.rotate(this.camera.rotation);
		super._render(context);
		context.restore();
	}
}
