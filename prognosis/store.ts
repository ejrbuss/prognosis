import { Observable } from "./observable.js";

type JsonStoreable =
	| boolean
	| number
	| string
	| JsonStoreable[]
	| { [property: string]: JsonStoreable };

export class Store<Type extends JsonStoreable> extends Observable<Type> {
	constructor(readonly key: string, readonly defaultValue: Type) {
		super(defaultValue);
		const storeValue = localStorage.getItem(key);
		if (storeValue !== undefined && storeValue !== null) {
			this.update(JSON.parse(storeValue));
		}
	}

	update(newValue: Type): void {
		super.update(newValue);
		localStorage.setItem(this.key, JSON.stringify(newValue));
	}
}
