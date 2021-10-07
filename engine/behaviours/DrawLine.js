import { Graphics } from "../Graphics.js";
import { Types } from "../Types.js";

export const Properties = {
	visible: Boolean,
	endPosition: {
		x: Number,
		y: Number,
	},
	color: Types.Color,
	alpha: Number,
};

export const onRender = (_props, gameObject) => {
	if (!gameObject.visible) {
		return;
	}
	Graphics.pushLine(
		gameObject.position,
		{ z: gameObject.position.z, ...gameObject.endPosition },
		gameObject.color,
		gameObject.alpha
	);
};
