type Acceptor<T> = (result: T) => unknown;
type Catcher = (error: unknown) => unknown;

export class Deferred<T> {
	acceptors: Acceptor<T>[] = [];
	catchers: Catcher[] = [];
	isComplete: boolean = false;
	isAborted: boolean = false;
	result?: T;
	error?: unknown;

	static fromPromise<T>(promise: Promise<T>): Deferred<T> {
		const deferred = new Deferred<T>();
		promise.then((result) => deferred.complete(result));
		promise.catch((error) => deferred.abort(error));
		return deferred;
	}

	complete(result: T) {
		if (this.isComplete) {
			throw new Error("Deferred was already completed!");
		}
		if (this.isAborted) {
			throw new Error("Deferred was already aborted!");
		}
		this.result = result;
		this.acceptors.forEach((acceptor) => acceptor(result));
		this.isComplete = true;
	}

	abort(error: unknown) {
		if (this.isComplete) {
			throw new Error("Deferred was already completed!");
		}
		if (this.isAborted) {
			throw new Error("Deferred was already aborted!");
		}
		this.error = error;
		this.catchers.forEach((catcher) => catcher(error));
		this.isComplete = true;
	}

	dependOn<T extends any[], R>(operation: (...args: T) => R, ...args: T): R {
		try {
			return operation(...args);
		} catch (error) {
			this.abort(error);
			throw error;
		}
	}

	then(onSuccess: Acceptor<T>, onFail?: Catcher) {
		if (this.isComplete) {
			onSuccess(this.result as T);
		}
		this.acceptors.push(onSuccess);
		if (onFail) {
			this.catch(onFail);
		}
	}

	catch(onFail: Catcher) {
		if (this.isAborted) {
			onFail(this.error);
		}
		this.catchers.push(onFail);
	}

	finally(callback: () => void) {
		if (this.isComplete) {
			callback();
		}
		if (this.isAborted) {
			callback();
		}
		this.acceptors.push(callback);
		this.catchers.push(callback);
	}
}
