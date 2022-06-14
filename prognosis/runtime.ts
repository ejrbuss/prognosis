import { Graphics } from "./graphics.js";
import { Node } from "./nodes/node.js";
import { Project } from "./project.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";
import { Root } from "./nodes/root.js";

const RuntimeClass = class Runtime {
	#now: number = 0;
	#dt: number = 0;
	root: Root = new Root();
	timeScale: number = 1;

	get now(): number {
		return this.#now;
	}

	get dt(): number {
		return this.#dt;
	}

	findByPath(path: string): Node | undefined {
		const seperator = path.indexOf("/");
		if (seperator === -1) {
			throw new Error(`Invalid  Node path "${path}"!`);
		}
		const name = path.substring(0, seperator);
		if (name === this.root.name) {
			return this.root.findByPath(path.substring(seperator + 1));
		}
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
		Keyboard.update();
		Mouse.update();
		this.root._update();
		this.root._render(Graphics.context);
		requestAnimationFrame(() => this.loop());
	}
};

export const Runtime = new RuntimeClass();
