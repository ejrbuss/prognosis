import { ObservableProperties } from "./observable.js";
import { Transform } from "./transform.js";

export enum Space {
	Screen = "Screen",
	World = "World",
}

export abstract class Component {
	dependencies?: typeof Component[];
	onCreate?(entity: Entity): void;
	onDestory?(entity: Entity): void;
	onEnable?(entity: Entity): void;
	onDisable?(entity: Entity): void;
	onUpdate?(entity: Entity): void;
	onRender?(entity: Entity, context: CanvasRenderingContext2D): void;
	onInspect?(this: ObservableProperties<this>, inspector: any): void;

	constructor() {
		ComponentsConstructors[this.constructor.name] = this
			.constructor as typeof Component;
	}
}

export const ComponentsConstructors: Record<string, typeof Component> = {};

export class Entity {
	name: string;
	components: Map<typeof Component, Component> = new Map();
	transform: Transform = new Transform();
	layer: number = 0;
	space: Space = Space.World;
	enabled: boolean = false;

	constructor(name: string) {
		this.name = name;
		Entities[name] = this;
	}

	add(component: Component) {
		const componentConstructor = component.constructor as typeof Component;
		if (this.components.has(componentConstructor)) {
			throw new Error("Entity already has component!");
		}
		this.components.set(componentConstructor, component);
	}

	get<C extends typeof Component>(
		componentConstructor: C
	): InstanceType<C> | undefined {
		return this.components.get(componentConstructor) as InstanceType<C>;
	}
}

export const Entities: Record<string, Entity> = {};

/*
type MapObservable<T> = { [K in keyof T]: Observable<T> };

class Player extends Component {
	health: number = 0;
	onInspectDemo(this: MapObservable<Player>, parent: any) {
		parent.integerINput(this.dependencies);
	}
}
*/
