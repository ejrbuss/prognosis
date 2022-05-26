import { Transform } from "./math.js";
import { SchemaRecord, SchemaType } from "./schema.js";

export class Entity {
	constructor(readonly name: string) {
		Entities[name] = this;
	}

	components: Map<Component<any>, unknown> = new Map();

	add<S extends SchemaRecord>(component: Component<S>, value: SchemaType<S>) {
		this.components.set(component, value);
	}

	get<S extends SchemaRecord>(
		component: Component<S>
	): SchemaType<S> | undefined {
		return this.components.get(component) as SchemaType<S>;
	}
}

export const Entities: Record<string, Entity> = {};

export class Component<S extends SchemaRecord> {
	constructor(readonly schema: S) {}
}

export type ComponentType<C extends Component<any>> = C extends Component<
	infer S
>
	? SchemaType<S>
	: never;

export type BehaviourOptions = {
	dependencies?: Component<any>[];
	create?: () => unknown;
	destory?: () => unknown;
	sceneStart?: () => unknown;
	sceneEnd?: () => unknown;
	update?: () => unknown;
};

export class Behaviour {
	constructor(options: BehaviourOptions) {}
}

export class Scene {
	camera: Transform = Transform.Identity;
	constructor(readonly name: string) {
		Scenes[name] = this;
	}
}

export const Scenes: Record<string, Scene> = {};
