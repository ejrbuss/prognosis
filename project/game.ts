import { Color } from "../prognosis/data/color.js";
import { SpriteAnimation } from "../prognosis/nodes/spriteAnimation.js";
import { icon, Node, variable } from "../prognosis/nodes/node.js";
import { Random } from "../prognosis/random.js";
import { SpriteSheetResource } from "../prognosis/resources/spriteSheetResource.js";
import { Player } from "./player.js";

@icon("game-controller-outline")
export class Game extends Node {
	player?: Player;

	async start() {
		this.player = this.get(Player);
		if (this.player) {
			// Setup Player Sprite Animation
			const spriteAnimation = this.player.get(SpriteAnimation);
			if (spriteAnimation) {
				const spriteResource = await SpriteSheetResource.load(
					"/resources/demo/characters/mouse.json",
					"/resources/demo/characters/mouse.png"
				);
				spriteAnimation.spriteSheetResource = spriteResource;
				spriteAnimation.frameKey = "NE-0000.png";
				console.log(spriteAnimation);
			}
		}
	}
}
