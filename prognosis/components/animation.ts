import { SpriteSheetAsset } from "../assets.js";
import { Component, Entity } from "../core.js";
import { Sprite } from "./sprite.js";

export class Animation extends Component {
	dependencies = [Sprite];
	spriteComponent?: Sprite;
	spriteSheetAsset?: SpriteSheetAsset;
	frameKey?: string;

	start(entity: Entity) {
		this.spriteComponent = entity.getComponent(Sprite);
	}

	// TODO this probably needs to be in lateUpdate or similar
	update(_entity: Entity) {
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
