import { Assets } from "../prognosis/assets.js";
import { Camera } from "../prognosis/camera.js";
import { Color } from "../prognosis/color.js";
import { Animation } from "../prognosis/components/animation.js";
import { Rectangle } from "../prognosis/components/rectangle.js";
import { Sprite } from "../prognosis/components/sprite.js";
import { Surface } from "../prognosis/components/surface.js";
import { Text } from "../prognosis/components/text.js";
import { Component, Entity, Space } from "../prognosis/core.js";
import { Key, Keyboard } from "../prognosis/keyboard.js";
import { Point } from "../prognosis/point.js";
import { Project } from "../prognosis/project.js";
import { Random } from "../prognosis/random.js";
import { Runtime } from "../prognosis/runtime.js";

const playerSpriteSheetAsset = Assets.loadSpriteSheet(
	"/assets/demo/characters/player.json",
	"/assets/demo/characters/player.png"
);

const Width = Project.graphics.width;
const Height = Project.graphics.height;

const background = new Entity("background");
background.x = Width / 2;
background.y = Height / 2;
const backgroundRectangle = new Rectangle();
backgroundRectangle.color = Random.color();
backgroundRectangle.width = Width;
backgroundRectangle.height = Height;
background.addComponent(backgroundRectangle);
background.space = Space.Screen;
background.z = -100;
Runtime.root.addChild(background);

class FpsCounter extends Component {
	textComponent?: Text;

	start(entity: Entity) {
		this.textComponent = entity.getComponent(Text);
	}

	update() {
		if (this.textComponent) {
			this.textComponent.text = "FPS: " + (1 / Runtime.dt).toFixed(0);
		}
	}
}

const fpsCounter = new Entity("fps");
fpsCounter.space = Space.Screen;
fpsCounter.localPosition = new Point(32, 32);
fpsCounter.z = 100;
fpsCounter.addComponent(new FpsCounter());
const fpsCounterText = new Text();
fpsCounterText.color = Color.Yellow;
fpsCounterText.font = "16px monospace";
fpsCounter.addComponent(fpsCounterText);
Runtime.root.addChild(fpsCounter);

class PlayerController extends Component {
	speed = 200;
	camera = Runtime.root.getComponent(Surface)?.camera as Camera;

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
			this.camera.y -= 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Down)) {
			this.camera.y += 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Left)) {
			this.camera.x -= 100 * Runtime.dt;
		}
		if (Keyboard.keyDown(Key.Right)) {
			this.camera.x += 100 * Runtime.dt;
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
player.addComponent(new PlayerController());
const playerAnimation = new Animation();
playerSpriteSheetAsset.then(
	(asset) => (playerAnimation.spriteSheetAsset = asset)
);
playerAnimation.frameKey = "player 0.png";
player.addComponent(playerAnimation);
const playerSprite = new Sprite();
playerSprite.scale = playerSprite.scale.mul(4);
playerSprite.debug = true;
player.addComponent(playerSprite);
Runtime.root.addChild(player);

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
	dummy.addComponent(dummyAnimation);
	dummy.addComponent(new DummyBouncer());
	const dummySprite = new Sprite();
	dummySprite.scale = dummySprite.scale.mul(Random.integer(1, 6));
	dummy.addComponent(dummySprite);
	Runtime.root.addChild(dummy);
}

const greenSquare1 = new Entity("greenSquare1");
greenSquare1.x = -80;
greenSquare1.z = 3;
const greenSquare1Rectangle = new Rectangle();
greenSquare1Rectangle.width = 100;
greenSquare1Rectangle.height = 100;
greenSquare1Rectangle.color = Color.Green.with({ alpha: 0.6 });
greenSquare1.addComponent(greenSquare1Rectangle);
Runtime.root.addChild(greenSquare1);

const redSquare = new Entity("redSquare1");
redSquare.z = 2;
const redSquare1Rectangle = new Rectangle();
redSquare1Rectangle.width = 100;
redSquare1Rectangle.height = 100;
redSquare1Rectangle.color = Color.Red.with({ alpha: 0.6 });
redSquare.addComponent(redSquare1Rectangle);
Runtime.root.addChild(redSquare);

const greenSquare2 = new Entity("greenSquare2");
greenSquare2.x = 80;
greenSquare2.z = 1;
const greenSquare2Rectangle = new Rectangle();
greenSquare2Rectangle.width = 100;
greenSquare2Rectangle.height = 100;
greenSquare2Rectangle.color = Color.Green.with({ alpha: 0.6 });
greenSquare2.addComponent(greenSquare2Rectangle);
Runtime.root.addChild(greenSquare2);

(window as any).Runtime = Runtime;
(window as any).Assets = Assets;
