import { Graphics } from "./graphics.js";
import { Node } from "./nodes/node.js";
import { Signal } from "./signal.js";
import { Project } from "./project.js";

const RuntimeClass = class Runtime {
	#root?: Node;
	#now: number = 0;
	#dt: number = 0;
	updates: Signal = new Signal();
	rootChanges: Signal = new Signal();
	timeScale: number = 1;
	running: boolean = false;

	get now(): number {
		return this.#now;
	}

	get dt(): number {
		return this.#dt;
	}

	get root(): Node {
		return this.#root as Node;
	}

	set root(node: Node) {
		this.#root = node;
		if (this.running && !node.started) {
			node._start();
		}
		this.rootChanges.send();
	}

	start() {
		this.#now = performance.now() / 1000;
		this.running = true;
		if (this.#root !== undefined) {
			this.#root._start();
		}
		requestAnimationFrame(() => this.#loop());
	}

	#loop() {
		const newNow = performance.now() / 1000;
		this.#dt = (newNow - this.#now) * this.timeScale;
		this.#now = newNow;
		this.updates.send();
		if (this.#root !== undefined) {
			this.#root._update();
			const context = Graphics.context;
			const w = Project.graphics.width;
			const h = Project.graphics.height;
			context.clearRect(0, 0, w, h);
			context.save();
			context.translate(w / 2, h / 2);
			this.#root._render(context);
			context.restore();
		}
		if (this.running) {
			requestAnimationFrame(() => this.#loop());
		}
	}
};

export const Runtime = new RuntimeClass();
