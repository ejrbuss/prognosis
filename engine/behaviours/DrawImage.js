import { Graphics } from "../Graphics.js";
import { Types } from "../Types.js";

export const Properties = {
	image: Types.Image,
	imageBounds: Types.BoundingBox,
};

export const onRender = (_props, gameObject) => {
	const { image, imageBounds } = gameObject;
	const { width, height, offset } = imageBounds;
	const halfWidth = width / 2;
	const halfHeight = height / 2;
	Graphics.drawImage(
		-halfWidth + offset.x,
		-halfHeight + offset.y,
		width,
		height,
		image
	);
};
