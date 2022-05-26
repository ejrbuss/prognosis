enum Key {
	Escape = "Escape",
	Control = "Control",
	Alt = "Alt",
	Meta = "Meta",
	Shift = "Shift",
	Tab = "Tab",
	Space = "Space",
	Backspace = "Backspace",
	Enter = "Enter",
	Num1 = "Num1",
	Num2 = "Num2",
	Num3 = "Num3",
	Num4 = "Num4",
	Num5 = "Num5",
	Num6 = "Num6",
	Num7 = "Num7",
	Num8 = "Num8",
	Num9 = "Num9",
	Num0 = "Num0",
	Q = "Q",
	W = "W",
	E = "E",
	R = "R",
	T = "T",
	Y = "Y",
	U = "U",
	I = "I",
	O = "O",
	P = "P",
	A = "A",
	S = "S",
	D = "D",
	F = "F",
	G = "G",
	H = "H",
	J = "J",
	K = "K",
	L = "L",
	Z = "Z",
	X = "X",
	C = "C",
	V = "V",
	B = "B",
	N = "N",
	M = "M",
	Tick = "Tick",
	Comma = "Comma",
	Period = "Period",
	Slash = "Slash",
	Semicolon = "Semicolon",
	Quote = "Quote",
	LeftBracket = "LeftBracket",
	RightBracket = "RightBracket",
	Backslash = "Backslash",
	Dash = "Dash",
	Equals = "Equals",
	Left = "Left",
	Right = "Right",
	Up = "Up",
	Down = "Down",
}

const EventKeyToKey: Record<string, Key> = {
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

for (const [name, key] of Object.entries(Key) as [string, Key][]) {
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
	events: KeyboardEvent[] = [];

	constructor() {
		const pushEvent = (event: KeyboardEvent) => this.events.push(event);
		window.addEventListener("keydown", pushEvent);
		window.addEventListener("keyup", pushEvent);
	}

	update() {
		for (const event of this.events) {
			const key = EventKeyToKey[event.key];
			if (key) {
				switch (event.type) {
					case "keydown":
						(this as any)[key] = true;
						break;
					case "keyup":
						delete (this as any)[key];
						break;
				}
			}
		}
		this.events = [];
	}
};

export const Keyboard: InstanceType<typeof KeyboardClass> &
	Record<Key, boolean> = new KeyboardClass() as any;
