import { Camera } from "../data/camera.js";
import { Color } from "../data/color.js";
import { Key, Keyboard } from "../keyboard.js";
import { Node } from "../nodes/node.js";
import { Project } from "../project.js";
import { Runtime } from "../runtime.js";

export class EditorRoot extends Node {
	camera: Camera = new Camera();
	cameraSpeed: number = 100;
	gridColor: Color = Color.rgba(1, 1, 1, 0.8);
	gridSize: number = 100;
	showGrid: boolean = false;

	_update() {
		if (Keyboard.keyDown(Key.Up)) {
			this.camera.y -= Runtime.dt * this.cameraSpeed;
		}
		if (Keyboard.keyDown(Key.Down)) {
			this.camera.y += Runtime.dt * this.cameraSpeed;
		}
		if (Keyboard.keyDown(Key.Left)) {
			this.camera.x -= Runtime.dt * this.cameraSpeed;
		}
		if (Keyboard.keyDown(Key.Right)) {
			this.camera.x += Runtime.dt * this.cameraSpeed;
		}
		if (Keyboard.keyDown(Key.Dash)) {
			this.camera.zoom *= 1 - Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Equals)) {
			this.camera.zoom *= 1 + Runtime.dt;
		}
		this._debugUpdate();
	}

	_render(context: CanvasRenderingContext2D): void {
		context.save();
		context.translate(-this.camera.x, -this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		const zOrderedChildren = this.children.slice().sort((a, b) => a.z - b.z);
		zOrderedChildren.forEach((child) => child._debugRender(context));
		if (this.showGrid) {
		}
		context.restore();
	}
}

// TODO children of surfaces x,y location should correspond to camera x, camera y
