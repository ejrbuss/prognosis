import { Observable } from "./observable.js";

type Storeable =
	| boolean
	| number
	| string
	| Storeable[]
	| { [property: string]: Storeable };

export class Store<Type extends Storeable> extends Observable<Type> {
	constructor(readonly key: string, readonly defaultValue: Type) {
		super(defaultValue);
		const storeValue = localStorage.getItem(key);
		if (storeValue !== undefined && storeValue !== null) {
			this.value = JSON.parse(storeValue);
		}
		this.subscribe((newValue) => {
			localStorage.setItem(this.key, JSON.stringify(newValue));
		});
	}
}
