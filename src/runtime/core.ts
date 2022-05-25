export type Constructor<T> = { new (...args: any[]): T };
export type Constructors<T> = {
	[property in keyof T]: Constructor<T[property]>;
};

export abstract class Event {}

export class StartupEvent extends Event {}
export class KeyboardEvent extends Event {}
export class MouseEvent extends Event {}
export class UpdateEvent extends Event {}
export class CollisionEvent extends Event {}

export class Entity {
	hasComponent(e: Entity, c: Constructor<Component>): boolean {
		return false;
	}

	hasComponents(e: Entity, cs: Constructor<Component>[]): boolean {
		return false;
	}

	getComponent<C extends Component>(
		e: Entity,
		c: Constructor<C>
	): C | undefined {
		throw new Error();
	}

	getComponents<CS extends Component[]>(
		e: Entity,
		cs: Constructors<CS>
	): CS | undefined {
		throw new Error();
	}

	addComponent(e: Entity, c: Component): void {}
}

export abstract class Component {}

export abstract class System {
	abstract query: typeof Component[];

	abstract event: Constructor<Event>;

	abstract updateAll(
		event: Event,
		iter: Iterable<[Entity, ...Component[]]>
	): void;
}

export abstract class Behaviour extends System {
	updateAll(event: Event, iter: Iterable<[Entity, ...Component[]]>): void {
		for (const entityAndComponents of iter) {
			this.update(event, ...entityAndComponents);
		}
	}

	abstract update(
		event: Event,
		entity: Entity,
		...components: Component[]
	): void;
}

export class Scene {
	spawn(): Entity {
		return new Entity();
	}
}

export class Layer {}

export class Vector {}

export class Transform extends Component {
	position = new Vector();
	rotation = 0;
}

export class PlayerTag extends Component {}

export class PlayerMovement extends Behaviour {
	query = [Transform, PlayerTag];
	event = UpdateEvent;

	update(
		event: UpdateEvent,
		entity: Entity,
		transform: Transform,
		playerTag: PlayerTag
	) {}
}

export class PlayerBulletCollision extends Behaviour {
	query = [Collidable, BulletTag];
	event = CollisionEvent;
	update(event: UpdateEvent, entity: Entity, collidable: Collidable): void {}
}

// Engine.activeScene
// Engine.scenes
// Engine.keyboard
// Engine.mouse
