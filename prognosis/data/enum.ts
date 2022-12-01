export abstract class Enum {
	static values<E extends typeof Enum>(this: E): InstanceType<E>[] {
		return ((this as any)._values = (this as any)._values ?? []);
	}

	static valueOf<E extends typeof Enum>(
		this: E,
		name: string
	): InstanceType<E> | undefined {
		return this.values().find((value) => value.name === name);
	}

	readonly name: string;
	readonly ordinal: number;

	constructor(name: string) {
		const values = Enum.values.call(this.constructor as any);
		this.name = name;
		this.ordinal = values.length;
		values.push(this);
	}
}

class Priority extends Enum {
	static Low = new Priority("Low");
	static Medium = new Priority("Medium");
	static High = new Priority("High");
}

const p = Priority.Low;
const ps = Priority.values();
const p2 = Priority.valueOf("Low");
