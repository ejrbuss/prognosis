import { Entity } from "./core.js";
import { Transform } from "./transform.js";

export class Scene {
	camera: Transform = Transform.Identity;
	entities: Entity[] = [];
	running: boolean = false;

	constructor(readonly name: string) {
		Scenes[name] = this;
	}

	spawn(entity: Entity) {
		this.entities.push(entity);
		this.running && entity.start();
	}

	despawn(entity: Entity): boolean {
		const index = this.entities.indexOf(entity);
		if (index >= 0) {
			this.running && entity.stop();
			this.entities.splice(index, 1);
			return true;
		}
		return false;
	}

	start() {
		this.running = true;
		this.entities.forEach((entity) => entity.start());
	}

	update() {
		this.entities.forEach((entity) => entity.update());
	}

	render(context: CanvasRenderingContext2D) {
		this.entities.forEach((entity) => entity.render(context));
	}

	stop() {
		this.entities.forEach((entity) => entity.stop());
		this.running = false;
	}
}

export const Scenes: Record<string, Scene> = {};
