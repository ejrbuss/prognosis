import { Transform } from "./transform.js";

export class Scene {
	camera: Transform = new Transform();

	constructor(readonly name: string) {
		Scenes[name] = this;
	}
}

export const Scenes: Record<string, Scene> = {};
