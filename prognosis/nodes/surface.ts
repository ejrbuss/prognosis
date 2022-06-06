import { Camera } from "../data/camera.js";
import { Color } from "../data/color.js";
import { Node } from "./node.js";
import { Point } from "../data/point.js";
import { Project } from "../project.js";

export class Surface extends Node {
	camera: Camera = new Camera();
	rotation: number = 0;
	scale: Point = new Point(1, 1);

	_render(context: CanvasRenderingContext2D): void {
		context.save();
		// Create clipping zone
		context.fillStyle = Color.Blue.hex;
		context.translate(this.localX, this.localY);
		context.scale(this.scale.x, this.scale.y);
		context.rotate(this.rotation);
		context.translate(-this.camera.x, -this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		context.rotate(this.camera.rotation);
		const zOrderedChildren = this.children.slice().sort((a, b) => a.z - b.z);
		zOrderedChildren.forEach((child) => child._render(context));
		context.restore();
	}

	_debugRender(context: CanvasRenderingContext2D): void {
		context.save();
		// Create clipping zone
		context.fillStyle = Color.Blue.hex;
		context.translate(this.localX, this.localY);
		context.scale(this.scale.x, this.scale.y);
		context.rotate(this.rotation);
		context.translate(-this.camera.x, -this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		context.rotate(this.camera.rotation);
		const zOrderedChildren = this.children.slice().sort((a, b) => a.z - b.z);
		zOrderedChildren.forEach((child) => child._debugRender(context));
		context.restore();
	}

	get icon(): string {
		return "image-outline";
	}
}
