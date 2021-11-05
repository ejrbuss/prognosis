import type { Entity } from "./entity.js";
import type { Graphics } from "./graphics.js";
import type { Input } from "./input.js";
import type { Collision } from "./physics.js";

export abstract class Component {
	entity!: Entity;
	onCreate?(): void | Promise<void>;
	onDestroy?(): void | Promise<void>;
	onUpdate?(deltaMs: number, input: Input): void | Promise<void>;
	onCollision?(collision: Collision): void | Promise<void>;
	onRender?(graphics: Graphics): void | Promise<void>;
}
