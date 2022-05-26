import { Deferred } from "./deferred.js";
import { Runtime } from "./runtime.js";
import { Time } from "./time.js";

export type TweenOptions = {
	duration: number;
	step?: (progress: number) => unknown;
	onStart?: () => unknown;
	onEnd?: () => unknown;
};

export class Tween extends Deferred<void> {
	// TODO migrate renderEvents to updateEvents
	constructor(readonly options: TweenOptions) {
		super();
		options.onStart && this.dependOn(options.onStart);
		options.step && this.dependOn(options.step, 0);
		const start = Time.now;
		const token = Runtime.renderEvents.subscribe(() => {
			const progress = Math.min(1, (Time.now - start) / options.duration);
			options.step && this.dependOn(options.step, progress);
			if (progress === 1) {
				Runtime.renderEvents.unsubcribe(token);
				options.onEnd && this.dependOn(options.onEnd);
				this.complete();
			}
		});
		this.catch(() => Runtime.renderEvents.unsubcribe(token));
	}
}
