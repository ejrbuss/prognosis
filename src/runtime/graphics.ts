import type { Scene } from "./scene.js";
import type { Dimension } from "./dimension.js";
import type { Font } from "./font.js";
import { Transform } from "../components/transform.js";
import { Color } from "./color.js";
import { Vector } from "./vector.js";

export class Graphics {
	currentTransform!: Transform;
	transformStack!: Transform[];

	render(scene: Scene) {}

	getCurrentTransform(): Transform {
		return undefined as any;
	}

	pushTransform(transform: Transform) {}

	popTransform(): Transform {
		return undefined as any;
	}

	drawLines(points: Vector[], color: Color) {}

	drawTriangle(p1: Vector, p2: Vector, p3: Vector, color: Color) {}

	drawRectangle(position: Vector, dimensions: Dimension, color: Color) {}

	drawTexture(
		position: Vector,
		dimensions: Dimension,
		texture: any,
		tint: Color = Color.White
	) {}

	drawText(position: Vector, text: string, font: Font) {}
}
