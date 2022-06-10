import { Color } from "../data/color.js";
import { Inspector, propertiesOf } from "../inspector.js";
import { Node } from "./node.js";

export class Rectangle extends Node {
	rotation: number = 0;
	width: number = 100;
	height: number = 100;
	color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		context.save();
		context.rotate(this.rotation);
		context.fillStyle = this.color.hex;
		const w = this.width;
		const h = this.height;
		context.fillRect(-w / 2, -h / 2, w, h);
		context.restore();
	}

	inspect(inspector: Inspector) {
		const properties = propertiesOf(this);
		inspector.inspectNumber(properties.rotation);
		inspector.inspectNumber(properties.width);
		inspector.inspectNumber(properties.height);
		inspector.inspectColor(properties.color);
	}

	get icon(): string {
		return "square-outline";
	}
}
