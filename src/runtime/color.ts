export class Color {
	static White = new Color(1, 1, 1);

	constructor(
		public red: number,
		public green: number,
		public blue: number,
		public alpha: number = 1
	) {}
}
