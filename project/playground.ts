import { Assets } from "../prognosis/assets.js";
import { Color } from "../prognosis/color.js";
import { Animation } from "../prognosis/components/animation.js";
import { Rectangle } from "../prognosis/components/rectangle.js";
import { Sprite } from "../prognosis/components/sprite.js";
import { Text } from "../prognosis/components/text.js";
import { Component, Entity, Space } from "../prognosis/core.js";
import { Key, Keyboard } from "../prognosis/keyboard.js";
import { Point } from "../prognosis/point.js";
import { Project } from "../prognosis/project.js";
import { Random } from "../prognosis/random.js";
import { Runtime } from "../prognosis/runtime.js";

const playerSpriteSheetAsset = Assets.loadSpriteSheet(
	"assets/demo/characters/player.json",
	"assets/demo/characters/player.png"
);

const Width = Project.config.gameCanvas.width;
const Height = Project.config.gameCanvas.height;

const background = new Entity("background");
const backgroundRectangle = new Rectangle();
backgroundRectangle.color = Random.color();
backgroundRectangle.width = Width;
backgroundRectangle.height = Height;
background.add(backgroundRectangle);
background.space = Space.Screen;
background.z = -100;
Runtime.scene.spawn(background);

class FpsCounter extends Component {
	textComponent?: Text;

	start(entity: Entity) {
		this.textComponent = entity.get(Text);
	}

	update() {
		if (this.textComponent) {
			this.textComponent.text = "FPS: " + (1 / Runtime.dt).toFixed(0);
		}
	}
}

const fpsCounter = new Entity("fps");
fpsCounter.space = Space.Screen;
fpsCounter.position = new Point(32, 32);
fpsCounter.z = 100;
fpsCounter.add(new FpsCounter());
const fpsCounterText = new Text();
fpsCounterText.color = Color.Yellow;
fpsCounterText.font = "16px monospace";
fpsCounter.add(fpsCounterText);
Runtime.scene.spawn(fpsCounter);

class PlayerController extends Component {
	speed = 200;
	update(entity: Entity) {
		let direction = Point.Origin;
		if (Keyboard.keyDown(Key.W)) {
			direction = direction.add(Point.Down);
		}
		if (Keyboard.keyDown(Key.A)) {
			direction = direction.add(Point.Left);
		}
		if (Keyboard.keyDown(Key.S)) {
			direction = direction.add(Point.Up);
		}
		if (Keyboard.keyDown(Key.D)) {
			direction = direction.add(Point.Right);
		}
		if (Keyboard.keyDown(Key.Up)) {
			Runtime.scene.camera.y -= 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Down)) {
			Runtime.scene.camera.y += 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Left)) {
			Runtime.scene.camera.x -= 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Right)) {
			Runtime.scene.camera.x += 100 * Runtime.dt;
		}
		if (Keyboard.keyPressed(Key.Equals)) {
			entity.z += 1;
		}
		if (Keyboard.keyPressed(Key.Dash)) {
			entity.z -= 1;
		}
		const magnitude = direction.magnitude;
		if (magnitude > 0) {
			entity.x += (direction.x * this.speed * Runtime.dt) / magnitude;
			entity.y += (direction.y * this.speed * Runtime.dt) / magnitude;
		}
	}
}

const player = new Entity("player");
player.add(new PlayerController());
const playerAnimation = new Animation();
playerSpriteSheetAsset.then(
	(asset) => (playerAnimation.spriteSheetAsset = asset)
);
playerAnimation.frameKey = "player 0.png";
player.add(playerAnimation);
const playerSprite = new Sprite();
playerSprite.scale = playerSprite.scale.mul(4);
playerSprite.debug = true;
player.add(playerSprite);
Runtime.scene.spawn(player);

class DummyBouncer extends Component {
	speed: number = Random.integer(50, 500);
	direction: Point = Random.point();

	update(entity: Entity) {
		entity.x += this.direction.x * this.speed * Runtime.dt;
		entity.y += this.direction.y * this.speed * Runtime.dt;
		if (entity.x > Width / 2) {
			entity.x -= Width;
		}
		if (entity.x < -Width / 2) {
			entity.x += Width;
		}
		if (entity.y > Height / 2) {
			entity.y -= Height;
		}
		if (entity.y < -Height / 2) {
			entity.y += Height;
		}
	}
}

const DummyCount = 50;
for (let i = 0; i < DummyCount; i++) {
	const dummy = new Entity("dummy" + i);
	dummy.x = Random.integer(-Width / 2, Width / 2);
	dummy.y = Random.integer(-Height / 2, Height / 2);
	dummy.z = Random.integer(0, 3);
	const dummyAnimation = new Animation();
	playerSpriteSheetAsset.then(
		(asset) => (dummyAnimation.spriteSheetAsset = asset)
	);
	dummyAnimation.frameKey = "player 0.png";
	dummy.add(dummyAnimation);
	dummy.add(new DummyBouncer());
	const dummySprite = new Sprite();
	dummySprite.scale = dummySprite.scale.mul(Random.integer(1, 6));
	dummy.add(dummySprite);
	Runtime.scene.spawn(dummy);
}

(window as any).Runtime = Runtime;
