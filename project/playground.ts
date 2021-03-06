// Runtime.updates.next.then(async () => {
// 	const maxWidth = Project.graphics.width;
// 	const maxHeight = Project.graphics.height;

// 	const world = new Surface("World");
// 	const screen = new Surface("Screen");
// 	Runtime.root.add(screen);
// 	Runtime.root.add(world);

// 	// Set z order
// 	world.z = 0;
// 	screen.z = 1;

// 	// Switch screen to screen coordinates
// 	screen.localX -= maxWidth / 2;
// 	screen.localY -= maxHeight / 2;

// 	const playerSpriteSheetAsset = Resources.load(
// 		SpriteSheetResource,
// 		"/resources/demo/characters/player.json",
// 		"/resources/demo/characters/player.png"
// 	);

// 	const background = new Rectangle("Background");
// 	background.color = Random.color();
// 	background.width = maxWidth;
// 	background.height = maxHeight;
// 	background.z = -100;
// 	world.add(background);

// 	class FpsCounter extends Node {
// 		textNode?: Text;

// 		childrenChanged() {
// 			this.textNode = this.get(Text);
// 		}

// 		update() {
// 			if (this.textNode !== undefined) {
// 				this.textNode.text = "FPS: " + (1 / Runtime.dt).toFixed(0);
// 			}
// 		}
// 	}

// 	const fpsCounter = new FpsCounter("FPS");
// 	fpsCounter.localPosition = new Point(32, 32);
// 	fpsCounter.z = 100;
// 	const fpsCounterText = new Text();
// 	fpsCounterText.color = Color.Yellow;
// 	fpsCounterText.fontFamily = "monospace";
// 	fpsCounterText.fontSize = 16;
// 	fpsCounter.add(fpsCounterText);
// 	screen.add(fpsCounter);

// 	class Player extends Node {
// 		speed = 200;

// 		update() {
// 			let direction = Point.Origin;
// 			if (Keyboard.keyDown(Key.W)) {
// 				direction = direction.add(Point.Down);
// 			}
// 			if (Keyboard.keyDown(Key.A)) {
// 				direction = direction.add(Point.Left);
// 			}
// 			if (Keyboard.keyDown(Key.S)) {
// 				direction = direction.add(Point.Up);
// 			}
// 			if (Keyboard.keyDown(Key.D)) {
// 				direction = direction.add(Point.Right);
// 			}
// 			if (Keyboard.keyDown(Key.Up)) {
// 				world.camera.y -= 100 * Runtime.dt;
// 			}
// 			if (Keyboard.keyDown(Key.Down)) {
// 				world.camera.y += 100 * Runtime.dt;
// 			}
// 			if (Keyboard.keyDown(Key.Left)) {
// 				world.camera.x -= 100 * Runtime.dt;
// 			}
// 			if (Keyboard.keyDown(Key.Right)) {
// 				world.camera.x += 100 * Runtime.dt;
// 			}
// 			if (Keyboard.keyPressed(Key.Equals)) {
// 				this.z += 1;
// 			}
// 			if (Keyboard.keyPressed(Key.Dash)) {
// 				this.z -= 1;
// 			}
// 			const magnitude = direction.magnitude;
// 			if (magnitude > 0) {
// 				this.localX += (direction.x * this.speed * Runtime.dt) / magnitude;
// 				this.localY += (direction.y * this.speed * Runtime.dt) / magnitude;
// 			}
// 		}
// 	}

// 	const player = new Player("Player");
// 	const playerAnimation = new Animation();
// 	playerSpriteSheetAsset.then(
// 		(asset) => (playerAnimation.spriteSheetResource = asset)
// 	);
// 	playerAnimation.frameKey = "player 0.png";
// 	player.add(playerAnimation);
// 	const playerSprite = new Sprite();
// 	playerSprite.scale = playerSprite.scale.mul(4);
// 	playerSprite.debug = true;
// 	playerAnimation.add(playerSprite);
// 	world.add(player);

// 	class DummyBouncer extends Node {
// 		speed: number = Random.integer(50, 500);
// 		direction: Point = Random.point();

// 		update() {
// 			this.x += this.direction.x * this.speed * Runtime.dt;
// 			this.y += this.direction.y * this.speed * Runtime.dt;
// 			if (this.x > maxWidth / 2) {
// 				this.direction = this.direction.flipX();
// 				this.x += this.direction.x * this.speed * Runtime.dt;
// 			}
// 			if (this.x < -maxWidth / 2) {
// 				this.direction = this.direction.flipX();
// 				this.x += this.direction.x * this.speed * Runtime.dt;
// 			}
// 			if (this.y > maxHeight / 2) {
// 				this.direction = this.direction.flipY();
// 				this.y += this.direction.y * this.speed * Runtime.dt;
// 			}
// 			if (this.y < -maxHeight / 2) {
// 				this.direction = this.direction.flipY();
// 				this.y += this.direction.y * this.speed * Runtime.dt;
// 			}
// 		}
// 	}
// 	const dummies = new Node("Dummies");
// 	world.add(dummies);

// 	const DummyCount = 100;
// 	for (let i = 0; i < DummyCount; i++) {
// 		const dummy = new DummyBouncer(`Dummy #${i}`);
// 		dummy.x = Random.integer(-maxWidth / 2, maxWidth / 2);
// 		dummy.y = Random.integer(-maxHeight / 2, maxHeight / 2);
// 		dummy.z = Random.integer(0, 3);
// 		const dummyAnimation = new Animation();
// 		playerSpriteSheetAsset.then(
// 			(asset) => (dummyAnimation.spriteSheetResource = asset)
// 		);
// 		dummyAnimation.frameKey = "player 0.png";
// 		dummy.add(dummyAnimation);
// 		const dummySprite = new Sprite();
// 		dummySprite.scale = dummySprite.scale.mul(Random.integer(1, 6));
// 		dummyAnimation.add(dummySprite);
// 		dummies.add(dummy);
// 	}

// 	const greenSquare1 = new Rectangle("Green Square #1");
// 	greenSquare1.x = -80;
// 	greenSquare1.z = 3;
// 	greenSquare1.width = 100;
// 	greenSquare1.height = 100;
// 	greenSquare1.color = Color.Green.with({ alpha: 0.6 });
// 	world.add(greenSquare1);

// 	const redSquare = new Rectangle("Red Square");
// 	redSquare.z = 2;
// 	redSquare.width = 100;
// 	redSquare.height = 100;
// 	redSquare.color = Color.Red.with({ alpha: 0.6 });
// 	world.add(redSquare);

// 	const greenSquare2 = new Rectangle("Green Square #2");
// 	greenSquare2.x = 80;
// 	greenSquare2.z = 1;
// 	greenSquare2.width = 100;
// 	greenSquare2.height = 100;
// 	greenSquare2.color = Color.Green.with({ alpha: 0.6 });
// 	world.add(greenSquare2);

// 	(window as any).Runtime = Runtime;
// 	(window as any).Resources = Resources;
// });
