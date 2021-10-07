import { Events } from "./Events.js";
import { Mat3 } from "./linearAlgebra/Mat3.js";
import { Vec3 } from "./linearAlgebra/Vec3.js";
import { BatchRenderer } from "./BatchRenderer.js";
import { Transforms } from "./Transforms.js";
import { Util } from "./Util.js";
import { WebglWrapper } from "./WebglWrapper.js";

let canvas;
let transformStack;
let currentLayerIndex;
let currentSpace;

const _initialize = async () => {
	canvas = document.getElementById("game-canvas");
	canvas.width = Graphics.width;
	canvas.height = Graphics.height;
	canvas.style.imageRendering = Graphics.antiAlias ? "auto" : "pixelated";
	window.addEventListener("resize", resize);
	resize();
	const gl = canvas.getContext("webgl", {
		antiAlias: Graphics.antiAlias,
		desyrchnoized: true,
	});
	await WebglWrapper._initialize(gl);
	transformStack = [Transforms.Identity];
};

const _render = (scene) => {
	const { layers } = scene;
	const length = layers.length;
	for (let layerIndex = 0; layerIndex < length; layerIndex += 1) {
		const { inWorldSpace, gameObjects } = layers[layerIndex];
		currentLayerIndex = layerIndex;
		currentSpace = inWorldSpace
			? BatchRenderer.WorldSpace
			: BatchRenderer.ScreenSpace;
		renderGameObjects(gameObjects);
	}
	BatchRenderer.flushWithUniforms({
		uCamera: Transforms.toMat3(scene.camera),
		uViewport: Mat3.scale(
			Mat3.Identity,
			1 / Graphics.width,
			1 / Graphics.height
		),
	});
};

const renderGameObject = (gameObject) => {
	const { visible, behaviours, children } = gameObject;
	if (!visible) {
		return;
	}
	pushTransform(gameObject);
	for (const { eventHandlers } of behaviours) {
		const onRender = eventHandlers.Render ?? eventHandlers.Event;
		if (onRender) {
			onRender({ event: Events.Render }, gameObject);
		}
	}
	renderGameObjects(children);
	popTransform();
};

const renderGameObjects = (gameObjects) => {
	for (const gameObject of gameObjects) {
		renderGameObject(gameObject);
	}
};

const pushTransform = (transform) => {
	const transformIndex = transformStack.length - 1;
	const currentTransform = transformStack[transformIndex];
	const nextTransform = Transforms.combine(currentTransform, transform);
	transformStack.push(nextTransform);
};

const popTransform = () => {
	transformStack.pop();
};

const drawRectangle = (x, y, width, height, color) => {
	const transformIndex = transformStack.length - 1;
	const currentTransform = transformStack[transformIndex];
	const transformMatrix = Transforms.toMat3(currentTransform);
	const z = currentTransform.position.z;
	// push triangle 1
	const p1 = Vec3.create(x, y, 1);
	const p2 = Vec3.create(x + width, y, 1);
	const p3 = Vec3.create(x + width, y + height, 1);
	const tp1 = Vec3.transform(p1, transformMatrix);
	const tp2 = Vec3.transform(p2, transformMatrix);
	const tp3 = Vec3.transform(p3, transformMatrix);
	// prettier-ignore
	let vertexCoords = [
		tp1[0], tp1[1],
		tp2[0], tp2[1],
		tp3[0], tp3[1],
	];
	BatchRenderer.pushColoredTriangle({
		z,
		vertexCoords,
		color,
		layerIndex: currentLayerIndex,
		space: currentSpace,
	});
	// push triangle 2
	const p4 = Vec3.create(x + width, y + height, 1);
	const p5 = Vec3.create(x, y + height, 1);
	const p6 = Vec3.create(x, y, 1);
	const tp4 = Vec3.transform(p4, transformMatrix);
	const tp5 = Vec3.transform(p5, transformMatrix);
	const tp6 = Vec3.transform(p6, transformMatrix);
	// prettier-ignore
	vertexCoords = [
		tp4[0], tp4[1],
		tp5[0], tp5[1],
		tp6[0], tp6[1],
	];
	BatchRenderer.pushColoredTriangle({
		z,
		vertexCoords,
		color,
		space: currentSpace,
		layerIndex: currentLayerIndex,
	});
};

const drawImage = (x, y, width, height, image) => {
	const transformIndex = transformStack.length - 1;
	const currentTransform = transformStack[transformIndex];
	const transformMatrix = Transforms.toMat3(currentTransform);
	const z = currentTransform.position.z;
	// push triangle 1
	const p1 = Vec3.create(x, y, 1);
	const p2 = Vec3.create(x + width, y, 1);
	const p3 = Vec3.create(x + width, y + height, 1);
	const tp1 = Vec3.transform(p1, transformMatrix);
	const tp2 = Vec3.transform(p2, transformMatrix);
	const tp3 = Vec3.transform(p3, transformMatrix);
	// prettier-ignore
	let vertexCoords = [
		tp1[0], tp1[1],
		tp2[0], tp2[1],
		tp3[0], tp3[1],
	];
	// prettier-ignore
	let textureCoords = [
		1, 1,
		0, 1,
		0, 0,
	];
	BatchRenderer.pushTexturedTriangle({
		z,
		vertexCoords,
		textureCoords,
		layerIndex: currentLayerIndex,
		space: currentSpace,
		texture: image.texture,
	});
	// push triangle 2
	const p4 = Vec3.create(x + width, y + height, 1);
	const p5 = Vec3.create(x, y + height, 1);
	const p6 = Vec3.create(x, y, 1);
	const tp4 = Vec3.transform(p4, transformMatrix);
	const tp5 = Vec3.transform(p5, transformMatrix);
	const tp6 = Vec3.transform(p6, transformMatrix);
	// prettier-ignore
	vertexCoords = [
		tp4[0], tp4[1],
		tp5[0], tp5[1],
		tp6[0], tp6[1],
	];
	// prettier-ignore
	textureCoords = [
		0, 0,
		1, 0,
		1, 1,
	];
	BatchRenderer.pushTexturedTriangle({
		z,
		vertexCoords,
		textureCoords,
		layerIndex: currentLayerIndex,
		space: currentSpace,
		texture: image.texture,
	});
};

const resize = () => {
	const gameAspect = Graphics.width / Graphics.height;
	const screenAspect = innerWidth / innerHeight;

	if (screenAspect < gameAspect) {
		canvas.style.width = "100vw";
		canvas.style.height = `calc(100vw / ${gameAspect})`;
	} else {
		canvas.style.width = `calc(100vh * ${gameAspect})`;
		canvas.style.height = "100vh";
	}
};

export const Graphics = {
	width: undefined,
	height: undefined,
	antiAlias: undefined,
	_initialize,
	_render,
	pushTransform,
	popTransform,
	drawRectangle,
	drawImage,
	// drawPoint,
	// drawLines,
	// drawTriangle,
	// drawPolygon,
};
