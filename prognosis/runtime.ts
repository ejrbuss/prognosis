import { Color } from "./color.js";
import { Graphics } from "./graphics.js";
import { Node } from "./node.js";
import { Observable } from "./observable.js";
import { Project } from "./project.js";

const RuntimeClass = class Runtime {
	#now: number = 0;
	#dt: number = 0;
	readonly updates: Observable<void> = new Observable();
	readonly lateUpdates: Observable<void> = new Observable();
	readonly rootUpdates: Observable<Node> = new Observable();
	timeScale: number = 1;
	running: boolean = false;

	get now(): number {
		return this.#now;
	}

	get dt(): number {
		return this.#dt;
	}

	get root(): Node {
		return this.rootUpdates.value;
	}

	set root(node: Node) {
		this.rootUpdates.value = node;
	}

	start() {
		this.#now = performance.now() / 1000;
		this.root._start();
		this.running = true;
		requestAnimationFrame(() => this.update());
	}

	update() {
		const newNow = performance.now() / 1000;
		this.#dt = (newNow - this.#now) * this.timeScale;
		this.#now = newNow;
		this.updates.update();
		this.root._update();
		const context = Graphics.context;
		const w = Project.graphics.width;
		const h = Project.graphics.height;
		context.clearRect(0, 0, w, h);
		context.save();
		context.translate(w / 2, h / 2);
		this.root._render(context);
		context.restore();
		if (this.running) {
			requestAnimationFrame(() => this.update());
		}
	}
};

export const Runtime = new RuntimeClass();
