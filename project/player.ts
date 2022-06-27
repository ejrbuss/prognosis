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

type InputState = {
	moveLeft: boolean;
	moveRight: boolean;
	moveUp: boolean;
	moveDown: boolean;
	attack: boolean;
};

export class Player extends Node {
	sprite?: Sprite;
	spriteSheetResource?: SpriteSheetResource;
	inputState: InputState = {
		moveLeft: false,
		moveRight: false,
		moveUp: false,
		moveDown: false,
		attack: false,
	};
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
		this.getUserInput();
		this.updatePositionAndDirection();
		this.updateSpriteFrame();
	}

	/*** PRIVATE FUNCTIONS ***/

	private getUserInput() {
		this.inputState.moveLeft = Keyboard.keyDown(Key.Left);
		this.inputState.moveRight = Keyboard.keyDown(Key.Right);
		this.inputState.moveUp = Keyboard.keyDown(Key.Up);
		this.inputState.moveDown = Keyboard.keyDown(Key.Down);
		this.inputState.attack = Keyboard.keyPressed(Key.Space);
	}

	private updatePositionAndDirection() {
		let dx = this.x;
		let dy = this.y;

		// Update Node Position
		if (this.inputState.moveLeft) {
			this.x -= this.speed * Runtime.dt;
		}
		if (this.inputState.moveRight) {
			this.x += this.speed * Runtime.dt;
		}
		if (this.inputState.moveUp) {
			this.y -= this.speed * Runtime.dt;
		}
		if (this.inputState.moveDown) {
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
					this.sprite.spriteResource = this.inputState.attack
						? this.spriteSheetResource.frames["NW-0007.png"]?.spriteResource
						: this.spriteSheetResource.frames["NW-0000.png"]?.spriteResource;
					break;
				case direction.NE:
					this.sprite.spriteResource = this.inputState.attack
						? this.spriteSheetResource.frames["NE-0007.png"]?.spriteResource
						: this.spriteSheetResource.frames["NE-0000.png"]?.spriteResource;
					break;
				case direction.SE:
					this.sprite.spriteResource = this.inputState.attack
						? this.spriteSheetResource.frames["SE-0007.png"]?.spriteResource
						: this.spriteSheetResource.frames["SE-0000.png"]?.spriteResource;
					break;
				case direction.SW:
					this.sprite.spriteResource = this.inputState.attack
						? this.spriteSheetResource.frames["SW-0007.png"]?.spriteResource
						: this.spriteSheetResource.frames["SW-0000.png"]?.spriteResource;
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
