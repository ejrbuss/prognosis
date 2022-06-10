import { Color } from "../data/color.js";
import { Inspector, propertiesOf } from "../inspector.js";
import { Node } from "./node.js";

export class Grid extends Node {
	size: number = 16;
	rotation: number = 0;
	width: number = 100;
	height: number = 100;
	color: Color = Color.Black;

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

	inspect(inspector: Inspector) {
		const properties = propertiesOf(this);
		inspector.inspectNumber(properties.size);
		inspector.inspectNumber(properties.rotation);
		inspector.inspectNumber(properties.width);
		inspector.inspectNumber(properties.height);
		inspector.inspectColor(properties.color);
	}

	get icon(): string {
		return "grid-outline";
	}
}
