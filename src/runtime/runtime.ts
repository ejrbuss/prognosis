import type { Scene } from "./scene.js";
import type { Task } from "./task.js";

import { Signals } from "./signal.js";
import { Cancelled, Deferred } from "../common/common.js";

let now!: number;
let deferredNextScene: Deferred<Scene, void> | undefined;
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
	if (deferredNextScene) {
		const nextScene = deferredNextScene.input;
		activeScene.broadcast(Signals.SceneStop);
		activeScene = nextScene;
		activeScene.broadcast(Signals.SceneStart);
		deferredNextScene.resolve();
	}

	// Update all scheduled tasks
	scheduledTasks = scheduledTasks.filter((task) => {
		task.tryUpdate(deltaMs);
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
		if (deferredNextScene) {
			deferredNextScene.reject(new Cancelled());
		}
		await (deferredNextScene = new Deferred(scene));
	}

	static schedule(task: Task) {
		scheduledTasks.push(task);
		task.running = true;
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
