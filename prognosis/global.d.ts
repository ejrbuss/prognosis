import * as React from "react";

declare global {
	const React: typeof React;

	namespace JSX {
		interface IntrinsicElements {
			"ion-icon": React.DetailedHTMLProps<HTMLElement>;
		}
	}

	// Math monkey patching
	interface Math {
		clamp(value: number, min: number, max: number): number;
		lerp(start: number, end: number, amount: number): number;
	}
}
