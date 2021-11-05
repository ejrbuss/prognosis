import type { Camera } from "./camera.js";
import type { Component } from "./component.js";
import type { Layer } from "./layer.js";
import type { Entity } from "./entity.js";
import type { Signal } from "./signal.js";

import { ClassOf } from "../common/common.js";

export const Scenes: Record<string, Scene> = {};

export class Scene {
	children: Layer[] = [];

	constructor(public name: string, public camera: Camera) {
		Scenes[name] = this;
	}

	find(...componentClasses: ClassOf<Component>[]): Entity[] {
		return this.children.flatMap((layer) => layer.find(...componentClasses));
	}

	async broadcast(signal: Signal, ...args: any[]) {
		await Promise.all(
			this.children.map((layer) => layer.broadcast(signal, ...args))
		);
	}
}
