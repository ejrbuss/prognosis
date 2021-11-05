export enum Alignment {
	Left = "Left",
	Center = "Center",
	Right = "Right",
	Justify = "Justify",
}

export class Font {
	constructor(
		public family: string,
		public style: string,
		public size: number,
		public alignment: Alignment
	) {}
}
