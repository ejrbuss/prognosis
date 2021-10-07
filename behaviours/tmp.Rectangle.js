import { Color } from "vscode";
import {
	Color,
	Texture,
	Behaviour,
	Point,
	Rectangle,
	Event,
	Render,
} from "../Prognosis.js";

Behaviour.define({
	name: "Rectangle",
	properties: {
		visible: Boolean,
		depth: Number,
		position: Point,
		origin: Point,
		bounds: Rectangle,
		color: Color,
		/*
		alpha: Number,
		rotation: Number,
		horizontalFlip: Boolean,
		verticalFlip: Boolean,
		effect: Effect,
		*/
	},
	on: {
		[Event.Render](_event, _properties, entity) {
			if (!entity.visible) {
				return;
			}
			const { u, v } = Texture.fill(entity.color);
			const { width, height } = entity.bounds;
			const x = entity.position.x - (width * entity.origin.x);
			const y = entity.position.y - (height * entity.origin.y);
			const z = entity.depth;
			Render.pushTriangles(
				new Float32Array([
					x, y, z,
					x + width, y, z,
					x + width, y +  height, z,
					x + width, y +  height, z,
					x, y + height, z,
					x, y, z,
				]),
				new Float32Array([
					u, v,
					u, v,
					u, v,
					u, v,
					u, v,
					u, v,
				])
			);
		},
	},
});