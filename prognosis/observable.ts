export type ObservableProperties<T> = { [P in keyof T]: Observable<T[P]> };

export type Subscriber<T> = (newValue: T, lastValue?: T) => any;

export class Token {}

export class Observable<T> {
	subscribers: [Subscriber<T>, Token][] = [];
	value?: T;

	constructor(value?: T) {
		this.value = value;
	}

	update(newValue: T) {
		const lastValue = this.value;
		this.value = newValue;
		this.subscribers.forEach(([sub, _]) => sub(newValue, lastValue));
	}

	subscribe(subscriber: Subscriber<T>): Token {
		const token = new Token();
		this.subscribers.push([subscriber, token]);
		if (this.value !== undefined) {
			subscriber(this.value as T);
		}
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
