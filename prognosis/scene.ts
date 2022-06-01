import { Camera } from "./camera.js";
import { Entity, Space } from "./core.js";
import { Project } from "./project.js";

export class Scene {
	camera: Camera = new Camera();
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

	load() {}

	start() {
		this.running = true;
		this.entities.forEach((entity) => entity.start());
	}

	update() {
		this.entities.forEach((entity) => entity.update());
	}

	render(context: CanvasRenderingContext2D) {
		const entitiesInRenderOrder = this.entities.sort((e1, e2) => e1.z - e2.z);
		const hw = Project.config.gameCanvas.width / 2;
		const hh = Project.config.gameCanvas.height / 2;
		const sxy = this.camera.zoom;
		const tx = hw - this.camera.x;
		const ty = hh - this.camera.y;
		const r = this.camera.rotation;
		entitiesInRenderOrder.forEach((entity) => {
			if (entity.space === Space.World) {
				context.save();
				context.translate(tx + entity.x, ty + entity.y);
				context.rotate(r);
				context.scale(sxy, sxy);
				entity.render(context);
				context.restore();
			}
			if (entity.space === Space.Screen) {
				context.save();
				context.translate(entity.x, entity.y);
				entity.render(context);
				context.restore();
			}
		});
	}

	stop() {
		this.entities.forEach((entity) => entity.stop());
		this.running = false;
	}
}

export const Scenes: Record<string, Scene> = {};
