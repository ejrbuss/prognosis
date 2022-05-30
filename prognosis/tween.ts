import { Easing } from "./easing.js";
import { Observable, Token } from "./observable.js";
import { Runtime } from "./runtime.js";
import { Mutable } from "./util.js";

export interface Tweenable<Target> {
	lerp(this: Target, to: Target, progress: number): Target;
}

type TweenableProperties<Target> = Partial<{
	[P in keyof Target]: Target[P] & (number | Tweenable<Target[P]>);
}>;

export type TweenOptions<Target> = {
	duration: number;
	target?: Target;
	from?: Readonly<TweenableProperties<Target>>;
	to?: Readonly<TweenableProperties<Target>>;
	easing?: Easing;
	yoyo?: boolean;
	repeat?: number;
	reverse?: boolean;
	timeScale?: number;
	startPaused?: boolean;
};

export enum TweenState {
	Running = "Running",
	Paused = "Paused",
	Complete = "Complete",
}

export class Tween<Target> {
	private resolve!: () => void;
	private token?: Token;
	readonly completion: Promise<void>;
	readonly target: Target;
	readonly from: TweenableProperties<Target>;
	readonly to: TweenableProperties<Target>;
	readonly steps: Observable<number> = new Observable();
	readonly state: TweenState = TweenState.Paused;
	easing: Easing;
	yoyo: boolean;
	repeat: number;
	reverse: boolean;
	timeScale: number;
	duration: number;
	elapsed: number = 0;
	totalElapsed: number = 0;

	constructor(options: TweenOptions<Target>) {
		this.completion = new Promise((resolve) => (this.resolve = resolve));
		this.easing = options.easing ?? Easing.linear;
		this.target = options.target as Target;
		this.to = options.to ?? {};
		this.from = options.from ?? {};
		this.yoyo = options.yoyo ?? false;
		this.reverse = options.reverse ?? false;
		this.timeScale = options.timeScale ?? 1;
		for (const key in this.from) {
			if (!(key in this.to)) {
				throw new Error(
					`Tweenable property "${key}" apepars in from properties but not to properties!`
				);
			}
		}
		for (const key in this.to) {
			if (!(key in this.from)) {
				this.from[key] = this.target[key] as any;
			}
		}
		this.yoyo = options.yoyo ?? false;
		this.repeat = options.repeat ?? 0;
		this.duration = options.duration;
		if (!options.startPaused) {
			this.start();
		}
	}

	get progress(): number {
		const t = this.easing(this.elapsed / this.duration);
		return this.reverse ? 1 - t : t;
	}

	get totalDuration() {
		return this.duration * (this.yoyo ? 1 : 2) * (1 + this.repeat);
	}

	update() {
		const progress = this.progress;
		this.steps.update(progress);
		for (const key in this.from) {
			const from = this.from[key] as any;
			const to = this.to[key] as any;
			this.target[key] = (
				typeof from === "number"
					? Math.lerp(from, to, progress)
					: from.lerp(to, progress)
			) as any;
		}
	}

	start() {
		(this as Mutable<this>).state = TweenState.Running;
		this.token = Runtime.updates.subscribe(() => {
			this.elapsed += Runtime.dt * this.timeScale;
			this.totalElapsed += Runtime.dt * this.timeScale;
			while (this.elapsed >= this.duration) {
				this.elapsed -= this.duration;
				if (this.yoyo) {
					this.reverse = !this.reverse;
				}
			}
			if (this.totalElapsed < this.totalDuration) {
				this.update();
			} else {
				this.complete();
			}
		});
	}

	reset() {
		this.elapsed = 0;
		this.totalElapsed = 0;
		this.update();
	}

	pause() {
		(this as Mutable<this>).state = TweenState.Paused;
		this.token && Runtime.updates.unsubcribe(this.token);
	}

	complete() {
		(this as Mutable<this>).state = TweenState.Complete;
		this.elapsed = this.duration;
		this.token && Runtime.updates.unsubcribe(this.token);
		this.update();
		this.resolve();
	}
}
