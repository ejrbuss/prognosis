import { Random } from "./random.js";

type RgbaComponents = {
	red: number;
	blue: number;
	green: number;
	alpha: number;
};
type HslaComponents = {
	hue: number;
	saturation: number;
	lightness: number;
	alpha: number;
};

function hueToRgb(t1: number, t2: number, hue: number): number {
	if (hue < 0) {
		hue += 6;
	}
	if (hue >= 6) {
		hue -= 6;
	}
	if (hue < 1) {
		return (t2 - t1) * hue + t1;
	}
	if (hue < 3) {
		return t2;
	}
	if (hue < 4) {
		return (t2 - t1) * (4 - hue) + t1;
	}
	return t1;
}

export class Color {
	static random(): Color {
		return Color.hsl(
			Random.number(),
			0.42 + Random.number() * 0.56,
			0.4 + Random.number() * 0.5
		);
	}

	static rgb255(red: number, green: number, blue: number): Color {
		return Color.rgba255(red, green, blue, 255);
	}

	static rgba255(
		red: number,
		green: number,
		blue: number,
		alpha: number
	): Color {
		return new Color(
			(Math.clamp(red, 0, 255) << 0x18) +
				(Math.clamp(green, 0, 255) << 0x10) +
				(Math.clamp(blue, 0, 255) << 0x8) +
				Math.clamp(alpha, 0, 255)
		);
	}

	static rgb(red: number, green: number, blue: number): Color {
		return Color.rgba(red, green, blue, 1);
	}

	static rgba(red: number, green: number, blue: number, alpha: number): Color {
		return new Color(
			(Math.round(Math.clamp(red, 0, 1) * 255) << 0x18) +
				(Math.round(Math.clamp(green, 0, 1) * 255) << 0x10) +
				(Math.round(Math.clamp(blue, 0, 1) * 255) << 0x8) +
				Math.round(Math.clamp(alpha, 0, 1) * 255)
		);
	}

	static cmyk(
		cyan: number,
		magenta: number,
		yellow: number,
		key: number
	): Color {
		return Color.cmyka(cyan, magenta, yellow, key, 1);
	}

	static cmyka(
		cyan: number,
		magenta: number,
		yellow: number,
		key: number,
		alpha: number
	): Color {
		return Color.rgba(
			1 - Math.min(1, cyan * (1 - key) + key),
			1 - Math.min(1, magenta * (1 - key) + key),
			1 - Math.min(1, yellow * (1 - key) + key),
			alpha
		);
	}

	static hsl(hue: number, satuartion: number, lightness: number): Color {
		return Color.hsla(hue, satuartion, lightness, 1);
	}

	static hsla(
		hue: number,
		saturation: number,
		lightness: number,
		alpha: number
	): Color {
		hue = hue * 6;
		const t2 =
			lightness <= 0.5
				? lightness * (saturation + 1)
				: lightness + saturation - lightness * saturation;
		const t1 = lightness * 2 - t2;
		return Color.rgba(
			hueToRgb(t1, t2, hue + 2),
			hueToRgb(t1, t2, hue),
			hueToRgb(t1, t2, hue - 2),
			alpha
		);
	}

	constructor(readonly value: number) {}

	with(components: Partial<RgbaComponents> | Partial<HslaComponents>): Color {
		if (
			"hue" in components ||
			"saturation" in components ||
			"lightness" in components
		) {
			const hslaComponents = components;
			return Color.hsla(
				hslaComponents.hue ?? this.hue,
				hslaComponents.saturation ?? this.saturation,
				hslaComponents.lightness ?? this.lightness,
				hslaComponents.alpha ?? this.alpha
			);
		} else {
			const rgbaComponents = components as Partial<RgbaComponents>;
			return Color.rgba(
				rgbaComponents.red ?? this.red,
				rgbaComponents.green ?? this.green,
				rgbaComponents.blue ?? this.blue,
				rgbaComponents.alpha ?? this.alpha
			);
		}
	}

	get alpha(): number {
		return (this.value & 0xff) / 255;
	}

	get red(): number {
		return ((this.value >>> 0x18) & 0xff) / 255;
	}

	get green(): number {
		return ((this.value >>> 0x10) & 0xff) / 255;
	}

	get blue(): number {
		return ((this.value >>> 0x8) & 0xff) / 255;
	}

	get cyan(): number {
		const r = this.red;
		const k = this.key;
		return k === 1 ? 0 : (1 - r - k) / (1 - k);
	}

	get magenta(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const k = this.key;
		return k === 1 ? 0 : (1 - g - k) / (1 - k);
	}

	get yellow(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const k = this.key;
		return k === 1 ? 0 : (1 - b - k) / (1 - k);
	}

	get key(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const max = Math.max(r, g, b);
		return 1 - max;
	}

	get hue(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = NaN;
		if (max == r) {
			h = (g - b) / (max - min);
		}
		if (max == g) {
			h = 2 + (b - r) / (max - min);
		}
		if (max == b) {
			h = 4 + (r - g) / (max - min);
		}
		if (isNaN(h)) {
			h = 0;
		}
		return (h / 6) % 1;
	}

	get saturation(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (min + max) / 2;
		if (min == max) {
			return 0;
		}
		if (l < 0.5) {
			return (max - min) / (max + min);
		}
		return (max - min) / (2 - max - min);
	}

	get lightness(): number {
		const r = this.red;
		const g = this.green;
		const b = this.blue;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		return (min + max) / 2;
	}

	get hex(): string {
		const rr = ((this.value >>> 0x18) & 0xff).toString(0x10).padStart(2, "0");
		const gg = ((this.value >>> 0x10) & 0xff).toString(0x10).padStart(2, "0");
		const bb = ((this.value >>> 0x8) & 0xff).toString(0x10).padStart(2, "0");
		const aa = (this.value & 0xff).toString(0x10).padStart(2, "0");
		return `#${rr}${gg}${bb}${aa}`;
	}

	hueRotateRadians(radians: number): Color {
		return this.hueRotateTurns(radians / (2 * Math.PI));
	}

	hueRotateDegrees(degrees: number): Color {
		return this.hueRotateTurns(degrees / 360);
	}

	hueRotateTurns(turn: number): Color {
		return Color.hsla(
			(this.hue + turn) % 1,
			this.saturation,
			this.lightness,
			this.alpha
		);
	}

	complement(): Color {
		return this.hueRotateTurns(0.5);
	}

	lighten(ratio: number): Color {
		const l = this.lightness;
		return Color.hsla(
			this.hue,
			this.saturation,
			(l + l * ratio) % 1,
			this.alpha
		);
	}

	darken(ratio: number): Color {
		const l = this.lightness;
		return Color.hsla(
			this.hue,
			this.saturation,
			(l - l * ratio) % 1,
			this.alpha
		);
	}

	saturate(ratio: number): Color {
		const s = this.saturation;
		return Color.hsla(
			this.hue,
			(s + s * ratio) % 1,
			this.lightness,
			this.alpha
		);
	}

	desaturate(ratio: number): Color {
		const s = this.saturation;
		return Color.hsla(
			this.hue,
			(s - s * ratio) % 1,
			this.lightness,
			this.alpha
		);
	}

	grayscale(): Color {
		const value = this.red * 0.3 + this.green * 0.59 + this.blue * 0.11;
		return Color.rgba(value, value, value, this.alpha);
	}

	mix(color: Color, weight: number = 0.5) {
		const c1 = this.cyan;
		const m1 = this.magenta;
		const y1 = this.yellow;
		const k1 = this.key;
		const a1 = this.alpha;
		const c2 = color.cyan;
		const m2 = color.magenta;
		const y2 = color.yellow;
		const k2 = color.key;
		const a2 = color.alpha;
		const w1 = 1 - weight;
		const w2 = weight;
		return Color.cmyka(
			c1 * w1 + c2 * w2,
			m1 * w1 + m2 * w2,
			y1 * w1 + y2 * w2,
			k1 * w1 + k2 * w2,
			a1 * w1 + a2 * w2
		);
	}
}

export const Colors = {
	Black: Color.rgb(0, 0, 0),
	White: Color.rgb(1, 1, 1),
	Transparent: Color.rgba(0, 0, 0, 0),
	Red: Color.rgb(1, 0, 0),
	Green: Color.rgb(0, 1, 0),
	Blue: Color.rgb(0, 0, 1),
	Cyan: Color.cmyk(1, 0, 0, 0),
	Magenta: Color.cmyk(0, 1, 0, 0),
	Yellow: Color.cmyk(0, 0, 1, 0),
};
