import { Color } from "../color.js";
import { Node } from "../node.js";

export enum TextAlignment {
	Left = "left",
	Right = "right",
	Center = "center",
}

export class Text extends Node {
	text: string = "";
	font: string = "";
	alignment: TextAlignment = TextAlignment.Left;
	color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		context.font = this.font;
		context.fillStyle = this.color.hex;
		context.textAlign = this.alignment;
		context.fillText(this.text, 0, 0);
	}
}
