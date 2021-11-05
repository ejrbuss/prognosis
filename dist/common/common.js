export const Epsilon = 0.000001;
let seed = 0;
export function random() {
    // https://en.wikipedia.org/wiki/Linear_congruential_generator
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
}
export function shuffle(unshuffled) {
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
export function choose(choices) {
    return choices[Math.floor(random() * choices.length)];
}
export function doTimes(n, fn) {
    for (let i = 0; i < n; i += 1) {
        fn(i);
    }
}
export function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
}
export function sign(value) {
    return value < 0 ? -1 : 1;
}
export function lerp(inital, final, t) {
    if (t <= 0) {
        return inital;
    }
    if (t >= 1) {
        return final;
    }
    return inital + (final - inital) * t;
}
export function range(begin, end, step) {
    const array = [];
    if (end === undefined) {
        end = begin;
        begin = 0;
    }
    if (begin < end) {
        step = step ?? 1;
        for (let n = begin; n < end; n += step) {
            array.push(n);
        }
    }
    else {
        step = step ?? -1;
        for (let n = begin; n > end; n += step) {
            array.push(n);
        }
    }
    return array;
}
export function repeat(value, length) {
    const array = [];
    while (array.length < length) {
        array.push(value);
    }
    return array;
}
export function flatRepeat(values, length) {
    const array = [];
    while (array.length < length) {
        array.push(...values);
    }
    return array;
}
export function insertTab(text, tab = "\t") {
    return text.replace(/(^|\n)/g, `$1${tab}`);
}
export function equiv(a, b, epsilon = Epsilon) {
    if (a === b) {
        return true;
    }
    const typeofA = typeof a;
    if (typeofA !== typeof b) {
        return false;
    }
    if (typeofA === "number") {
        return Math.abs(a - b) < epsilon;
    }
    if (a === null ||
        b === null ||
        typeofA !== "object" ||
        a.constructor !== b.constructor) {
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
export async function fetchJson(url) {
    const response = await fetch(url);
    return await response.json();
}
export async function fetchText(url) {
    const response = await fetch(url);
    return await response.text();
}
export async function importFromRoot(url) {
    return await import(`../../${url}`);
}
export class Deferred extends Promise {
    input;
    resolve;
    reject;
    constructor(input) {
        super((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        this.input = input;
    }
}
export class FailedAssertion extends Error {
}
export class Cancelled extends Error {
}
//# sourceMappingURL=common.js.map