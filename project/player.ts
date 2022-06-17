import { Key, Keyboard } from "../prognosis/keyboard.js";
import { Sprite } from "../prognosis/nodes/sprite.js";
import { Node, variable } from "../prognosis/nodes/node.js";
import { Runtime } from "../prognosis/runtime.js";
import { SpriteSheetResource } from "../prognosis/resources/spriteSheetResource.js";
import { Point } from "../prognosis/data/point.js";

enum direction {
	NW = 0,
	NE,
	SE,
	SW,
}

export class Player extends Node {
	sprite?: Sprite;
	spriteSheetResource?: SpriteSheetResource;
	@variable(Number) spriteDirection: direction = direction.NE;
	@variable(Number) speed: number = 100;
	@variable(Number) cameraFollowSpeed: number = 5;

	async childrenChanged() {
		this.sprite = this.get(Sprite);
		if (this.sprite) {
			this.spriteSheetResource = await SpriteSheetResource.load(
				"/resources/demo/characters/mouse.json",
				"/resources/demo/characters/mouse.png"
			);
			this.sprite.spriteResource = Object.values(
				this.spriteSheetResource.frames
			)[0]?.spriteResource;
		}
	}

	update() {
		this.updatePositionAndDirection();
		this.updateSpriteFrame();
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

		// Update Player Direction
		dx = this.x - dx;
		dy = this.y - dy;

		if (dx != 0 || dy != 0) {
			this.updateSpriteDirectionFromMove(new Point(dx, dy));
		}
	}

	private updateSpriteDirectionFromMove(move: Point) {
		if (move.isDirSouthEast()) {
			this.spriteDirection = direction.SE;
		} else if (move.isDirSouthWest()) {
			this.spriteDirection = direction.SW;
		} else if (move.isDirNorthEast()) {
			this.spriteDirection = direction.NE;
		} else if (move.isDirNorthWest()) {
			this.spriteDirection = direction.NW;
		} else if (move.isDirEast()) {
			if (this.spriteDirection == direction.SW) {
				this.spriteDirection = direction.SE;
			} else if (this.spriteDirection == direction.NW) {
				this.spriteDirection = direction.NE;
			} // else do nothing
		} else if (move.isDirWest()) {
			if (this.spriteDirection == direction.SE) {
				this.spriteDirection = direction.SW;
			} else if (this.spriteDirection == direction.NE) {
				this.spriteDirection = direction.NW;
			} // else do nothing
		} else if (move.isDirSouth()) {
			if (this.spriteDirection == direction.NW) {
				this.spriteDirection = direction.SW;
			} else if (this.spriteDirection == direction.NE) {
				this.spriteDirection = direction.SE;
			} // else do nothing
		} else {
			// if (move.isDirNorth())
			if (this.spriteDirection == direction.SW) {
				this.spriteDirection = direction.NW;
			} else if (this.spriteDirection == direction.SE) {
				this.spriteDirection = direction.NE;
			} // else do nothing
		}
	}

	private updateSpriteFrame() {
		if (this.sprite && this.spriteSheetResource) {
			// Depending on direction the player is moving, update the sprite
			switch (this.spriteDirection) {
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
