import { icon, Node, variable } from "./node.js";
import { Color } from "../data/color.js";

@icon("grid-outline")
export class Grid extends Node {
	@variable(Number) size: number = 16;
	@variable(Number) rotation: number = 0;
	@variable(Number) width: number = 100;
	@variable(Number) height: number = 100;
	@variable(Color) color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		const w = this.width;
		const h = this.height;
		const s = this.size;
		const hw = w / 2;
		const hh = h / 2;
		context.beginPath();
		for (let x = 0; x <= hw; x += s) {
			context.moveTo(x, -hh);
			context.lineTo(x, +hh);
		}
		for (let x = -s; x >= -hw; x -= s) {
			context.moveTo(x, -hh);
			context.lineTo(x, +hh);
		}
		for (let y = 0; y <= hh; y += s) {
			context.moveTo(-hw, y);
			context.lineTo(+hw, y);
		}
		for (let y = -s; y >= -hh; y -= s) {
			context.moveTo(-hw, y);
			context.lineTo(+hw, y);
		}
		context.closePath();
		context.strokeStyle = this.color.hex;
		context.stroke();
	}
}
