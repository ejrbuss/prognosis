import { Graphics } from "./graphics.js";
import { Observable } from "./observable.js";
import { Scene } from "./scene.js";
import { Mutable } from "./util.js";

const RuntimeClass = class Runtime {
	readonly sceneChanges: Observable<Scene> = new Observable();
	readonly updates: Observable<void> = new Observable();
	readonly now: number = 0;
	readonly dt: number = 0;

	constructor() {
		this.update = this.update.bind(this);
		this.sceneChanges.subscribe((newScene, oldScene) => {
			if (oldScene) {
				oldScene.stop();
			}
			newScene.start();
		});
	}

	get scene(): Scene {
		return this.sceneChanges.value;
	}

	set scene(scene: Scene) {
		this.sceneChanges.update(scene);
	}

	start() {
		(this as Mutable<this>).now = performance.now() / 1000;
		requestAnimationFrame(this.update);
	}

	update() {
		const newNow = performance.now() / 1000;
		(this as Mutable<this>).dt = newNow - this.now;
		(this as Mutable<this>).now = newNow;
		this.updates.update();
		this.scene.update();
		// this.scene.physicsUpdate();
		Graphics.clear();
		this.scene.render(Graphics.context);
		// Graphics.push();
		requestAnimationFrame(this.update);
	}
};

export const Runtime = new RuntimeClass();
