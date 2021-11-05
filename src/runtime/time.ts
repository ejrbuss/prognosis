import { Runtime } from "./runtime.js";
import { Task } from "./task.js";

export function delay(durationMs: number): Task {
	const task = new Task(() => {
		task.done = task.elapsedMs >= durationMs;
	});
	Runtime.schedule(task);
	return task;
}

export interface TimerOptions {
	periodMs: number;
	initialDelayMs?: number;
	repeat?: number;
}

export class Timer {
	periodMs: number;
	initialDelayMs: number;
	repeat: number;
	repeatCount: number;
	task: Task;
	nextUpdateMs: number;

	constructor(options: TimerOptions, public timerUpdate: () => unknown) {
		this.periodMs = options.periodMs;
		this.initialDelayMs = options.initialDelayMs ?? 0;
		this.repeat = options.repeat ?? Infinity;
		this.repeatCount = 0;
		this.nextUpdateMs = this.initialDelayMs;

		const task = new Task(() => {
			if (task.elapsedMs >= this.nextUpdateMs) {
				this.nextUpdateMs += this.periodMs;
				timerUpdate();
				this.repeatCount += 1;
				if (this.repeatCount >= this.repeat) {
					task.done = true;
				}
			}
		});
		this.task = task;
	}

	start() {
		Runtime.schedule(this.task);
	}

	stop() {
		Runtime.cancel(this.task);
	}

	reset() {
		this.nextUpdateMs = this.task.elapsedMs + this.initialDelayMs;
		this.repeatCount = 0;
	}
}

export class Tween {}
