import { Key, Keyboard } from "../prognosis/keyboard.js";
import { SpriteAnimation } from "../prognosis/nodes/animation.js";
import { Node, variable } from "../prognosis/nodes/node.js";
import { Runtime } from "../prognosis/runtime.js";

export class Player extends Node {
	spriteAnimation?: SpriteAnimation;
	@variable(Number) speed: number = 100;
	@variable(Number) cameraFollowSpeed: number = 5;

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
