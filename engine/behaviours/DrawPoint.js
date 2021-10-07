import { Graphics } from "../Graphics.js";
import { Types } from "../Types.js";

export const Properties = {
	visible: Boolean,
	scale: Number,
	color: Types.Color,
	alpha: Number,
};

export const onRender = (_props, gameObject) => {
	if (!gameObject.visible) {
		return;
	}
	Graphics.pushPoint(
		gameObject.position,
		gameObject.color,
		gameObject.scale,
		gameObject.alpha
	);
};
