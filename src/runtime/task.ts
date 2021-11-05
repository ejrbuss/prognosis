export class Task extends Promise<void> {
	done: boolean = false;
	elapsedMs: number = 0;
	running: boolean = false;
	resolve!: () => void;
	reject!: (reason: any) => void;

	constructor(public update: (deltaMs: number) => unknown) {
		super((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	tryUpdate(deltaMs: number) {
		if (this.done) {
			return;
		}
		this.elapsedMs += deltaMs;
		try {
			this.update(deltaMs);
		} catch (error) {
			this.reject(error);
			this.done = true;
		}
	}
}
