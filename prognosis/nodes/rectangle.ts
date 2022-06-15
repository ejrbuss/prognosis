import { Color } from "../data/color.js";
import { icon, Node, variable } from "./node.js";

@icon("square-outline")
export class Rectangle extends Node {
	@variable(Number) rotation: number = 0;
	@variable(Number) width: number = 100;
	@variable(Number) height: number = 100;
	@variable(Color) fillColor: Color = Color.Black;
	@variable(Boolean) fill: Boolean = true;
	@variable(Color) strokeColor: Color = Color.Black;
	@variable(Number) strokeWidth: number = 1;
	@variable(Boolean) stroke: Boolean = false;

	render(context: CanvasRenderingContext2D) {
		context.save();
		context.rotate(this.rotation);
		const w = this.width;
		const h = this.height;
		if (this.fill) {
			context.fillStyle = this.fillColor.hex;
			context.fillRect(-w / 2, -h / 2, w, h);
		}
		if (this.stroke) {
			context.strokeStyle = this.strokeColor.hex;
			context.lineWidth = this.strokeWidth;
			context.strokeRect(-w / 2, -h / 2, w, h);
		}
		context.restore();
	}
}
