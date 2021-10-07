import { Graphics } from "../Graphics.js";
import { Types } from "../Types.js";

export const Properties = {
	rectangleBounds: Types.BoundingBox,
	color: Types.Color,
};

export const onRender = (_props, gameObject) => {
	const { rectangleBounds, color } = gameObject;
	const { width, height, offset } = rectangleBounds;
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	Graphics.drawRectangle(
		-halfWidth + offset.x,
		-halfHeight + offset.y,
		width,
		height,
		color
	);
};
