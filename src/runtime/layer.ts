import type { Component } from "./component.js";
import type { Entity } from "./entity.js";
import { Signal, Signals } from "./signal.js";
import { ClassOf } from "../common/common.js";

export const Layers: Record<string, Layer> = {};

export class Layer {
	inWorldSpace: boolean = true;
	children: Entity[] = [];

	constructor(public name: string) {
		Layers[name] = this;
	}

	createChild(prototype: Entity) {
		const child = prototype.copy();
		this.children.push(child);
		child.broadcast(Signals.Create);
		return child;
	}

	destroyChild(child: Entity) {
		const index = this.children.indexOf(child);
		if (index === -1) {
			throw new Error("Cannot destroy non child entity!");
		}
		child.broadcast(Signals.Destroy);
		this.children.splice(index, 1);
	}

	destroyChildren() {
		this.broadcast(Signals.Destroy);
		this.children = [];
	}

	find(...componentClasses: ClassOf<Component>[]): Entity[] {
		const filtered: Entity[] = [];
		function findDeep(entity: Entity) {
			if (
				componentClasses.every((componentClass) =>
					entity.hasComponent(componentClass)
				)
			) {
				filtered.push(entity);
			}
			entity.children.forEach(findDeep);
		}
		this.children.forEach(findDeep);
		return filtered;
	}

	async broadcast(signal: Signal, ...args: any[]) {
		await Promise.all(
			this.children.map((entity) => entity.broadcast(signal, ...args))
		);
	}
}
