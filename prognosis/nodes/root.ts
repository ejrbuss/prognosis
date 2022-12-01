import { Color } from "../data/color.js";
import { Key, Keyboard } from "../keyboard.js";
import { Project } from "../project.js";
import { Runtime } from "../runtime.js";
import { icon, variable, Node, DebugOptions as DebugOptions } from "./node.js";
import { Point } from "../data/point.js";
import { Camera } from "../data/camera.js";

@icon("videocam-outline")
export class Root extends Node {
	@variable(Camera) camera: Camera = new Camera();
	debugCamera: Camera = new Camera();
	debugCameraSpeed: number = 100;
	debugGridColor: Color = Color.rgba(1, 1, 1, 0.8);
	debugShowGrid: boolean = false;

	_debugUpdate(debugProps: DebugOptions) {
		let dx = 0;
		let dy = 0;
		if (Keyboard.keyDown(Key.Up)) {
			dy -= 1;
		}
		if (Keyboard.keyDown(Key.Down)) {
			dy += 1;
		}
		if (Keyboard.keyDown(Key.Left)) {
			dx -= 1;
		}
		if (Keyboard.keyDown(Key.Right)) {
			dx += 1;
		}
		if (Keyboard.keyDown(Key.Dash)) {
			this.debugCamera.zoom *= 1 - Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Equals)) {
			this.debugCamera.zoom *= 1 + Runtime.dt;
		}
		const direction = new Point(dx, dy).normalized();
		this.debugCamera.x += direction.x * this.debugCameraSpeed * Runtime.dt;
		this.debugCamera.y += direction.y * this.debugCameraSpeed * Runtime.dt;
		super._debugUpdate(debugProps);
	}

	_render(context: CanvasRenderingContext2D): void {
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		const hw = w / 2;
		const hh = h / 2;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(hw - this.camera.x, hh - this.camera.y);
		context.scale(this.camera.zoom, this.camera.zoom);
		context.rotate(this.camera.rotation);
		context.fillStyle = Color.Magenta.hex;
		super._render(context);
		context.restore();
	}

	_debugRender(context: CanvasRenderingContext2D, debugProps: DebugOptions) {
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		const hw = w / 2;
		const hh = h / 2;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(hw - this.debugCamera.x, hh - this.debugCamera.y);
		context.scale(this.debugCamera.zoom, this.debugCamera.zoom);
		context.rotate(this.debugCamera.rotation);
		super._debugRender(context, debugProps);
		if (this.debugShowGrid) {
			const w = Project.graphics.width;
			const h = Project.graphics.height;
			const hw = w / 2;
			const hh = h / 2;
			const xMin =
				-hw / this.debugCamera.zoom +
				this.debugCamera.x / this.debugCamera.zoom;
			const xMax =
				+hw / this.debugCamera.zoom +
				this.debugCamera.x / this.debugCamera.zoom;
			const yMin =
				-hh / this.debugCamera.zoom +
				this.debugCamera.y / this.debugCamera.zoom;
			const yMax =
				+hh / this.debugCamera.zoom +
				this.debugCamera.y / this.debugCamera.zoom;
			const r = debugProps.gridSize;
			let s = r;
			// Increase grid size by power of 2 if zoomed very far
			while (s * this.debugCamera.zoom * 2 < r) {
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
			context.strokeStyle = this.debugGridColor.hex;
			context.stroke();
		}
		context.restore();
	}
}
