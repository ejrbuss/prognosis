import type { Component } from "./component.js";
import { ClassOf } from "../common/common.js";
import { Signal, Signals } from "./signal.js";

export const Entities: Record<string, Entity> = {};

export class Entity {
	components: Map<ClassOf<Component>, Component>;
	children: Entity[];

	constructor(name?: string) {
		this.components = new Map();
		this.children = [];
		if (name) {
			Entities[name] = this;
		}
	}

	copy(): Entity {
		const clone = new Entity();
		this.components.forEach((component, componentClass) => {
			clone.addComponent(Object.assign(new componentClass(), component));
		});
		this.children.forEach((child) => {
			clone.children.push(child.copy());
		});
		return clone;
	}

	createChild(prototype: Entity): Entity {
		const child = prototype.copy();
		this.children.push(child);
		child.broadcast(Signals.Create);
		return child;
	}

	destoryChild(child: Entity) {
		const index = this.children.indexOf(child);
		if (index === -1) {
			throw new Error("Cannot destroy non child entity!");
		}
		child.broadcast(Signals.Destroy);
		this.children.splice(index, 1);
	}

	destroyChildren() {
		this.children.forEach((child) => child.broadcast(Signals.Destroy));
		this.children = [];
	}

	hasComponent(componentClass: ClassOf<Component>): boolean {
		return this.components.has(componentClass);
	}

	getComponent<C extends Component>(componentClass: ClassOf<C>): C {
		const component = this.components.get(componentClass);
		if (!component) {
			const name = componentClass.name;
			throw new Error(`Entity does not have component: ${name}!`);
		}
		return component as C;
	}

	tryToGetComponent<C extends Component>(
		componentClass: ClassOf<C>
	): C | undefined {
		return this.components.get(componentClass) as C | undefined;
	}

	addComponent(component: Component) {
		component.entity = this;
		const componentClass = component.constructor as ClassOf<Component>;
		if (this.components.has(componentClass)) {
			const name = componentClass.name;
			throw new Error(`Cannot add duplicate component to entity: ${name}!`);
		}
		this.components.set(componentClass, component);
	}

	send(signal: Signal, ...args: any[]) {
		this.components.forEach((component) => {
			const handler = (component as any)[signal.handlerMethodName];
			if (handler) {
				handler(...args);
			}
		});
	}

	broadcast(signal: Signal, ...args: any[]) {
		this.send(signal, ...args);
		this.children.forEach((child) => child.broadcast(signal, ...args));
	}
}
