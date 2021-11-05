import type { Easing } from "./easings.js";
import { Vector } from "./vector.js";
import { Task } from "./task.js";
import { Runtime } from "./runtime.js";
import { lerp, random } from "../common/common.js";

export class Camera {
	constructor(
		public position: Vector = new Vector(0),
		public scale: Vector = new Vector(1),
		public rotation: number = 0
	) {}

	panTo(destination: Vector, durationMs: number, easing: Easing): Task {
		const initial = this.position;
		const task = new Task(() => {
			if (task.elapsedMs >= durationMs) {
				this.position = destination;
				task.done = true;
			} else {
				this.position = Vector.lerp(
					initial,
					destination,
					easing(task.elapsedMs / durationMs)
				);
			}
		});
		Runtime.schedule(task);
		return task;
	}

	scaleTo(scale: Vector, durationMs: number, easing: Easing): Task {
		const initial = this.scale;
		const task = new Task(() => {
			if (task.elapsedMs >= durationMs) {
				this.scale = scale;
				task.done = true;
			} else {
				this.scale = Vector.lerp(
					initial,
					scale,
					easing(task.elapsedMs / durationMs)
				);
			}
		});
		Runtime.schedule(task);
		return task;
	}

	rotateTo(rotation: number, durationMs: number, easing: Easing): Task {
		const initial = this.rotation;
		const task = new Task(() => {
			if (task.elapsedMs >= durationMs) {
				this.rotation = rotation;
				task.done = true;
			} else {
				this.rotation = lerp(
					initial,
					rotation,
					easing(task.elapsedMs / durationMs)
				);
			}
		});
		Runtime.schedule(task);
		return task;
	}

	shake(intensity: Vector, durationMs: number): Task {
		const initial = this.position;
		const task = new Task(() => {
			if (task.elapsedMs >= durationMs) {
				this.position = initial;
				task.done = true;
			} else {
				this.position = Vector.add(
					initial,
					new Vector(
						(random() - 0.5) * intensity.x * this.scale.x,
						(random() - 0.5) * intensity.y * this.scale.y
					)
				);
			}
		});
		Runtime.schedule(task);
		return task;
	}
}
