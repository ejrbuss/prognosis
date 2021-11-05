export var Editor;
(function (Editor) {
    // vec2Input
    // vec3Input
    // numericInput(min, max, step)
    // sliderInput(min, max, step)
    // dropdownInput(...options)
    // textInput
    // colorInput
    // fontInput
    // eventInput
    // entityInput
    // componentInput
    // behaviourInput
    // textureInput
    // audioInput
    function numericInput(min = 0, max = Infinity, step = 1) {
        return function (target, propertyKey) { };
    }
    Editor.numericInput = numericInput;
    function sliderInput(min = 0, max = 100, step = 1) {
        return function (target, propertyKey) { };
    }
    Editor.sliderInput = sliderInput;
    function booleanInput() {
        return function (target, propertyKey) { };
    }
    Editor.booleanInput = booleanInput;
    function signalInput() {
        return function (target, propertyKey) { };
    }
    Editor.signalInput = signalInput;
})(Editor || (Editor = {}));
//# sourceMappingURL=editorIntegration.js.map