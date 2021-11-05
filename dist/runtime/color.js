export class Color {
    red;
    green;
    blue;
    alpha;
    static White = new Color(1, 1, 1);
    constructor(red, green, blue, alpha = 1) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}
//# sourceMappingURL=color.js.map