import { Graphics } from "./Graphics.js";
import { Util } from "./Util.js";

const currentInput = {
	mousePosition: { x: 0, y: 0 },
	mouseDown: false,
};

const _initialize = () => {
	document.addEventListener("mousemove", (event) => {
		// TODO move to screen space (centered at 0,0)
		// also these coords just look wrong
		const { left, top, width, height } = event.target.getBoundingClientRect();
		const { clientX, clientY } = event;
		const x = ((clientX - left) * Graphics.width) / width;
		const y = ((clientY - top) * Graphics.height) / height;
		currentInput.mousePosition = { x, y };
	});

	document.addEventListener("mousedown", () => {
		currentInput.mouseDown = true;
	});

	document.addEventListener("mouseup", () => {
		currentInput.mouseDown = false;
	});

	document.addEventListener("keydown", (event) => {
		currentInput[Util.unCapitalize(event.code)] = true;
	});

	document.addEventListener("keyup", (event) => {
		currentInput[Util.unCapitalize(event.code)] = false;
	});
};

export const Input = {
	currentInput,
	_initialize,
};
