import { Color } from "../color.js";
import { Component, Entity } from "../core.js";

export enum TextAlignment {
	Left = "left",
	Right = "right",
	Center = "center",
}

export class Text extends Component {
	text: string = "";
	font: string = "";
	alignment: TextAlignment = TextAlignment.Left;
	color: Color = Color.Black;

	render(_entity: Entity, context: CanvasRenderingContext2D) {
		context.font = this.font;
		context.fillStyle = this.color.hex;
		context.textAlign = this.alignment;
		context.fillText(this.text, 0, 0);
	}
}
