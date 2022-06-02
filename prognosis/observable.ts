export type Subscriber<T> = (newValue: T, lastValue?: T) => any;

export class Token {}

export class Observable<Type> {
	subscribers: [Subscriber<Type>, Token][] = [];
	value: Type;

	constructor(value?: Type) {
		this.value = value as Type;
	}

	get nextUpdate(): Promise<Type> {
		return new Promise((resolve) => {
			const token = this.subscribe((value) => {
				this.unsubcribe(token);
				resolve(value);
			});
		});
	}

	update(newValue: Type) {
		const lastValue = this.value;
		this.value = newValue;
		this.subscribers.forEach(([sub, _]) => sub(newValue, lastValue));
	}

	map(transform: (value: Type) => Type) {
		this.update(transform(this.value));
	}

	subscribe(subscriber: Subscriber<Type>): Token {
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
