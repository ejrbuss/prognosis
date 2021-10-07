import { Loader } from "./Loader.js";
import { Types } from "./Types.js";
import { WebglWrapper } from "./WebglWrapper.js";

const All = new Set();

const ImageBySource = {};

let textCanvas;
/** @type {CanvasRenderingContext2D} */
let c2d;

const _initialize = () => {
	textCanvas = document.getElementById("text-canvas");
	c2d = textCanvas.getContext("2d");
	c2d.textAlign = "left";
};

const createFromSource = async (source) => {
	let image = ImageBySource[source];
	if (!image) {
		const imageElement = new Image(source);
		imageElement.src = source;
		await new Promise((resolve) => (imageElement.onload = resolve));
		const texture = WebglWrapper.createTexture(imageElement);
		image = {
			source,
			texture,
			width: imageElement.width,
			height: imageElement.height,
		};
		All.add(image);
		ImageBySource[source] = image;
	}
	return image;
};

const createFromText = (text, font) => {
	Types.check(Types.String, text);
	Types.check(Types.Font, font);
	const { color } = font;
	const fontString = fontToString(font);
	const colorString = colorToString(color);
	c2d.font = fontString;
	c3d.fillStyle = colorString;
	const metrics = c2d.measureText(text);
	const width = metrics.width;
	const height =
		metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	if (textCanvas.width < width || textCanvas.height < height) {
		textCanvas.width = width;
		textCanvas.height = height;
		c2d = textCanvas.getContext("2d");
		c2d.textAlign = "left";
		c2d.font = fontString;
		c2d.fillStyle = colorString;
	}
	c2d.clearRect(0, 0, width, height);
	c2d.fillText(text, 0, metrics.actualBoundingBoxAscent);
	const texture = WebglWrapper.createTexture(textCanvas);
	const image = {
		texture,
		width,
		height,
		baseline: metrics.actualBoundingBoxAscent,
	};
	All.add(image);
	return image;
};

const destroy = (image) => {
	if (image.source) {
		throw new Error("Deleting source images is not supported!");
	}
	All.delete(image);
	WebglWrapper.destroyTexture(image.texture);
};

const fontToString = (font) => {
	const { family, style, size } = font;
	return `${style} ${size}px ${family}`;
};

const colorToString = (color) => {
	const { red, green, blue, alpha } = color;
	return `rgba(${red * 255}, ${green * 255}, ${blue * 255}, ${alpha})`;
};

export const Images = {
	All,
	_initialize,
	createFromSource,
	createFromText,
	destroy,
};

Types.check(Types.Image, (v) => All.has(v));

Loader.define(Types.Image, async (json) => {
	Types.check(Types.String, json);
	const image = await createFromSource(json);
	return image;
});

// newline support
// word-wrap (on whitesapce) support?
// caching, no manual deleting?
// combine tiles into an intelligent texture type
//  - image textures
//  - tile textures
//  - text textures
// or keep distinct pipelines?
// should they then be under seperate files?
// where would text belong eg. Image, Sprite, and TextSprite
// could we treat images as spritesheets with only 1 sprite?
// would consolidate behaviours to
// - Sprite
// - AnimatedSprite
// - Text

// Rename behaviours to nouns
// - Polygon
// - Rectangle
// - Circle
// - Grid
// - Sprite
// - AnimatedSprite
// - Text
// - Zone
// - StaticBody
// - DynamicBody
// - Button
