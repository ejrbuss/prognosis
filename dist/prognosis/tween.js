import { Deferred } from "./deferred.js";
import { Runtime } from "./runtime.js";
import { Time } from "./time.js";
export class Tween extends Deferred {
    options;
    // TODO migrate renderEvents to updateEvents
    constructor(options) {
        super();
        this.options = options;
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
//# sourceMappingURL=tween.js.map