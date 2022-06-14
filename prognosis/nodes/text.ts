import { Enum, icon, Node, variable } from "./node.js";
import { Color } from "../data/color.js";

export enum FontStyle {
	Normal = "normal",
	Italic = "italic",
	Oblique = "oblique",
}

export enum FontWeight {
	Normal = "normal",
	Bold = "bold",
	Bolder = "bolder",
	Lighter = "lighter",
}

export enum TextAlignment {
	Left = "left",
	Right = "right",
	Center = "center",
}

@icon("text-outline")
export class Text extends Node {
	@variable(String) text: string = "Text";
	@variable(String) fontFamily: string = "sans-serif";
	@variable(Number) fontSize: number = 12;
	@variable(Enum(FontStyle)) fontStyle: FontStyle = FontStyle.Normal;
	@variable(Enum(FontWeight)) fontWeight: FontWeight = FontWeight.Normal;
	@variable(Enum(TextAlignment)) alignment: TextAlignment = TextAlignment.Left;
	@variable(Color) color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		context.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
		context.fillStyle = this.color.hex;
		context.textAlign = this.alignment;
		context.fillText(this.text, 0, 0);
	}
}
