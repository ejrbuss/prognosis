import { Key, Keyboard } from "../prognosis/keyboard.js";
import { SpriteAnimation } from "../prognosis/nodes/spriteAnimation.js";
import { Node, variable } from "../prognosis/nodes/node.js";
import { Runtime } from "../prognosis/runtime.js";
import { Sprite } from "../prognosis/nodes/sprite.js";
import { SpriteSheetResource } from "../prognosis/resources/spriteSheetResource.js";

export class Player extends Node {
	sprite?: Sprite;
	@variable(Number) speed: number = 100;
	@variable(Number) cameraFollowSpeed: number = 5;

	async childrenChange() {
		this.sprite = this.get(Sprite);
		if (this.sprite) {
			const spriteSheetResource = await SpriteSheetResource.load(
				"/resources/demo/characters/mouse.json",
				"/resources/demo/characters/mouse.png"
			);
			this.sprite.spriteResource = Object.values(
				spriteSheetResource.frames
			)[0]?.spriteResource;
		}
	}

	update() {
		Runtime.root.camera.x = Math.lerp(
			Runtime.root.camera.x,
			this.x,
			this.cameraFollowSpeed * Runtime.dt
		);
		Runtime.root.camera.y = Math.lerp(
			Runtime.root.camera.y,
			this.y,
			this.cameraFollowSpeed * Runtime.dt
		);
		if (Keyboard.keyDown(Key.Left)) {
			this.x -= this.speed * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Right)) {
			this.x += this.speed * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Up)) {
			this.y -= this.speed * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Down)) {
			this.y += this.speed * Runtime.dt;
		}
	}
}
