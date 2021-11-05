export class Task extends Promise {
    update;
    done = false;
    elapsedMs = 0;
    running = false;
    resolve;
    reject;
    constructor(update) {
        super((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.update = update;
    }
    tryUpdate(deltaMs) {
        if (this.done) {
            return;
        }
        this.elapsedMs += deltaMs;
        try {
            this.update(deltaMs);
        }
        catch (error) {
            this.reject(error);
            this.done = true;
        }
    }
}
//# sourceMappingURL=task.js.map