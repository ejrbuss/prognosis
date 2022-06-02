import { Entity } from "./core.js";
import { Graphics } from "./graphics.js";
import { Observable } from "./observable.js";
import { Project } from "./project.js";
import { Mutable } from "./util.js";

const RuntimeClass = class Runtime {
	readonly updates: Observable<void> = new Observable();
	readonly lateUpdates: Observable<void> = new Observable();
	readonly now: number = 0;
	readonly dt: number = 0;
	timeScale: number = 1;
	root!: Entity;

	constructor() {
		this.update = this.update.bind(this);
	}

	start() {
		(this as Mutable<this>).now = performance.now() / 1000;
		requestAnimationFrame(this.update);
	}

	update() {
		const newNow = performance.now() / 1000;
		(this as Mutable<this>).dt = (newNow - this.now) * this.timeScale;
		(this as Mutable<this>).now = newNow;
		this.updates.update();
		this.root.update();
		this.lateUpdates.update();
		this.root.lateUpdate();
		// this.root.physicsUpdate();
		Graphics.context.clearRect(
			0,
			0,
			Project.graphics.width,
			Project.graphics.height
		);
		this.root.render(Graphics.context);
		requestAnimationFrame(this.update);
	}
};

export const Runtime = new RuntimeClass();
