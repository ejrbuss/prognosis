import { SpriteSheetResource } from "../resources/spriteSheetResource.js";
import { icon, Node } from "./node.js";
import { Sprite } from "./sprite.js";

@icon("videocam-outline")
export class SpriteAnimation extends Node {
	spriteComponent?: Sprite;
	spriteSheetResource?: SpriteSheetResource;
	frameKey?: string;
	priority: number = -50;

	childrenChanged() {
		this.spriteComponent = this.get(Sprite);
	}

	update() {
		if (
			this.spriteComponent !== undefined &&
			this.spriteSheetResource !== undefined &&
			this.frameKey !== undefined
		) {
			this.spriteComponent.spriteResource =
				this.spriteSheetResource.frames[this.frameKey]?.spriteResource;
		}
	}

	debugUpdate() {
		if (
			this.spriteComponent !== undefined &&
			this.spriteSheetResource !== undefined &&
			this.frameKey !== undefined
		) {
			this.spriteComponent.spriteResource =
				this.spriteSheetResource.frames[this.frameKey]?.spriteResource;
		}
	}
}
