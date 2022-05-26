import { Scene } from "./core.js";
import { Graphics } from "./graphics.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";
import { Observable } from "./observable.js";
import { Project } from "./project.js";
import { Time } from "./time.js";

const RuntimeClass = class Runtime {
	running: boolean = true;
	currentScene: Observable<Scene> = new Observable<Scene>();
	events = {
		start: new Observable<void>(),
		end: new Observable<void>(),
		update: new Observable<void>(),
		sceneStart: new Observable<Scene>(),
		sceneEnd: new Observable<Scene>(),
	};

	constructor() {
		Project.subscribe((_) => {});
		this.events.start.update();
		this.currentScene.subscribe((scene, lastScene) => {
			if (scene !== lastScene) {
				lastScene && this.events.sceneEnd.update(lastScene);
				this.events.sceneStart.update(scene);
			}
		});
		this.currentScene.update(new Scene("root"));
	}

	start() {
		Time.start();
		this.scheduleNextUpdate();
	}

	update() {
		Time.update();
		Mouse.update();
		Keyboard.update();
		this.events.update.update();
		Graphics.clear();

		const scene = this.currentScene.value;
		if (scene) {
			const ctx = Graphics.context;
			ctx.save();
			ctx.transform(...scene.camera.toArray());
			ctx.restore();
		}
		this.scheduleNextUpdate();
	}

	private scheduleNextUpdate() {
		if (this.running) {
			requestAnimationFrame(this.update.bind(this));
		} else {
			this.events.sceneEnd.update(this.currentScene.value as Scene);
			this.events.end.update();
		}
	}
};

export const Runtime = new RuntimeClass();
