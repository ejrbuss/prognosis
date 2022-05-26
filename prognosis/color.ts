function componentToInt(component: number) {
	return Math.floor(component * 255);
}

function componentToHex(component: number) {
	const hex = componentToInt(component).toString(0x10);
	return hex.length === 1 ? `0${hex}` : hex;
}

export class Color {
	constructor(
		readonly red: number = 0,
		readonly green: number = red,
		readonly blue: number = green,
		readonly alpha: number = 1
	) {}

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
