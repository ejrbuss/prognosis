var Key;
(function (Key) {
    Key["Escape"] = "Escape";
    Key["Control"] = "Control";
    Key["Alt"] = "Alt";
    Key["Meta"] = "Meta";
    Key["Shift"] = "Shift";
    Key["Tab"] = "Tab";
    Key["Space"] = "Space";
    Key["Backspace"] = "Backspace";
    Key["Enter"] = "Enter";
    Key["Num1"] = "Num1";
    Key["Num2"] = "Num2";
    Key["Num3"] = "Num3";
    Key["Num4"] = "Num4";
    Key["Num5"] = "Num5";
    Key["Num6"] = "Num6";
    Key["Num7"] = "Num7";
    Key["Num8"] = "Num8";
    Key["Num9"] = "Num9";
    Key["Num0"] = "Num0";
    Key["Q"] = "Q";
    Key["W"] = "W";
    Key["E"] = "E";
    Key["R"] = "R";
    Key["T"] = "T";
    Key["Y"] = "Y";
    Key["U"] = "U";
    Key["I"] = "I";
    Key["O"] = "O";
    Key["P"] = "P";
    Key["A"] = "A";
    Key["S"] = "S";
    Key["D"] = "D";
    Key["F"] = "F";
    Key["G"] = "G";
    Key["H"] = "H";
    Key["J"] = "J";
    Key["K"] = "K";
    Key["L"] = "L";
    Key["Z"] = "Z";
    Key["X"] = "X";
    Key["C"] = "C";
    Key["V"] = "V";
    Key["B"] = "B";
    Key["N"] = "N";
    Key["M"] = "M";
    Key["Tick"] = "Tick";
    Key["Comma"] = "Comma";
    Key["Period"] = "Period";
    Key["Slash"] = "Slash";
    Key["Semicolon"] = "Semicolon";
    Key["Quote"] = "Quote";
    Key["LeftBracket"] = "LeftBracket";
    Key["RightBracket"] = "RightBracket";
    Key["Backslash"] = "Backslash";
    Key["Dash"] = "Dash";
    Key["Equals"] = "Equals";
    Key["Left"] = "Left";
    Key["Right"] = "Right";
    Key["Up"] = "Up";
    Key["Down"] = "Down";
})(Key || (Key = {}));
const EventKeyToKey = {
    " ": Key.Space,
    "!": Key.Num1,
    "@": Key.Num2,
    "#": Key.Num3,
    $: Key.Num4,
    "%": Key.Num5,
    "^": Key.Num6,
    "&": Key.Num7,
    "*": Key.Num8,
    "(": Key.Num9,
    ")": Key.Num0,
    "`": Key.Tick,
    "~": Key.Tick,
    "-": Key.Dash,
    _: Key.Dash,
    ",": Key.Comma,
    "<": Key.Comma,
    ".": Key.Period,
    ">": Key.Period,
    "/": Key.Slash,
    "?": Key.Slash,
    ";": Key.Semicolon,
    ":": Key.Semicolon,
    "'": Key.Quote,
    '"': Key.Quote,
    "[": Key.LeftBracket,
    "{": Key.LeftBracket,
    "]": Key.RightBracket,
    "}": Key.RightBracket,
    "\\": Key.Backslash,
    "|": Key.Backslash,
    "=": Key.Equals,
    "+": Key.Equals,
    ArrowLeft: Key.Left,
    ArrowRight: Key.Right,
    Up: Key.Up,
    Down: Key.Down,
};
for (const [name, key] of Object.entries(Key)) {
    EventKeyToKey[name] = key;
    if (name.length === 1) {
        EventKeyToKey[name.toLowerCase()] = key;
        EventKeyToKey[name.toUpperCase()] = key;
    }
    if (name.startsWith("Num")) {
        EventKeyToKey[name.replace("Num", "")] = key;
    }
}
const KeyboardClass = class Keyboard {
    events = [];
    constructor() {
        const pushEvent = (event) => this.events.push(event);
        window.addEventListener("keydown", pushEvent);
        window.addEventListener("keyup", pushEvent);
    }
    update() {
        for (const event of this.events) {
            const key = EventKeyToKey[event.key];
            if (key) {
                switch (event.type) {
                    case "keydown":
                        this[key] = true;
                        break;
                    case "keyup":
                        delete this[key];
                        break;
                }
            }
        }
        this.events = [];
    }
};
export const Keyboard = new KeyboardClass();
//# sourceMappingURL=keyboard.js.map