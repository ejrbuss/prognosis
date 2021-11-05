import { Color } from "./color.js";
export class Graphics {
    currentTransform;
    transformStack;
    render(scene) { }
    getCurrentTransform() {
        return undefined;
    }
    pushTransform(transform) { }
    popTransform() {
        return undefined;
    }
    drawLines(points, color) { }
    drawTriangle(p1, p2, p3, color) { }
    drawRectangle(position, dimensions, color) { }
    drawTexture(position, dimensions, texture, tint = Color.White) { }
    drawText(position, text, font) { }
}
//# sourceMappingURL=graphics.js.map