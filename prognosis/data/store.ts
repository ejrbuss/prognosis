export type JsonData =
	| boolean
	| number
	| string
	| JsonData[]
	| { [property: string]: JsonData | undefined };

export class Store<Data extends JsonData> {
	value: Data;

	constructor(readonly key: string, readonly defaultValue: Data) {
		this.value = defaultValue;
		this.load();
	}

	load() {
		const storageValue = localStorage.getItem(this.key);
		if (storageValue !== null) {
			this.value = JSON.parse(storageValue);
		}
	}

	save() {
		localStorage.setItem(this.key, JSON.stringify(this.value));
	}
}
