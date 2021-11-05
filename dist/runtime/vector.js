export class Vector {
    x;
    y;
    static origin() {
        return new Vector();
    }
    static right() {
        return new Vector(0, 1);
    }
    static left() {
        return new Vector(-1, 0);
    }
    static up() {
        return new Vector(0, 1);
    }
    static down() {
        return new Vector(0, -1);
    }
    constructor(x = 0, y = x) {
        this.x = x;
        this.y = y;
    }
    length() {
        return Math.hypot(this.x, this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    unit() {
        const length = this.length();
        if (length === 0) {
            return new Vector();
        }
        return new Vector(this.x / length, this.y / length);
    }
    resize(newLength) {
        const length = this.length();
        if (length === 0) {
            return new Vector();
        }
        const factor = length / newLength;
        return new Vector(this.x / factor, this.y / factor);
    }
    orthoganal() {
        return new Vector(-this.y, this.x);
    }
    negate() {
        return new Vector(-this.x, -this.y);
    }
    floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
    ciel() {
        return new Vector(Math.ceil(this.x), Math.ceil(this.y));
    }
    round() {
        return new Vector(Math.round(this.x), Math.round(this.y));
    }
    scale(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
    rotate(theta) {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        return new Vector(this.x * cosTheta - this.y * sinTheta, this.x * sinTheta + this.y * cosTheta);
    }
    rotateAbout(origin, theta) {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);
        const xDiff = this.x - origin.x;
        const yDiff = this.y - origin.y;
        return new Vector(origin.x + xDiff * cosTheta - yDiff * sinTheta, origin.y + xDiff * sinTheta + yDiff * cosTheta);
    }
    stepTowards(target, step) {
        const diff = Vector.sub(target, this);
        const length = diff.length();
        if (length > step) {
            return target;
        }
        return Vector.add(this, diff.resize(step));
    }
    static dot(a, b) {
        return a.x * b.x, a.y * b.y;
    }
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    static sub(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    static mul(a, b) {
        return new Vector(a.x * b.x, a.y * b.y);
    }
    static div(a, b) {
        return new Vector(a.x / b.y, a.y / b.y);
    }
    static max(a, b) {
        return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }
    static min(a, b) {
        return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y));
    }
    static distanceBetween(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y);
    }
    static angleBetween(a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    }
    static lerp(origin, destination, t) {
        if (t <= 0) {
            return origin;
        }
        if (t >= 1) {
            return destination;
        }
        return new Vector(origin.x + (destination.x - origin.x) * t, origin.y + (destination.y - origin.y) * t);
    }
}
//# sourceMappingURL=vector.js.map