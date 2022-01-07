export type ClassOf<T> = { new (...args: unknown[]): T };

export const Epsilon = 0.000001;

let seed = 0;

export function random() {
	// https://en.wikipedia.org/wiki/Linear_congruential_generator
	seed = (seed * 9301 + 49297) % 233280;
	return seed / 233280;
}

export function shuffle<T>(unshuffled: T[]): T[] {
	const shuffled = unshuffled.slice();
	const length = shuffled.length;
	for (let i = 0; i < length; i += 1) {
		const j = Math.floor(random() * (i + 1));
		const temp = shuffled[i];
		shuffled[i] = shuffled[j];
		shuffled[j] = temp;
	}
	return shuffled;
}

export function choose<T>(choices: T[]): T {
	return choices[Math.floor(random() * choices.length)];
}

export function doTimes(n: number, fn: (i: number) => unknown) {
	for (let i = 0; i < n; i += 1) {
		fn(i);
	}
}

export function clamp(value: number, min: number, max: number): number {
	return value < min ? min : value > max ? max : value;
}

export function sign(value: number): number {
	return value < 0 ? -1 : 1;
}

export function lerp(inital: number, final: number, t: number): number {
	if (t <= 0) {
		return inital;
	}
	if (t >= 1) {
		return final;
	}
	return inital + (final - inital) * t;
}

export function range(begin: number, end?: number, step?: number): number[] {
	const array: number[] = [];
	if (end === undefined) {
		end = begin;
		begin = 0;
	}
	if (begin < end) {
		step = step ?? 1;
		for (let n = begin; n < end; n += step) {
			array.push(n);
		}
	} else {
		step = step ?? -1;
		for (let n = begin; n > end; n += step) {
			array.push(n);
		}
	}
	return array;
}

export function repeat<T>(value: T, length: number): T[] {
	const array: T[] = [];
	while (array.length < length) {
		array.push(value);
	}
	return array;
}

export function flatRepeat<T>(values: T[], length: number): T[] {
	const array: T[] = [];
	while (array.length < length) {
		array.push(...values);
	}
	return array;
}

export function insertTab(text: string, tab: string = "\t"): string {
	return text.replace(/(^|\n)/g, `$1${tab}`);
}

export function equiv(a: any, b: any, epsilon: number = Epsilon): boolean {
	if (a === b) {
		return true;
	}
	const typeofA = typeof a;
	if (typeofA !== typeof b) {
		return false;
	}
	if (typeofA === "number") {
		return Math.abs((a as number) - (b as number)) < epsilon;
	}
	if (
		a === null ||
		b === null ||
		typeofA !== "object" ||
		a.constructor !== b.constructor
	) {
		return false;
	}
	if (a instanceof Set) {
		if (a.size !== b.size) {
			return false;
		}
		for (const value of a) {
			if (!b.has(value)) {
				return false;
			}
		}
		return true;
	}
	if (a instanceof Map) {
		if (a.size !== b.size) {
			return false;
		}
		for (const [key, value] of a) {
			if (!equiv(value, b.get(key), epsilon)) {
				return false;
			}
		}
		return true;
	}
	const aKeys = Object.keys(a);
	const bKeys = Object.keys(b);
	const length = aKeys.length;
	if (length !== bKeys.length) {
		return false;
	}
	for (let i = 0; i < length; i += 1) {
		const key = aKeys[i];
		if (!equiv(a[key], b[key], epsilon)) {
			return false;
		}
	}
	return true;
}

export async function fetchJson(url: string): Promise<unknown> {
	const response = await fetch(url);
	return await response.json();
}

export async function fetchText(url: string): Promise<string> {
	const response = await fetch(url);
	return await response.text();
}

export async function importFromRoot(url: string): Promise<unknown> {
	return await import(`../../${url}`);
}

export interface DeferredPromise<T> extends Promise<T> {
	resolve: (value: T) => void;
	reject: (reason: any) => void;
}

export function deferredPromise<T>(): DeferredPromise<T> {
	const deferredPromise = new Promise((resolve, reject) => {
		deferredPromise.resolve = resolve;
		deferredPromise.reject = reject;
	}) as DeferredPromise<T>;
	return deferredPromise;
}

export class Cancelled extends Error {}
