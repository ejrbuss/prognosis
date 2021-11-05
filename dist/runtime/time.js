import { Runtime } from "./runtime.js";
import { Task } from "./task.js";
export function delay(durationMs) {
    const task = new Task(() => {
        task.done = task.elapsedMs >= durationMs;
    });
    Runtime.schedule(task);
    return task;
}
export class Timer {
    timerUpdate;
    periodMs;
    initialDelayMs;
    repeat;
    repeatCount;
    task;
    nextUpdateMs;
    constructor(options, timerUpdate) {
        this.timerUpdate = timerUpdate;
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
export class Tween {
}
//# sourceMappingURL=time.js.map