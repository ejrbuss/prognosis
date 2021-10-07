import { Events } from "./Events.js";
import { MegaTexture } from "./MegaTexture.js";
import { WebglWrapper } from "./WebglWrapper.js";
import { Transforms } from "./Transforms.js";
import { Util } from "./Util.js";

const Spaces = {
	World: "World",
	Screen: "Space",
};

const SpaceToConstant = {
	World: 0,
	Screen: 1,
};

const Points = {
	mode: WebGLRenderingContext.POINTS,
	length: 0,
	arrays: {
		aVertexCoord: [],
		aTextureCoord: [],
		aSize: [],
		aAlpha: [],
		aSpace: [],
	},
};

const Lines = {
	mode: WebGLRenderingContext.LINES,
	length: 0,
	arrays: {
		aVertexCoord: [],
		aTextureCoord: [],
		aSize: [],
		aAlpha: [],
		aSpace: [],
	},
};

const Triangles = {
	mode: WebGLRenderingContext.TRIANGLES,
	length: 0,
	arrays: {
		aVertexCoord: [],
		aTextureCoord: [],
		aSize: [],
		aAlpha: [],
		aSpace: [],
	},
};

const Primitives = [Points, Lines, Triangles];

let gl;
let programInfo;
let currentSpaceConstant;

const init = async () => {
	const canvas = document.getElementById("game-canvas");
	canvas.width = Graphics.width;
	canvas.height = Graphics.height;

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

	window.addEventListener("resize", resize);
	resize();

	gl = canvas.getContext("webgl", {
		antialias: Graphics.antiAlias,
		desynchronized: true,
	});
	programInfo = WebglWrapper.createProgramInfo(
		gl,
		await Util.fetchText("/engine/shaders/vertex.glsl"),
		await Util.fetchText("/engine/shaders/fragment.glsl")
	);
};

const render = (scene) => {
	WebglWrapper.clear(gl);
	WebglWrapper.setUniforms(gl, programInfo, {
		uScreenViewport: [Graphics.width, Graphics.height],
		uCamera: Transforms.toMatrix(scene.camera),
	});

	const { layers } = scene;
	for (const layer of layers) {
		currentSpaceConstant = SpaceToConstant[layer.space];

		// Clear data buffers
		for (const primitive of Primitives) {
			primitive.length = 0;
			const { arrays } = primitive;
			for (const attribute in arrays) {
				arrays[attribute] = [];
			}
		}

		// Issue rendering pseudo events
		const { gameObjects } = layer;
		for (const gameObject of gameObjects) {
			renderGameObject(gameObject);
		}

		if (MegaTexture.dirty) {
			WebglWrapper.setMegaTexture(gl, MegaTexture.canvas);
			WebglWrapper.setUniforms(gl, programInfo, {
				uMegaTexture: programInfo.megaTexture,
				uMegaTextureViewport: [
					MegaTexture.canvas.width,
					MegaTexture.canvas.height,
				],
			});
		}

		// Draw pushed data
		WebglWrapper.clear;
		for (const { mode, length, arrays } of Primitives) {
			WebglWrapper.setUniforms(gl, programInfo, { uMode: mode });
			WebglWrapper.drawArrays(gl, programInfo, mode, arrays, length);
		}
	}
};

const pushArrays = (primitive, vx, vy, vz, tx, ty, size, alpha) => {
	primitive.length += 1;
	const { arrays } = primitive;
	arrays.aVertexCoord.push(vx, vy, vz);
	arrays.aTextureCoord.push(tx, ty);
	arrays.aSize.push(size);
	arrays.aAlpha.push(alpha);
	arrays.aSpace.push(currentSpaceConstant);
};

const pushPoint = (p, color, size, alpha) => {
	const { x: tx, y: ty } = MegaTexture.textureForColor(color);
	pushArrays(Points, p.x, p.y, p.z, tx, ty, size, alpha);
};

const pushLine = (p1, p2, color, alpha) => {
	const { x: tx, y: ty } = MegaTexture.textureForColor(color);
	pushArrays(Lines, p1.x, p1.y, p1.z, tx, ty, 1, alpha);
	pushArrays(Lines, p2.x, p2.y, p2.z, tx, ty, 1, alpha);
};

const pushTriangle = (p1, p2, p3, color, alpha) => {
	const { x: tx, y: ty } = MegaTexture.textureForColor(color);
	pushArrays(Triangles, p1.x, p1.y, p1.z, tx, ty, 1, alpha);
	pushArrays(Triangles, p2.x, p2.y, p2.z, tx, ty, 1, alpha);
	pushArrays(Triangles, p3.x, p3.y, p3.z, tx, ty, 1, alpha);
};

// points should follow the ASTC rule (untransformed)
const pushQuad = (p1, p2, p3, p4, texture, alpha) => {
	const max_tx = texture.x + texture.width - 1;
	const min_tx = texture.x;
	const max_ty = texture.y + texture.height - 1;
	const min_ty = texture.y;
	pushArrays(Triangles, p1.x, p1.y, p1.z, max_tx, max_ty, 1, alpha);
	pushArrays(Triangles, p2.x, p2.y, p2.z, min_tx, max_ty, 1, alpha);
	pushArrays(Triangles, p3.x, p3.y, p3.z, min_tx, min_ty, 1, alpha);
	pushArrays(Triangles, p3.x, p3.y, p3.z, min_tx, min_ty, 1, alpha);
	pushArrays(Triangles, p4.x, p4.y, p4.z, max_tx, min_ty, 1, alpha);
	pushArrays(Triangles, p1.x, p1.y, p1.z, max_tx, max_ty, 1, alpha);
};

const renderGameObject = (gameObject) => {
	const { behaviours } = gameObject;
	for (const { eventHandlers } of behaviours) {
		const onRender = eventHandlers[Events.Render];
		if (onRender) {
			onRender({ event: Events.Render }, gameObject);
		}
	}
};

export const Graphics = {
	Spaces,
	width: null,
	height: null,
	antiAlias: null,
	init,
	render,
	pushPoint,
	pushLine,
	pushQuad,
};
