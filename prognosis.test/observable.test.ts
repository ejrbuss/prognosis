import { Observable } from "../prognosis/observable.js";

test("Observable#value", () => {
	const o = new Observable(42);
	expect(o.value).toBe(42);
});

test("Observable#update", () => {
	const o = new Observable(42);
	expect(o.value).toBe(42);
	o.update(12);
	expect(o.value).toBe(12);
});

test("Observable#subscribe", () => {
	const o = new Observable(1);
	let ref = 0;
	o.subscribe((value) => (ref = value));
	expect(ref).toBe(1);
	o.update(2);
	expect(ref).toBe(2);
});

test("Observable#unsubscribe", () => {
	const o = new Observable<number>();
	let ref = 0;
	const token = o.subscribe((value) => (ref = value));
	expect(ref).toBe(0);
	o.update(2);
	o.unsubcribe(token);
	o.update(4);
	expect(ref).toBe(2);
});
