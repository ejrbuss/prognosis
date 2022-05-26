export class Deferred {
    acceptors = [];
    catchers = [];
    isComplete = false;
    isAborted = false;
    result;
    error;
    static fromPromise(promise) {
        const deferred = new Deferred();
        promise.then((result) => deferred.complete(result));
        promise.catch((error) => deferred.abort(error));
        return deferred;
    }
    complete(result) {
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
    abort(error) {
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
    dependOn(operation, ...args) {
        try {
            return operation(...args);
        }
        catch (error) {
            this.abort(error);
            throw error;
        }
    }
    then(onSuccess, onFail) {
        if (this.isComplete) {
            onSuccess(this.result);
        }
        this.acceptors.push(onSuccess);
        if (onFail) {
            this.catch(onFail);
        }
    }
    catch(onFail) {
        if (this.isAborted) {
            onFail(this.error);
        }
        this.catchers.push(onFail);
    }
    finally(callback) {
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
//# sourceMappingURL=deferred.js.map