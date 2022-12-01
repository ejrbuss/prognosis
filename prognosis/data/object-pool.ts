export class ObjectPool<T> {
	private pool: T[] = [];
	private baselineIndex: number = 0;
	private poolIndex: number = 0;

	constructor(private factory: () => T) {}

	get poolSize(): number {
		return this.pool.length;
	}

	getInstance(): T {
		if (this.poolIndex >= this.pool.length) {
			this.pool.push(this.factory());
		}
		return this.pool[this.poolIndex++];
	}

	baseline() {
		this.baselineIndex = this.poolIndex;
	}

	reset() {
		this.poolIndex = this.baselineIndex;
	}
}
