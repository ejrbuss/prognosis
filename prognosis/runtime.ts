import { Graphics } from "./graphics.js";
import { Node } from "./nodes/node.js";
import { Signal } from "./signal.js";
import { Project } from "./project.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";

class Root extends Node {
	_render(context: CanvasRenderingContext2D) {
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(w / 2, h / 2);
		super._render(context);
		context.restore();
	}
}

const RuntimeClass = class Runtime {
	#now: number = 0;
	#dt: number = 0;
	readonly root: Readonly<Root> = new Root();
	updates: Signal = new Signal(); // TODO kill this
	rootChanges: Signal = new Signal(); // TODO kill this
	timeScale: number = 1;

	get now(): number {
		return this.#now;
	}

	get dt(): number {
		return this.#dt;
	}

	start() {
		Graphics.start();
		Keyboard.start();
		Mouse.start();
		this.#now = performance.now() / 1000;
		this.root._start();
		requestAnimationFrame(() => this.loop());
	}

	loop() {
		const newNow = performance.now() / 1000;
		this.#dt = (newNow - this.#now) * this.timeScale;
		this.#now = newNow;
		this.updates.send();
		this.root._update();
		this.root._render(Graphics.context);
		requestAnimationFrame(() => this.loop());
	}
};

export const Runtime = new RuntimeClass();
