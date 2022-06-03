export type SignalHandler<Data> = (data: Data) => any;

export class ConnectionToken {}

export class Signal<Data = void> {
	#handlers: Map<ConnectionToken, SignalHandler<Data>> = new Map();

	send(data: Data) {
		this.#handlers.forEach((handler) => handler(data));
	}

	connect(handler: SignalHandler<Data>): ConnectionToken {
		const token = new ConnectionToken();
		this.#handlers.set(token, handler);
		return token;
	}

	disconnect(token: ConnectionToken): boolean {
		return this.#handlers.delete(token);
	}

	get next(): Promise<Data> {
		return new Promise((resolve) => {
			const token = this.connect((value) => {
				this.disconnect(token);
				resolve(value);
			});
		});
	}
}
