import { SpriteSheetAsset } from "../assets.js";
import { Node } from "../node.js";
import { Sprite } from "./sprite.js";

export class Animation extends Node {
	spriteComponent?: Sprite;
	spriteSheetAsset?: SpriteSheetAsset;
	frameKey?: string;

	childrenChanged() {
		this.spriteComponent = this.get(Sprite);
	}

	// TODO this probably needs to be in lateUpdate or similar
	update() {
		if (
			this.spriteComponent !== undefined &&
			this.spriteSheetAsset !== undefined &&
			this.frameKey !== undefined
		) {
			this.spriteComponent.spriteAsset =
				this.spriteSheetAsset.frames[this.frameKey];
		}
	}
}
