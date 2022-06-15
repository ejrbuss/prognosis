import { icon, Node, variable } from "./node.js";
import { Point } from "../data/point.js";
import { SpriteResource } from "../resources/spriteResource.js";

@icon("color-palette-outline")
export class Sprite extends Node {
	@variable(Point) origin: Point = Point.Origin;
	@variable(Point) scale: Point = new Point(1, 1);
	@variable(Number) rotation: number = 0;
	@variable(SpriteResource) spriteResource?: SpriteResource; // TODO @variable(SpriteResource)

	get width(): number {
		const bitmap = this.spriteResource?.bitmap;
		return bitmap === undefined ? 0 : bitmap.width * this.scale.x;
	}

	get height(): number {
		const bitmap = this.spriteResource?.bitmap;
		return bitmap === undefined ? 0 : bitmap.height * this.scale.y;
	}

	set width(width: number) {
		const bitmap = this.spriteResource?.bitmap;
		if (bitmap !== undefined) {
			this.scale = this.scale.with({ x: width / bitmap.width });
		}
	}

	set height(height: number) {
		const bitmap = this.spriteResource?.bitmap;
		if (bitmap !== undefined) {
			this.scale = this.scale.with({ y: height / bitmap.height });
		}
	}

	render(context: CanvasRenderingContext2D) {
		const bitmap = this.spriteResource?.bitmap;
		if (bitmap !== undefined) {
			context.save();
			context.rotate(this.rotation);
			context.scale(this.scale.x, this.scale.y);
			const hw = bitmap.width / 2;
			const hh = bitmap.height / 2;
			const x = hw * this.origin.x - hw;
			const y = hh * this.origin.y - hh;
			context.drawImage(bitmap, x, y);
			// if (this.debug) {
			// 	context.strokeStyle = Color.Green.hex;
			// 	context.strokeRect(x, y, bitmap.width, bitmap.height);
			// 	context.fillStyle = Color.Red.hex;
			// 	context.fillRect(0, 0, 3, 3);
			// }
			context.restore();
		}
	}
}
