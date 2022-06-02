import "../prognosis/math.js";
import { Random } from "../prognosis/random.js";

test("Random#number", () => {
	Random.seed = 0xdead;
	expect(Random.number()).toBe(0.7752422282937914);
	expect(Random.number()).toBe(0.43577618803828955);
	expect(Random.number()).toBe(0.2772023347206414);
});

test("Random#integer", () => {
	Random.seed = 0xdead;
	for (let i = 0; i < 1000; i += 1) {
		expect(Random.integer(30, 75)).toBeLessThan(75);
		expect(Random.integer(30, 75)).toBeGreaterThanOrEqual(30);
	}
});

test("Random#choice", () => {
	Random.seed = 0xdead;
	const choices = [1, 2, 3, 4, 5];
	for (let i = 0; i < 1000; i += 1) {
		expect(choices).toContain(Random.choice(...choices));
	}
});
