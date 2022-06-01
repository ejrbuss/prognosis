import { Color } from "../color.js";
import { Component, Entity } from "../core.js";

export class Rectangle extends Component {
	rotation: number = 0;
	width: number = 100;
	height: number = 100;
	color: Color = Color.Black;

	render(eneity: Entity, context: CanvasRenderingContext2D) {
		context.save();
		context.rotate(this.rotation);
		context.fillStyle = this.color.hex;
		context.fillRect(0, 0, this.width, this.height);
		context.restore();
	}
}
