import { Entity } from "./entity.js";
import type { Vector } from "./vector.js";

export class Collision {
	constructor(
		public contact: Vector,
		public entity1: Entity,
		public entity2: Entity
	) {}
}
