export type Subscriber<T> = (newValue: T, lastValue?: T) => any;

export class Token {}

export class Observable<Target> {
	subscribers: [Subscriber<Target>, Token][] = [];
	value: Target;

	constructor(value?: Target) {
		this.value = value as Target;
	}

	get nextUpdate(): Promise<Target> {
		return new Promise((resolve) => {
			const token = this.subscribe((value) => {
				this.unsubcribe(token);
				resolve(value);
			});
		});
	}

	update(newValue: Target) {
		const lastValue = this.value;
		this.value = newValue;
		this.subscribers.forEach(([sub, _]) => sub(newValue, lastValue));
	}

	subscribe(subscriber: Subscriber<Target>): Token {
		const token = new Token();
		this.subscribers.push([subscriber, token]);
		return token;
	}

	unsubcribe(tokenToUnsubscribe: Token): boolean {
		const index = this.subscribers.findIndex(
			([_, token]) => token === tokenToUnsubscribe
		);
		if (index >= 0) {
			this.subscribers.splice(index, 1);
			return true;
		}
		return false;
	}
}
