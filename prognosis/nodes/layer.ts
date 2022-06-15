import { Runtime } from "../runtime.js";
import { DebugOptions, icon, Node, variable } from "./node.js";

@icon("layers-outline")
export class Layer extends Node {
	@variable(Boolean) fixed = false;

	_render(context: CanvasRenderingContext2D) {
		context.save();
		if (this.fixed) {
			const camera = Runtime.root.camera;
			context.rotate(-camera.rotation);
			context.scale(1 / camera.zoom, 1 / camera.zoom);
			context.translate(camera.x, camera.y);
		}
		context.translate(this.localX, this.localY);
		this.children
			.sort((a, b) => a.z - b.z)
			.forEach((child) => child._render(context));
		context.restore();
	}

	_debugRender(context: CanvasRenderingContext2D, debugProps: DebugOptions) {
		context.save();
		if (this.fixed) {
			const camera = Runtime.root.camera;
			context.rotate(-camera.rotation);
			context.scale(1 / camera.zoom, 1 / camera.zoom);
			context.translate(camera.x, camera.y);
		}
		context.translate(this.localX, this.localY);
		this.children
			.sort((a, b) => a.z - b.z)
			.forEach((child) => child._debugRender(context, debugProps));
		context.restore();
	}
}
