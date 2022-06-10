import { Color } from "../data/color.js";
import { Inspector, propertiesOf } from "../inspector.js";
import { Node } from "./node.js";

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

export class Text extends Node {
	text: string = "Text";
	fontFamily: string = "sans-serif";
	fontSize: number = 12;
	fontStyle: FontStyle = FontStyle.Normal;
	fontWeight: FontWeight = FontWeight.Normal;
	alignment: TextAlignment = TextAlignment.Left;
	color: Color = Color.Black;

	render(context: CanvasRenderingContext2D) {
		context.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;
		context.fillStyle = this.color.hex;
		context.textAlign = this.alignment;
		context.fillText(this.text, 0, 0);
	}

	inspect(inspector: Inspector) {
		const properties = propertiesOf(this);
		inspector.inspectString(properties.text);
		inspector.inspectString(properties.fontFamily);
		inspector.inspectNumber(properties.fontSize);
		inspector.inspectEnum(properties.fontStyle, FontStyle);
		inspector.inspectEnum(properties.fontWeight, FontWeight);
		inspector.inspectEnum(properties.alignment, TextAlignment);
		inspector.inspectColor(properties.color);
	}

	get icon(): string {
		return "text-outline";
	}
}
