// import { Easing } from "./data/easing.js";
// import { Signal, ConnectionToken } from "./signal.js";
// import { Runtime } from "./runtime.js";

// // TODO make Tweens a Node (probably just a simplification of an AnimationNode)

export interface Tweenable<Target> {
	lerp(this: Target, to: Target, progress: number): Target;
}

// type TweenableState<Target> = Partial<{
// 	[P in keyof Target]: Target[P] & (number | Tweenable<Target[P]>);
// }>;

// export type TweenProps<Target> = {
// 	duration: number;
// 	target?: Target;
// 	from?: Readonly<TweenableState<Target>>;
// 	to?: Readonly<TweenableState<Target>>;
// 	easing?: Easing;
// 	yoyo?: boolean;
// 	repeat?: number;
// 	reverse?: boolean;
// 	timeScale?: number;
// 	startPaused?: boolean;
// };

// export enum TweenState {
// 	Running = "Running",
// 	Paused = "Paused",
// 	Complete = "Complete",
// }

// export class Tween<Target> {
// 	#resolve!: () => void;
// 	#token?: ConnectionToken;
// 	#state: TweenState = TweenState.Paused;
// 	readonly completion: Promise<void>;
// 	readonly target: Target;
// 	readonly from: TweenableState<Target>;
// 	readonly to: TweenableState<Target>;
// 	readonly steps: Signal<number> = new Signal();
// 	easing: Easing;
// 	yoyo: boolean;
// 	repeat: number;
// 	reverse: boolean;
// 	timeScale: number;
// 	duration: number;
// 	elapsed: number = 0;
// 	totalElapsed: number = 0;

// 	constructor(props: TweenProps<Target>) {
// 		this.completion = new Promise((resolve) => (this.#resolve = resolve));
// 		this.easing = props.easing ?? Easing.linear;
// 		this.target = props.target as Target;
// 		this.to = props.to ?? {};
// 		this.from = props.from ?? {};
// 		this.yoyo = props.yoyo ?? false;
// 		this.reverse = props.reverse ?? false;
// 		this.timeScale = props.timeScale ?? 1;
// 		for (const key in this.from) {
// 			if (!(key in this.to)) {
// 				throw new Error(
// 					`Tweenable property "${key}" apepars in from properties but not to properties!`
// 				);
// 			}
// 		}
// 		for (const key in this.to) {
// 			if (!(key in this.from)) {
// 				this.from[key] = this.target[key] as any;
// 			}
// 		}
// 		this.yoyo = props.yoyo ?? false;
// 		this.repeat = props.repeat ?? 0;
// 		this.duration = props.duration;
// 		if (!props.startPaused) {
// 			this.start();
// 		}
// 	}

// 	get state(): TweenState {
// 		return this.#state;
// 	}

// 	get progress(): number {
// 		const t = this.easing(this.elapsed / this.duration);
// 		return this.reverse ? 1 - t : t;
// 	}

// 	get totalDuration() {
// 		return this.duration * (this.yoyo ? 1 : 2) * (1 + this.repeat);
// 	}

// 	update() {
// 		const progress = this.progress;
// 		this.steps.send(progress);
// 		for (const key in this.from) {
// 			const from = this.from[key] as any;
// 			const to = this.to[key] as any;
// 			this.target[key] = (
// 				typeof from === "number"
// 					? Math.lerp(from, to, progress)
// 					: from.lerp(to, progress)
// 			) as any;
// 		}
// 	}

// 	start() {
// 		this.#state = TweenState.Running;
// 		this.#token = Runtime.updates.connect(() => {
// 			this.elapsed += Runtime.dt * this.timeScale;
// 			this.totalElapsed += Runtime.dt * this.timeScale;
// 			while (this.elapsed >= this.duration) {
// 				this.elapsed -= this.duration;
// 				if (this.yoyo) {
// 					this.reverse = !this.reverse;
// 				}
// 			}
// 			if (this.totalElapsed < this.totalDuration) {
// 				this.update();
// 			} else {
// 				this.complete();
// 			}
// 		});
// 	}

// 	reset() {
// 		this.elapsed = 0;
// 		this.totalElapsed = 0;
// 		this.update();
// 	}

// 	pause() {
// 		this.#state = TweenState.Paused;
// 		this.#token && Runtime.updates.disconnect(this.#token);
// 	}

// 	complete() {
// 		this.#state = TweenState.Complete;
// 		this.elapsed = this.duration;
// 		this.#token && Runtime.updates.disconnect(this.#token);
// 		this.update();
// 		this.#resolve();
// 	}
// }
