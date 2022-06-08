import { Graphics } from "./graphics.js";
import { Node } from "./nodes/node.js";
import { Signal } from "./signal.js";
import { Project } from "./project.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";

const RuntimeClass = class Runtime {
	#root?: Node;
	#stopTime: number = 0;
	#now: number = 0;
	#dt: number = 0;
	updates: Signal = new Signal(); // TODO kill this
	rootChanges: Signal = new Signal(); // TODO kill this
	timeScale: number = 1;
	editorMode: boolean = false;
	running: boolean = false;
	debug: boolean = false;

	get now(): number {
		return this.#now - this.#stopTime;
	}

	get dt(): number {
		return this.#dt;
	}

	get root(): Node {
		return this.#root as Node;
	}

	set root(node: Node) {
		this.#root = node;
		if (this.running && node !== undefined && !node.started) {
			node._start();
		}
		this.rootChanges.send();
	}

	find(path: string): Node | undefined {
		const seperator = path.indexOf("/");
		if (seperator === -1) {
			throw new Error(`Invalid  Node path "${path}"!`);
		}
		const name = path.substring(0, seperator);
		if (this.#root?.name !== name) {
			return;
		}
		if (path.length === name.length + 1) {
			return this.#root;
		}
		return this.#root.find(path.substring(seperator + 1));
	}

	start() {
		Graphics.start();
		Keyboard.start();
		Mouse.start();
		this.#now = performance.now() / 1000;
		this.running = true;
		if (this.#root !== undefined) {
			this.#root._start();
		}
		requestAnimationFrame(() => this.loop());
	}

	loop() {
		const newNow = performance.now() / 1000;
		this.#dt = (newNow - this.#now) * this.timeScale;
		this.#now = newNow;
		if (this.#root !== undefined) {
			if (this.running) {
				this.updates.send();
				this.#root._update();
			} else {
				this.#stopTime += this.#dt;
			}
			const context = Graphics.context;
			const w = Project.graphics.width;
			const h = Project.graphics.height;
			context.clearRect(0, 0, w, h);
			context.save();
			context.translate(w / 2, h / 2);
			if (this.debug) {
				this.#root._debugRender(context);
			} else {
				this.#root._render(context);
			}
			context.restore();
		}
		requestAnimationFrame(() => this.loop());
	}
};

export const Runtime = new RuntimeClass();
