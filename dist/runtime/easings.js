// https://easings.net/
export function linear(t) {
    return t;
}
export function easeInSine(t) {
    return 1 - Math.cos((t * Math.PI) / 2);
}
export function easeOutSine(t) {
    return Math.sin((t * Math.PI) / 2);
}
export function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
}
export function easeInQuad(t) {
    return t * t;
}
export function easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t);
}
export function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
export function easeInCubic(t) {
    return t * t * t;
}
export function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}
export function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
export function easeInQuart(t) {
    return t * t * t * t;
}
export function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
}
export function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}
export function easeInQuint(t) {
    return t * t * t * t * t;
}
export function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
}
export function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}
export function easeInEtpo(t) {
    return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
}
export function easeOutEtpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
export function easeInOutEtpo(t) {
    return t === 0
        ? 0
        : t === 1
            ? 1
            : t < 0.5
                ? Math.pow(2, 20 * t - 10) / 2
                : (2 - Math.pow(2, -20 * t + 10)) / 2;
}
export function easeInCirc(t) {
    return 1 - Math.sqrt(1 - Math.pow(t, 2));
}
export function easeOutCirc(t) {
    return Math.sqrt(1 - Math.pow(t - 1, 2));
}
export function easeInOutCirc(t) {
    return t < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
}
export function easeInBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
}
export function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
export function easeInOutBack(t) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
}
export function easeInElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
        ? 0
        : t === 1
            ? 1
            : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
}
export function easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
        ? 0
        : t === 1
            ? 1
            : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
}
export function easeInOutElastic(t) {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0
        ? 0
        : t === 1
            ? 1
            : t < 0.5
                ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
}
export function easeInBounce(t) {
    return 1 - easeOutBounce(1 - t);
}
export function easeOutBounce(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
        return n1 * t * t;
    }
    else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    }
    else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    }
    else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}
export function easeInOutBounce(t) {
    return t < 0.5
        ? (1 - easeOutBounce(1 - 2 * t)) / 2
        : (1 + easeOutBounce(2 * t - 1)) / 2;
}
//# sourceMappingURL=easings.js.map