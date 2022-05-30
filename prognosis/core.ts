export abstract class Component {
	dependencies?: typeof Component[];
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

export class Entity {
	name: string;
	components: Component[] = [];
	children: Entity[] = [];
	isEnabled: boolean = true;

	constructor(name: string) {
		this.name = name;
		Entities[name] = this;
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
		this.components.forEach((component) => {
			if (!component.dependencies?.every((dependency) => this.has(dependency)))
				component.start && component.start(this);
		});
	}

	stop() {
		this.components.forEach((component) => {
			component.stop && component.stop(this);
		});
	}

	update() {
		this.isEnabled &&
			this.components.forEach((component) => {
				component.update && component.update(this);
			});
	}

	enable() {
		this.components.forEach((component) => {
			component.enable && component.enable(this);
		});
		this.isEnabled = true;
	}

	disable() {
		this.components.forEach((component) => {
			component.disable && component.disable(this);
		});
		this.isEnabled = false;
	}

	render(context: CanvasRenderingContext2D) {
		this.components.forEach((component) => {
			component.render && component.render(this, context);
		});
	}
}

export const Entities: Record<string, Entity> = {};
