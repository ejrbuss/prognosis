function componentToInt(component) {
    return Math.floor(component * 255);
}
function componentToHex(component) {
    const hex = componentToInt(component).toString(0x10);
    return hex.length === 1 ? `0${hex}` : hex;
}
export class Color {
    red;
    green;
    blue;
    alpha;
    constructor(red = 0, green = red, blue = green, alpha = 1) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
    hex() {
        const rr = componentToHex(this.red);
        const gg = componentToHex(this.green);
        const bb = componentToHex(this.blue);
        return `#${rr}${gg}${bb}`;
    }
    rgba() {
        const rr = componentToInt(this.red);
        const gg = componentToInt(this.green);
        const bb = componentToInt(this.blue);
        return `rgba(${rr}, ${gg}, ${bb}, ${this.alpha})`;
    }
}
//# sourceMappingURL=color.js.map