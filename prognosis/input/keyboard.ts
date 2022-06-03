import { Runtime } from "../runtime.js";

export enum Key {
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

// prettier-ignore
const KeyToKey: Partial<Record<string, Key>> = {
	"Escape": Key.Escape,
	"Control": Key.Control,
	"Alt": Key.Alt,
	"Meta": Key.Meta,
	"Shift": Key.Shift,
	"Tab": Key.Tab,
	"Backspace": Key.Backspace,
	"Enter": Key.Enter,
	" ": Key.Space,
	"1": Key.Num1,
	"2": Key.Num2,
	"3": Key.Num3,
	"4": Key.Num4,
	"5": Key.Num5,
	"6": Key.Num6,
	"7": Key.Num7,
	"8": Key.Num8,
	"9": Key.Num9,
	"0": Key.Num0,
	"Q": Key.Q,
	"q": Key.Q,
	"W": Key.W,
	"w": Key.W,
	"E": Key.E,
	"e": Key.E,
	"R": Key.R,
	"r": Key.R,
	"T": Key.T,
	"t": Key.T,
	"Y": Key.Y,
	"y": Key.Y,
	"U": Key.U,
	"u": Key.U,
	"I": Key.I,
	"i": Key.I,
	"O": Key.O,
	"o": Key.O,
	"P": Key.P,
	"p": Key.P,
	"A": Key.A,
	"a": Key.A,
	"S": Key.S,
	"s": Key.S,
	"D": Key.D,
	"d": Key.D,
	"F": Key.F,
	"f": Key.F,
	"G": Key.G,
	"g": Key.G,
	"H": Key.H,
	"h": Key.H,
	"J": Key.J,
	"j": Key.J,
	"K": Key.K,
	"k": Key.K,
	"L": Key.L,
	"l": Key.L,
	"Z": Key.Z,
	"z": Key.Z,
	"X": Key.X,
	"x": Key.X,
	"C": Key.C,
	"c": Key.C,
	"V": Key.V,
	"v": Key.V,
	"B": Key.B,
	"b": Key.B,
	"N": Key.N,
	"n": Key.N,
	"M": Key.M,
	"m": Key.M,
	"`": Key.Tick,
	"~": Key.Tick,
	"-": Key.Dash,
	"_": Key.Dash,
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
	"ArrowLeft": Key.Left,
	"ArrowRight": Key.Right,
	"ArrowUp": Key.Up,
	"ArrowDown": Key.Down,
};

export enum KeyState {
	Released = "Released",
	Pressed = "Pressed",
	Held = "Held",
}

const KeyboardClass = class Keyboard {
	events: KeyboardEvent[] = [];
	keyStates: Partial<Record<Key | string, KeyState>> = {};

	constructor() {
		const pushEvent = (event: KeyboardEvent) => this.events.push(event);
		window.addEventListener("keydown", pushEvent);
		window.addEventListener("keyup", pushEvent);
		Runtime.updates.connect(this.update.bind(this));
	}

	keyPressed(key: Key): boolean {
		return this.keyStates[key] === KeyState.Pressed;
	}

	keyReleased(key: Key): boolean {
		return this.keyStates[key] === KeyState.Released;
	}

	keyUp(key: Key): boolean {
		return !(key in KeyState);
	}

	keyDown(key: Key): boolean {
		const state = this.keyStates[key];
		return state !== undefined && state !== KeyState.Released;
	}

	update() {
		for (const key in this.keyStates) {
			switch (this.keyStates[key]) {
				case KeyState.Pressed:
					this.keyStates[key] = KeyState.Held;
					break;
				case KeyState.Released:
					delete this.keyStates[key];
					break;
			}
		}
		this.events.forEach((event) => {
			const key = KeyToKey[event.key];
			if (key) {
				switch (event.type) {
					case "keydown":
						if (this.keyStates[key] !== KeyState.Held) {
							this.keyStates[key] = KeyState.Pressed;
						}
						break;
					case "keyup":
						this.keyStates[key] = KeyState.Released;
						break;
				}
			}
		});
		this.events = [];
	}
};

export const Keyboard = new KeyboardClass();
