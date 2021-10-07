import { Types } from "./Types.js";

const ResizeFactor = 2;

const TextOptionsType = {
	text: String,
	color: Types.Color,
	fontSize: Number,
	fontFamily: String,
};

const TextureType = {
	x: Number,
	y: Number,
	width: Number,
	height: Number,
};

const TextureCache = {};

let frontCanvas;
let backCanvas;
let c2d;
let offset;

const init = () => {
	frontCanvas = document.getElementById("front-texture-canvas");
	backCanvas = document.getElementById("back-texture-canvas");
	frontCanvas.width = 1;
	frontCanvas.height = 1;
	c2d = frontCanvas.getContext("2d");
	offset = 0;
	MegaTexture.canvas = frontCanvas;
	MegaTexture.dirty = true;
};

const textureForColor = (color) => {
	Types.check(Types.Color, color);
	const textureKey = JSON.stringify(color);
	if (!(textureKey in TextureCache)) {
		TextureCache[textureKey] = loadTextureForColor(color);
	}
	return TextureCache[textureKey];
};

const textureForImage = (image) => {
	Types.check(HTMLImageElement, image);
	const textureKey = JSON.stringify({
		src: image.src,
		width: image.width,
		height: image.height,
	});
	if (!(textureKey in TextureCache)) {
		TextureCache[textureKey] = loadTextureForImage(image);
	}
	return TextureCache[textureKey];
};

const textureForText = (textOptions) => {
	Types.check(TextOptionsType, textOptions);
	const textureKey = JSON.stringify(textOptions);
	if (!(textureKey in TextureCache)) {
		TextureCache[textureKey] = loadTextureForText(textOptions);
	}
	return TextureCache[textureKey];
};

const loadTextureForColor = (color) => {
	const x = 0;
	const y = offset;
	const width = 1;
	const height = 1;
	fitCanvas(y + height, width);
	c2d.fillStyle = colorToCss(color);
	c2d.fillRect(x, y, width, height);
	offset += height;
	MegaTexture.dirty = true;
	return { x, y, width, height };
};

const loadTextureForImage = (image) => {
	const x = 0;
	const y = offset;
	const width = image.width;
	const height = image.height;
	fitCanvas(y + height, width);
	c2d.drawImage(image, x, y);
	offset += height;
	MegaTexture.dirty = true;
	return { x, y, width, height };
};

const loadTextureForText = (textOptions) => {
	c2d.fontFamily = textOptions.fontFamily;
	c2d.fontSize = textOptions.fontSize;
	const textMetrics = c2d.measureText(textOptions.text);
	const x = 0;
	const y = offset;
	const width = textMetrics.width;
	const height = textMetrics.height;
	fitCanvas(y + height, width);
	// Set font details again as fitCanvas may have swapped
	c2d.fontFamily = textOptions.fontFamily;
	c2d.fontSize = textOptions.fontSize;
	c2d.fillStyle = colorToCss(textOptions.color);
	c2d.fillText(textOptions.text, x, y);
	offset += height;
	MegaTexture.dirty = true;
	return { x, y, width, height };
};

const fitCanvas = (newHeight, newWidth) => {
	const canvas = MegaTexture.canvas;
	let height = canvas.height;
	while (height < newHeight) {
		height *= ResizeFactor;
	}
	let width = canvas.width;
	while (width < newWidth) {
		width *= ResizeFactor;
	}
	if (canvas.width === width && canvas.height === height) {
		return;
	}
	const nextCanvas = canvas === frontCanvas ? backCanvas : frontCanvas;
	nextCanvas.width = width;
	nextCanvas.height = height;
	c2d = nextCanvas.getContext("2d");
	c2d.drawImage(canvas, 0, 0);
	MegaTexture.canvas = nextCanvas;
};

const colorToCss = (color) => {
	const { red, blue, green } = color;
	return `rgb(${red}, ${green}, ${blue})`;
};

export const MegaTexture = {
	canvas: null,
	dirty: null,
	init,
	textureForColor,
	textureForImage,
	textureForText,
};
