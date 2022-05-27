import { Easing, Easings } from "./easings.js";
import { Runtime } from "./runtime.js";
import { Time } from "./time.js";

export type TweenOptions = {
	duration: number;
	easing: Easing;
	step?: (progress: number) => unknown;
};

export class Tween extends Promise<void> {
	constructor(readonly options: TweenOptions) {
		let thisResolve!: () => void;
		let thisReject!: (error: any) => void;
		super((resolve, reject) => {
			thisResolve = resolve;
			thisReject = reject;
		});
		const easing = options.easing ?? Easings.linear;
		try {
			options.step && options.step(easing(0));
		} catch (error) {
			thisReject(error);
		}
		const start = Time.now;
		const token = Runtime.updates.subscribe(() => {
			try {
				const progress = Math.min(1, (Time.now - start) / options.duration);
				options.step && options.step(easing(progress));
				if (progress === 1) {
					Runtime.updates.unsubcribe(token);
					thisResolve();
				}
			} catch (error) {
				Runtime.updates.unsubcribe(token);
				thisReject(error);
			}
		});
	}
}
