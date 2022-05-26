export type Subscriber<T> = (t: T) => any;

export class SubscriptionToken {}

export class Observable<T> {
	private subscribers = new Map<SubscriptionToken, Subscriber<T>>();

	constructor(private currentValue: T | undefined = undefined) {}

	update(nextValue: T) {
		this.currentValue = nextValue;
		for (const subscriber of this.subscribers.values()) {
			subscriber(this.currentValue);
		}
	}

	poll(): T | undefined {
		return this.currentValue;
	}

	subscribe(subscriber: Subscriber<T>): SubscriptionToken {
		const subscriptionToken = new SubscriptionToken();
		this.subscribers.set(subscriptionToken, subscriber);
		if (this.currentValue !== undefined) {
			subscriber(this.currentValue);
		}
		return subscriptionToken;
	}

	unsubcribe(subscriptionToken: SubscriptionToken): boolean {
		return this.subscribers.delete(subscriptionToken);
	}
}
