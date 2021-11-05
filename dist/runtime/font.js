export var Alignment;
(function (Alignment) {
    Alignment["Left"] = "Left";
    Alignment["Center"] = "Center";
    Alignment["Right"] = "Right";
    Alignment["Justify"] = "Justify";
})(Alignment || (Alignment = {}));
export class Font {
    family;
    style;
    size;
    alignment;
    constructor(family, style, size, alignment) {
        this.family = family;
        this.style = style;
        this.size = size;
        this.alignment = alignment;
    }
}
//# sourceMappingURL=font.js.map