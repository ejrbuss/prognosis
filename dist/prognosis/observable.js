export class SubscriptionToken {
}
export class Observable {
    currentValue;
    subscribers = new Map();
    constructor(currentValue = undefined) {
        this.currentValue = currentValue;
    }
    update(nextValue) {
        this.currentValue = nextValue;
        for (const subscriber of this.subscribers.values()) {
            subscriber(this.currentValue);
        }
    }
    poll() {
        return this.currentValue;
    }
    subscribe(subscriber) {
        const subscriptionToken = new SubscriptionToken();
        this.subscribers.set(subscriptionToken, subscriber);
        if (this.currentValue !== undefined) {
            subscriber(this.currentValue);
        }
        return subscriptionToken;
    }
    unsubcribe(subscriptionToken) {
        return this.subscribers.delete(subscriptionToken);
    }
}
//# sourceMappingURL=observable.js.map