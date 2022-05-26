const TimeClass = class Time {
	now: number = 0;
	dt: number = 0;

	start() {
		this.now = performance.now() / 1000;
	}

	update() {
		const newNow = performance.now() / 1000;
		this.dt = newNow - this.now;
		this.now = newNow;
	}
};

export const Time = new TimeClass();
