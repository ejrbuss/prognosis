import { Color } from "../color.js";
import { Component, Entity } from "../core.js";

export class Rectangle extends Component {
	rotation: number = 0;
	width: number = 100;
	height: number = 100;
	color: Color = Color.Black;

	render(_entity: Entity, context: CanvasRenderingContext2D) {
		context.save();
		context.rotate(this.rotation);
		context.fillStyle = this.color.hex;
		const w = this.width;
		const h = this.height;
		context.fillRect(-w / 2, -h / 2, w, h);
		context.restore();
	}
}
