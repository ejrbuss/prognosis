import { Color } from "../data/color.js";
import { Key, Keyboard } from "../keyboard.js";
import { Root } from "./root.js";
import { Project } from "../project.js";
import { Runtime } from "../runtime.js";

export class DebugRoot extends Root {
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
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(w / 2 - this.camera.x, h / 2 - this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		context.rotate(this.camera.rotation);
		const zOrderedChildren = this.children.slice().sort((a, b) => a.z - b.z);
		zOrderedChildren.forEach((child) => child._debugRender(context));
		if (this.showGrid) {
			const w = Project.graphics.width;
			const h = Project.graphics.height;
			const hw = w / 2;
			const hh = h / 2;
			const xMin = -hw / this.camera.zoom + this.camera.x / this.camera.zoom;
			const xMax = +hw / this.camera.zoom + this.camera.x / this.camera.zoom;
			const yMin = -hh / this.camera.zoom + this.camera.y / this.camera.zoom;
			const yMax = +hh / this.camera.zoom + this.camera.y / this.camera.zoom;
			const r = this.gridSize;
			let s = r;
			// Increase grid size by power of 2 if zoomed very far
			while (s * this.camera.zoom * 2 < r) {
				s *= 2;
			}
			context.beginPath();
			for (let x = 0; x <= xMax; x += s) {
				if (x >= xMin) {
					context.moveTo(x, yMin);
					context.lineTo(x, yMax);
				}
			}
			for (let x = -s; x >= xMin; x -= s) {
				if (x <= xMax) {
					context.moveTo(x, yMin);
					context.lineTo(x, yMax);
				}
			}
			for (let y = 0; y <= yMax; y += s) {
				if (y >= yMin) {
					context.moveTo(xMin, y);
					context.lineTo(xMax, y);
				}
			}
			for (let y = -s; y >= yMin; y -= s) {
				if (y <= yMax) {
					context.moveTo(xMin, y);
					context.lineTo(xMax, y);
				}
			}
			context.closePath();
			context.strokeStyle = this.gridColor.hex;
			context.stroke();
		}
		context.restore();
	}
}
