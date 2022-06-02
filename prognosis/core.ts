import { Point } from "./point.js";
import { ConstructorType } from "./util.js";

export abstract class Component {
	readonly dependencies: typeof Component[] = [];
	start?(entity: Entity): void;
	stop?(entity: Entity): void;
	update?(entity: Entity): void;
	lateUpdate?(entity: Entity): void;
	// physicsUpdate?(entity: Entity): void;
	render?(entity: Entity, context: CanvasRenderingContext2D): void;
	renderChildren?(entity: Entity, context: CanvasRenderingContext2D): void;
	inspect?(inspector: any): void;

	constructor() {
		ComponentsConstructors[this.constructor.name] = this.constructor as any;
	}
}

export const ComponentsConstructors: Record<
	string,
	ConstructorType<Component>
> = {};

export enum Space {
	World = "World",
	Screen = "Screen",
}

export class Entity {
	readonly components: Component[] = [];
	readonly children: Entity[] = [];
	parent?: Entity;
	space: Space = Space.World;
	localPosition: Point = Point.Origin;
	z: number = 0;

	constructor(readonly name: string) {
		this.name = name;
		Entities[name] = this;
	}

	get position(): Point {
		if (this.parent !== undefined) {
			return this.parent.position.add(this.localPosition);
		} else {
			return this.localPosition;
		}
	}

	set position(position: Point) {
		if (this.parent !== undefined) {
			this.localPosition = position.sub(this.parent.position);
		} else {
			this.localPosition = position;
		}
	}

	get x(): number {
		if (this.parent !== undefined) {
			return this.parent.x + this.localPosition.x;
		} else {
			return this.localPosition.x;
		}
	}

	set x(x: number) {
		if (this.parent !== undefined) {
			this.localPosition = this.localPosition.with({
				x: x - this.parent.x,
			});
		} else {
			this.localPosition = this.localPosition.with({ x });
		}
	}

	get y(): number {
		if (this.parent !== undefined) {
			return this.parent.y + this.localPosition.y;
		} else {
			return this.localPosition.y;
		}
	}

	set y(y: number) {
		if (this.parent !== undefined) {
			this.localPosition = this.localPosition.with({
				y: y - this.parent.y,
			});
		} else {
			this.localPosition = this.localPosition.with({ y });
		}
	}

	addChild(child: Entity) {
		if (child.parent !== undefined) {
			throw new Error(`Cannot add a child who has a parent!`);
		}
		this.children.push(child);
		child.parent = this;
		child.start();
	}

	adoptChild(child: Entity) {
		if (child.parent === undefined) {
			throw new Error(`Cannot adopt a child who does not have a parent!`);
		}
		const index = this.children.indexOf(child);
		if (index >= 0) {
			child.parent.children.splice(index, 1);
		}
		this.children.push(child);
		child.parent = this;
	}

	removeChild(child: Entity): boolean {
		const index = this.children.indexOf(child);
		if (index >= 0) {
			child.stop();
			child.parent = undefined;
			this.children.splice(index, 1);
			return true;
		}
		return false;
	}

	addComponent(component: Component) {
		this.components.push(component);
	}

	removeComponent<C extends typeof Component>(
		componentConstructor: C
	): boolean {
		const index = this.components.findIndex(
			(component) => component.constructor === componentConstructor
		);
		if (index >= 0) {
			this.components.splice(index, 1);
			return true;
		}
		return false;
	}

	hasComponent(componentConstructor: typeof Component): boolean {
		return this.components.some(
			(component) => component.constructor === componentConstructor
		);
	}

	getComponent<C extends typeof Component>(
		componentConstructor: C
	): InstanceType<C> | undefined {
		return this.components.find(
			(component) => component.constructor === componentConstructor
		) as any;
	}

	start() {
		this.components.forEach((component) => {
			const missingDependency = component.dependencies.find(
				(dependency) => !this.hasComponent(dependency)
			);
			if (missingDependency !== undefined) {
				throw new Error(
					`${component.constructor.name} Component is missing the dependency ${missingDependency.name} Component on entity: ${this.name}`
				);
			}
			component.start && component.start(this);
		});
		this.children.forEach((child) => child.start());
	}

	stop() {
		this.components.forEach((component) => {
			component.stop && component.stop(this);
		});
		this.children.forEach((child) => child.stop());
	}

	update() {
		this.components.forEach((component) => {
			component.update && component.update(this);
		});
		this.children.forEach((child) => child.update());
	}

	lateUpdate() {
		this.components.forEach((component) => {
			component.lateUpdate && component.lateUpdate(this);
		});
		this.children.forEach((child) => child.lateUpdate());
	}

	render(context: CanvasRenderingContext2D) {
		context.save();
		context.translate(this.localPosition.x, this.localPosition.y);
		this.components.forEach((component) => {
			if (component.render) {
			}
			component.render && component.render(this, context);
		});
		this.renderChildren(context);
		context.restore();
	}

	renderChildren(context: CanvasRenderingContext2D) {
		let useDefaultRender = true;
		this.children.sort((first, second) => first.z - second.z);
		this.components.forEach((component) => {
			if (component.renderChildren) {
				useDefaultRender = false;
				component.renderChildren(this, context);
			}
		});
		if (useDefaultRender) {
			this.children.forEach((child) => child.render(context));
		}
	}
}

export const Entities: Record<string, Entity> = {};
