import { Signal } from "../prognosis/signal.js";

test("Signal#connect", () => {
	const signal = new Signal<number>();
	let ref = 0;
	signal.send(1);
	signal.connect((data) => (ref = data));
	expect(ref).toBe(0);
	signal.send(2);
	expect(ref).toBe(2);
	signal.send(3);
	expect(ref).toBe(3);
	signal.send(4);
	signal.send(5);
	signal.send(6);
	expect(ref).toBe(6);
});

test("Signal#disconnect", () => {
	const signal = new Signal<number>();
	let ref = 0;
	const token = signal.connect((data) => (ref = data));
	signal.send(1);
	expect(ref).toBe(1);
	signal.disconnect(token);
	signal.send(2);
	expect(ref).toBe(1);
});

test("Signal#nextSignal", () => {
	const signal = new Signal<number>();
	let ref = 0;
	signal.next.then((data) => (ref = data));
	expect(ref).toBe(0);
	signal.send(1);
	// Promise will only resolve after current thread finishes
	setTimeout(() => {
		expect(ref).toBe(1);
		signal.send(2);
		expect(ref).toBe(1);
	});
});
