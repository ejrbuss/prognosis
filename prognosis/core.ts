import { Point } from "./point.js";
import { Mutable } from "./util.js";

export abstract class Component {
	readonly dependencies: typeof Component[] = [];
	start?(entity: Entity): void;
	stop?(entity: Entity): void;
	enable?(entity: Entity): void;
	disable?(entity: Entity): void;
	update?(entity: Entity): void;
	render?(entity: Entity, context: CanvasRenderingContext2D): void;
	inspect?(inspector: any): void;

	constructor() {
		ComponentsConstructors[this.constructor.name] = this
			.constructor as typeof Component;
	}
}

export const ComponentsConstructors: Record<string, typeof Component> = {};

export enum EntityState {
	Running = "Running",
	Stopped = "Stopped",
	Disabled = "Disabled",
}

export enum Space {
	World = "World",
	Screen = "Screen",
}

export class Entity {
	readonly state: EntityState = EntityState.Stopped;
	readonly name: string;
	readonly components: Component[] = [];
	space: Space = Space.World;
	position: Point = Point.Origin;
	z: number = 0;

	constructor(name: string) {
		this.name = name;
		Entities[name] = this;
	}

	get x(): number {
		return this.position.x;
	}

	set x(x: number) {
		this.position = this.position.with({ x });
	}

	get y(): number {
		return this.position.y;
	}

	set y(y: number) {
		this.position = this.position.with({ y });
	}

	add(component: Component) {
		this.components.push(component);
	}

	remove<C extends typeof Component>(componentConstructor: C): boolean {
		const index = this.components.findIndex(
			(component) => component.constructor === componentConstructor
		);
		if (index >= 0) {
			this.components.splice(index, 1);
			return true;
		}
		return false;
	}

	has(componentConstructor: typeof Component): boolean {
		return this.components.some(
			(component) => component.constructor === componentConstructor
		);
	}

	get<C extends typeof Component>(
		componentConstructor: C
	): InstanceType<C> | undefined {
		return this.components.find(
			(component) => component.constructor === componentConstructor
		) as any;
	}

	start() {
		(this as Mutable<this>).state = EntityState.Running;
		this.components.forEach((component) => {
			const missingDependency = component.dependencies.find(
				(dependency) => !this.has(dependency)
			);
			if (missingDependency !== undefined) {
				throw new Error(
					`${component.constructor.name} Component is missing the dependency ${missingDependency.name} Component on entity: ${this.name}`
				);
			}
			component.start && component.start(this);
		});
	}

	stop() {
		(this as Mutable<this>).state = EntityState.Stopped;
		this.components.forEach((component) => {
			component.stop && component.stop(this);
		});
	}

	update() {
		this.state === EntityState.Running &&
			this.components.forEach((component) => {
				component.update && component.update(this);
			});
	}

	enable() {
		if (this.state === EntityState.Stopped) {
			return;
		}
		(this as Mutable<this>).state = EntityState.Running;
		this.components.forEach((component) => {
			component.enable && component.enable(this);
		});
	}

	disable() {
		if (this.state === EntityState.Stopped) {
			return;
		}
		(this as Mutable<this>).state = EntityState.Disabled;
		this.components.forEach((component) => {
			component.disable && component.disable(this);
		});
	}

	render(context: CanvasRenderingContext2D) {
		this.components.forEach((component) => {
			component.render && component.render(this, context);
		});
	}
}

export const Entities: Record<string, Entity> = {};
