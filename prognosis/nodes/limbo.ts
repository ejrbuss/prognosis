import { Node } from "./node.js";

export class Limbo extends Node {
	_update(): void {}
	_render(context: CanvasRenderingContext2D): void {}
	_debugRender(context: CanvasRenderingContext2D): void {}

	get icon(): string {
		return "moon-outline";
	}
}
