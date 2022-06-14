import { Color } from "../data/color.js";
import { icon, Node, variable } from "./node.js";

@icon("square-outline")
export class Rectangle extends Node {
	@variable(Number) rotation: number = 0;
	@variable(Number) width: number = 100;
	@variable(Number) height: number = 100;
	@variable(Color) color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		context.save();
		context.rotate(this.rotation);
		context.fillStyle = this.color.hex;
		const w = this.width;
		const h = this.height;
		context.fillRect(-w / 2, -h / 2, w, h);
		context.restore();
	}
}
