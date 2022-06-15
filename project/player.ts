import { Key, Keyboard } from "../prognosis/keyboard.js";
import { Sprite } from "../prognosis/nodes/sprite.js";
import { Node, variable } from "../prognosis/nodes/node.js";
import { Runtime } from "../prognosis/runtime.js";
import { SpriteSheetResource } from "../prognosis/resources/spriteSheetResource.js";
import { Point } from "../prognosis/data/point.js";
import { cursorTo } from "readline";

enum direction {
	NW = 0,
	NE,
	SE,
	SW,
}

enum dirState {
	left = 0,
	right,
	up,
	down,
	NW,
	NE,
	SE,
	SW,
}

export class Player extends Node {
	sprite?: Sprite;
	spriteSheetResource?: SpriteSheetResource;
	dirState: dirState = dirState.left;
	@variable(Number) direction: direction = direction.NE;
	@variable(Number) speed: number = 100;
	@variable(Number) cameraFollowSpeed: number = 5;

	update() {
		this.updatePositionAndDirection();
		this.updateSpriteFrame();
		// this.updateCamera();
	}

	async childrenChanged() {
		this.sprite = this.get(Sprite);
		if (this.sprite) {
			// Load a sprite sheet
			this.spriteSheetResource = await SpriteSheetResource.load(
				"/resources/demo/characters/mouse.json",
				"/resources/demo/characters/mouse.png"
			);
			this.sprite.spriteResource =
				this.spriteSheetResource.frames["NE-0000.png"]?.spriteResource;
		}
	}

	/*** PRIVATE FUNCTIONS ***/

	private updatePositionAndDirection() {
		let dx = this.x;
		let dy = this.y;

		let keyLeft = Keyboard.keyDown(Key.Left);
		let keyRight = Keyboard.keyDown(Key.Right);
		let keyUp = Keyboard.keyDown(Key.Up);
		let keyDown = Keyboard.keyDown(Key.Down);

		// Update Node Position
		if (keyLeft) {
			this.x -= this.speed * Runtime.dt;
		}
		if (keyRight) {
			this.x += this.speed * Runtime.dt;
		}
		if (keyUp) {
			this.y -= this.speed * Runtime.dt;
		}
		if (keyDown) {
			this.y += this.speed * Runtime.dt;
		}

		dx = this.x - dx;
		dy = this.y - dy;

		// Update Player Direction
		let dir = new Point(dx, dy);
		let angle = dir.angle;
		let newState;

		if (dx != 0 || dy != 0) {
			if (angle == 0) {
				newState = dirState.right;
			} else if (angle == Math.PI) {
				newState = dirState.left;
			} else if (angle == Math.PI / 2) {
				newState = dirState.down;
			} else if (angle == -(Math.PI / 2)) {
				newState = dirState.up;
			} else if (angle >= 0 && angle < Math.PI / 2) {
				newState = dirState.SE;
			} else if (angle >= Math.PI / 2 && angle < Math.PI) {
				newState = dirState.SW;
			} else if (angle <= 0 && angle > -(Math.PI / 2)) {
				newState = dirState.NE;
			} else {
				//if (angle <= -(Math.PI / 2) && angle > -(Math.PI))
				newState = dirState.NW;
			}

			this.updateDirectionFromState(newState);
		}
	}

	private updateDirectionFromState(newState: dirState) {
		switch (this.direction) {
			case direction.NW:
				switch (newState) {
					case dirState.right:
					case dirState.NE:
						this.direction = direction.NE;
						break;
					case dirState.down:
					case dirState.SW:
						this.direction = direction.SW;
						break;
					case dirState.SE:
						this.direction = direction.SE;
						break;
					case dirState.left:
					case dirState.up:
					case dirState.NW:
					default:
						// do nothing
						break;
				}
				break;

			case direction.NE:
				switch (newState) {
					case dirState.left:
					case dirState.NW:
						this.direction = direction.NW;
						break;
					case dirState.down:
					case dirState.SE:
						this.direction = direction.SE;
						break;
					case dirState.SW:
						this.direction = direction.SW;
						break;
					case dirState.up:
					case dirState.right:
					case dirState.NE:
					default:
						// do nothing
						break;
				}
				break;

			case direction.SE:
				switch (newState) {
					case dirState.left:
					case dirState.SW:
						this.direction = direction.SW;
						break;
					case dirState.NW:
						this.direction = direction.NW;
						break;
					case dirState.up:
					case dirState.NE:
						this.direction = direction.NE;
						break;
					case dirState.down:
					case dirState.right:
					case dirState.SE:
					default:
						// do nothing
						break;
				}
				break;

			case direction.SW:
				switch (newState) {
					case dirState.right:
					case dirState.SE:
						this.direction = direction.SE;
						break;
					case dirState.up:
					case dirState.NW:
						this.direction = direction.NW;
						break;
					case dirState.NE:
						this.direction = direction.NE;
						break;
					case dirState.down:
					case dirState.left:
					case dirState.SW:
					default:
						// do nothing
						break;
				}
				break;
		}
	}

	private updateSpriteFrame() {
		if (this.sprite && this.spriteSheetResource) {
			// Depending on direction the player is moving, update the sprite
			switch (this.direction) {
				case direction.NW:
					this.sprite.spriteResource =
						this.spriteSheetResource.frames["NW-0000.png"]?.spriteResource;
					break;
				case direction.NE:
					this.sprite.spriteResource =
						this.spriteSheetResource.frames["NE-0000.png"]?.spriteResource;
					break;
				case direction.SE:
					this.sprite.spriteResource =
						this.spriteSheetResource.frames["SE-0000.png"]?.spriteResource;
					break;
				case direction.SW:
					this.sprite.spriteResource =
						this.spriteSheetResource.frames["SW-0000.png"]?.spriteResource;
					break;
				default:
					// No change
					break;
			}
		}
	}

	private updateCamera() {
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
	}
}
