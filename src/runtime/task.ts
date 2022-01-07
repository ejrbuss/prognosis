export class Task {
	done: boolean = false;
	elapsedMs: number = 0;
	running: boolean = false;
	update: (deltaMs: number) => unknown;
	completion: Promise<void>;

	constructor(update: (deltaMs: number) => unknown) {
		let taskResolve!: () => void;
		let taskReject!: (reason: any) => void;
		this.completion = new Promise((resolve, reject) => {
			taskResolve = resolve;
			taskReject = reject;
		});
		this.update = (deltaMs) => {
			if (this.done) {
				taskResolve();
				return;
			}
			try {
				this.elapsedMs += deltaMs;
				update(deltaMs);
				if (this.done) {
					taskResolve();
				}
			} catch (error) {
				taskReject(error);
				this.done = true;
			}
		};
	}
}
