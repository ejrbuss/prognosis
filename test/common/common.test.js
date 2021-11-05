import { choose, clamp, doTimes, flatRepeat, insertTab, lerp, random, range, repeat, shuffle, sign, } from "../../src/common/common.js";
import { assertEquiv, assertEquals, assertTrue, test, assertNotEquiv, } from "../test.js";
test("random", () => {
    const generated = new Set();
    doTimes(10, () => {
        const n = random();
        assertTrue(n >= 0);
        assertTrue(n < 1);
        assertTrue(!generated.has(n));
        generated.add(n);
    });
});
test("shuffle", () => {
    assertEquiv([], shuffle([]));
    assertEquiv([1], shuffle([1]));
    const deck = range(52);
    const shuffledDeck = shuffle(deck);
    shuffle(shuffledDeck);
    assertNotEquiv(deck, shuffledDeck);
    assertEquals(deck.length, shuffledDeck.length);
    shuffledDeck.forEach((card) => {
        assertTrue(deck.includes(card));
    });
});
test("choose", () => {
    assertEquals(undefined, choose([]));
    assertEquals(2, choose([2]));
    const choices = range(1000);
    const chosen = new Set();
    doTimes(10, () => {
        const choice = choose(choices);
        assertTrue(choices.includes(choice));
        assertTrue(!chosen.has(choice));
        chosen.add(choice);
    });
});
test("doTimes", () => {
    let counter = 0;
    doTimes(10, (n) => (counter += n));
    assertEquals(45, counter);
});
test("clamp", () => {
    assertEquals(1, clamp(1, 0, 2));
    assertEquals(0, clamp(-0.5, 0, 2));
    assertEquals(2, clamp(1300, 0, 2));
});
test("sign", () => {
    assertEquals(1, sign(145));
    assertEquals(-1, sign(-0.1));
});
test("lerp", () => {
    assertEquiv(50, lerp(0, 100, 0.5));
    assertEquiv(-44.2, lerp(-1, -55, 0.8));
});
test("range", () => {
    assertEquiv([0, 1, 2, 3], range(4));
    assertEquiv([4, 3, 2, 1], range(4, 0));
    assertEquiv([0, 0.1, 0.2, 0.3], range(0, 0.4, 0.1));
});
test("repeat", () => {
    assertEquiv([1, 1, 1, 1], repeat(1, 4));
});
test("flatRepeat", () => {
    assertEquiv([1, 1, 1, 1, 1, 1], flatRepeat([1, 1], 5));
});
test("insertTab", () => {
    assertEquals("\ta\n\tb", insertTab("a\nb"));
    assertEquals("  a\n  b", insertTab("a\nb", "  "));
});
test("equiv", () => {
    assertEquiv(true, true);
    assertEquiv(1, 1.0000000003);
    assertEquiv([1, 2, 3, 4], [1, 2, 3, 4]);
    assertEquiv({ x: 1, y: 4 }, { x: 1, y: 4 });
    assertEquiv(new Set([1, 2, 3, 4]), new Set([4, 3, 2, 1]));
    assertEquiv(new Map([
        [1, 2],
        [3, 4],
    ]), new Map([
        [3, 4],
        [1, 2],
    ]));
    assertNotEquiv(true, false);
    assertNotEquiv(2, 2.01);
    assertNotEquiv([1, 2, 3, 4], [1, 2, 3, 4, 5]);
    assertNotEquiv({ x: 1, y: 4 }, { x: 1, y: 5 });
    assertNotEquiv(new Set([1, 2, 3, 4]), [1, 2, 3, 4]);
});
//# sourceMappingURL=common.test.js.map