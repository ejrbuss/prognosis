import { Runtime } from "../runtime.js";
import { icon, Node, variable } from "./node.js";

@icon("layers-outline")
export class Layer extends Node {
	@variable(Boolean) fixed = false;

	_render(context: CanvasRenderingContext2D) {
		const render = this.children.sort((a, b) => a.z - b.z);
		context.save();
		if (this.fixed) {
			const camera = Runtime.root.camera;
			context.rotate(-camera.rotation);
			context.scale(-camera.zoom, -camera.zoom);
			context.translate(-camera.x, -camera.y);
		}
		context.translate(this.localX, this.localY);
		render.forEach((child) => child._render(context));
		context.restore();
	}

	_debugRender(context: CanvasRenderingContext2D) {
		const render = this.children.sort((a, b) => a.z - b.z);
		context.save();
		if (this.fixed) {
			const camera = Runtime.root.camera;
			context.rotate(-camera.rotation);
			context.scale(-camera.zoom, -camera.zoom);
			context.translate(-camera.x, -camera.y);
		}
		context.translate(this.localX, this.localY);
		render.forEach((child) => child._debugRender(context));
		context.restore();
	}
}
