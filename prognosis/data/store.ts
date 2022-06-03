import { Signal } from "../signal.js";

export type Storeable =
	| boolean
	| number
	| string
	| Storeable[]
	| { [property: string]: Storeable };

export class Store<Data extends Storeable> {
	#data: Data;
	readonly change: Signal<Data> = new Signal();

	constructor(readonly key: string, readonly defaultValue: Data) {
		this.#data = defaultValue;
		this.load();
	}

	get data(): Data {
		return this.#data;
	}

	set data(data: Data) {
		this.#data = data;
		this.save();
	}

	load() {
		const storageValue = localStorage.getItem(this.key);
		if (storageValue !== null) {
			this.#data = JSON.parse(storageValue);
		}
	}

	save() {
		localStorage.setItem(this.key, JSON.stringify(this.#data));
	}
}
