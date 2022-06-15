import { Node, variable } from "../prognosis/nodes/node.js";
import { Sprite } from "../prognosis/nodes/sprite.js";
import { Point } from "../prognosis/data/point.js";
import { SpriteSheetResource } from "../prognosis/resources/spriteSheetResource.js";

export class Enemy extends Node {
	@variable(Number) speed: number = 70;

	async childrenChanged() {
		const sprite = this.get(Sprite);
		if (sprite) {
			// Load a single image (sprite)
			// const spriteResource = await SpriteResource.load(
			// 	"/resources/demo/characters/mouse.png"
			// );
			// sprite.spriteResource = spriteResource;

			// Load a sprite sheet
			const spriteSheetResource = await SpriteSheetResource.load(
				"/resources/demo/characters/mouse.json",
				"/resources/demo/characters/mouse.png"
			);
			sprite.spriteResource =
				spriteSheetResource.frames["SW-0000.png"]?.spriteResource;

			sprite.scale = new Point(0.5, 0.5);
		}
	}
}
