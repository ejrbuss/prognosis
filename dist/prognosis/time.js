const TimeClass = class Time {
    now = performance.now();
    dt = 0;
    update() {
        const newNow = performance.now() / 1000;
        this.dt = newNow - this.now;
        this.now = newNow;
    }
};
export const Time = new TimeClass();
//# sourceMappingURL=time.js.map