export type JsonData =
	| boolean
	| number
	| string
	| JsonData[]
	| { [property: string]: JsonData | undefined };

export class Store<Data extends JsonData> {
	#value: Data;

	constructor(readonly key: string, readonly defaultValue: Data) {
		this.#value = defaultValue;
		this.load();
	}

	get value(): Data {
		return this.#value;
	}

	set value(data: Data) {
		this.#value = data;
		this.save();
	}

	load() {
		const storageValue = localStorage.getItem(this.key);
		if (storageValue !== null) {
			this.#value = JSON.parse(storageValue);
		}
	}

	save() {
		localStorage.setItem(this.key, JSON.stringify(this.#value));
	}
}
