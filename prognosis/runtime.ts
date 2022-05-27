import { Graphics } from "./graphics.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";
import { Observable } from "./observable.js";
import { Scene } from "./scene.js";
import { Time } from "./time.js";

const RuntimeClass = class Runtime {
	running: boolean = true;
	sceneChanges: Observable<Scene> = new Observable();
	updates: Observable<void> = new Observable();

	get scene(): Scene {
		return this.sceneChanges.value as Scene;
	}

	set scene(scene: Scene) {
		this.sceneChanges.update(scene);
	}

	start() {
		Time.start();
		this.scene = new Scene("root");
		this.scheduleNextUpdate();
	}

	update() {
		Time.update();
		Mouse.update();
		Keyboard.update();
		this.updates.update();
		// TODO scene should handle rendering not runtime
		// Graphics.clear();
		const ctx = Graphics.context;
		ctx.save();
		ctx.transform(...this.scene.camera.array);
		ctx.restore();
		this.scheduleNextUpdate();
	}

	private scheduleNextUpdate() {
		if (this.running) {
			requestAnimationFrame(this.update.bind(this));
		}
	}
};

export const Runtime = new RuntimeClass();
