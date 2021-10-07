import { Graphics } from "../Graphics.js";
import { Images } from "../Images.js";
import { Types } from "../Types.js";

export const Properties = {
	text: Types.String,
	font: Types.Font,
};

export const onCreate = (_props, gameObject) => {
	gameObject._DrawText = {};
};

export const onRender = (_props, gameObject) => {
	// free last frame's text image
	const { text, font, _DrawText } = gameObject;
	let { textImage } = _DrawText;
	if (textImage) {
		Images.destroy(textImage);
	}
	textImage = Images.createFromText(text, font);
	Graphics.drawImage();
};
