export type Subscriber<T> = (newValue: T, lastValue?: T) => any;

export class Token {}

export class Observable<Type> {
	#value: Type;
	#subscribers: Map<Token, Subscriber<Type>> = new Map();

	constructor(value?: Type) {
		this.#value = value as Type;
	}

	get nextUpdate(): Promise<Type> {
		return new Promise((resolve) => {
			const token = this.subscribe((value) => {
				this.unsubcribe(token);
				resolve(value);
			});
		});
	}

	get value(): Type {
		return this.#value;
	}

	set value(newValue: Type) {
		const lastValue = this.#value;
		this.#value = newValue;
		this.#subscribers.forEach((subscriber) => subscriber(newValue, lastValue));
	}

	update() {
		this.#subscribers.forEach((subscriber) =>
			subscriber(this.#value, this.#value)
		);
	}

	map(transform: (value: Type) => Type) {
		this.value = transform(this.value);
	}

	subscribe(subscriber: Subscriber<Type>): Token {
		const token = new Token();
		this.#subscribers.set(token, subscriber);
		return token;
	}

	unsubcribe(token: Token): boolean {
		return this.#subscribers.delete(token);
	}
}
