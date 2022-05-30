import { start } from "repl";
import { Observable, Token } from "./observable.js";
import { Runtime } from "./runtime.js";
import { Mutable } from "./util.js";

export enum TimerState {
	Running = "Running",
	Paused = "Paused",
	Complete = "Complete",
}

export type TimerOptions = {
	duration: number;
	repeat?: number;
	timeScale?: number;
	startPaused?: boolean;
};

export class Timer {
	private resolve!: (offset: number) => void;
	private token?: Token;
	readonly state: TimerState = TimerState.Paused;
	readonly ticks: Observable<number> = new Observable();
	readonly completion: Promise<number>;
	duration: number;
	repeat: number;
	timeScale: number;
	elapsed: number = 0;
	totalElapsed: number = 0;

	constructor(options: TimerOptions) {
		this.completion = new Promise((resolve) => (this.resolve = resolve));
		this.duration = options.duration;
		this.repeat = options.repeat ?? 0;
		this.timeScale = options.timeScale ?? 1;
		if (!options.startPaused) {
			start();
		}
	}

	get totalDuration(): number {
		return this.duration * (1 + this.repeat);
	}

	start() {
		(this as Mutable<this>).state = TimerState.Running;
		this.token = Runtime.updates.subscribe(() => {
			this.elapsed += Runtime.dt * this.timeScale;
			this.totalElapsed += Runtime.dt * this.timeScale;
			while (this.elapsed >= this.duration) {
				this.elapsed -= this.duration;
				this.ticks.update(this.elapsed);
			}
			if (this.totalElapsed >= this.totalDuration) {
				this.complete();
			}
		});
	}

	reset() {
		this.elapsed = 0;
		this.totalElapsed = 0;
	}

	pause() {
		(this as Mutable<this>).state = TimerState.Paused;
		this.token && Runtime.updates.unsubcribe(this.token);
	}

	complete() {
		(this as Mutable<this>).state = TimerState.Complete;
		this.token && Runtime.updates.unsubcribe(this.token);
		this.resolve(this.totalElapsed - this.totalDuration);
	}
}
