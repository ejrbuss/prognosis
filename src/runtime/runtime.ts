import type { Scene } from "./scene.js";
import type { Task } from "./task.js";

import { Signals } from "./signal.js";
import {
	Cancelled,
	deferredPromise,
	DeferredPromise,
} from "../common/common.js";

interface ChangeSceneRequest {
	scene: Scene;
	toResolve: DeferredPromise<void>;
}

let now!: number;
let changeSceneRequest: ChangeSceneRequest | undefined;
let activeScene!: Scene;
let scheduledTasks: Task[] = [];
// let project!: Project;
// let graphics!: Graphics;
// let physics!: Physics;
// let input!: Input;

function onload() {
	// project = await new Projct();
	// graphics = await new Graphics(project);
	// renderer = await new Renderer(project);
	// physics = await new Physics();
	// input = await new Input();
	// document.title = project.title;
	// acticeScene = project.initialScene;
	// activeScene.broadcast(Signals.SceneStart);
	now = Date.now();
	loop();
}

function loop() {
	// TODO: handle focus events freezing the window
	const lastFrame = now;
	now = Date.now();
	const deltaMs = now - lastFrame;

	// Handle scene change
	if (changeSceneRequest) {
		activeScene.broadcast(Signals.SceneStop);
		activeScene = changeSceneRequest.scene;
		activeScene.broadcast(Signals.SceneStart);
		changeSceneRequest.toResolve.resolve();
		changeSceneRequest = undefined;
	}

	// Update all scheduled tasks
	scheduledTasks = scheduledTasks.filter((task) => {
		task.update(deltaMs);
		return (task.running = !task.done);
	});

	// Update scene
	activeScene.broadcast(Signals.Update, deltaMs);

	// Physics
	// physics.simulate(deltaMs);

	// Rendering

	requestAnimationFrame(loop);
}

window.onload = onload;

export class Runtime {
	static getActiveScene(): Scene {
		return activeScene;
	}

	static async restartScene() {
		await this.changeScene(activeScene);
	}

	static async changeScene(scene: Scene) {
		if (changeSceneRequest) {
			changeSceneRequest.toResolve.reject(new Cancelled());
		}
		changeSceneRequest = {
			scene,
			toResolve: deferredPromise(),
		};
		await changeSceneRequest.toResolve;
	}

	static schedule(task: Task) {
		const index = scheduledTasks.indexOf(task);
		if (index === -1) {
			scheduledTasks.push(task);
			task.running = true;
		}
	}

	static cancel(task: Task) {
		const index = scheduledTasks.indexOf(task);
		if (index !== -1) {
			scheduledTasks.splice(index, 1);
			task.running = false;
		}
	}
}

(window as any).Runtime = Runtime;
