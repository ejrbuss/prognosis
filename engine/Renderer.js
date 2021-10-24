import { ClassUtil } from "./data/ClassUtil.js";
import { Color } from "./Color.js";
import { Types } from "./Types.js";
import { Scene } from "./Scene.js";
import { Mat3 } from "./data/Mat3.js";
import { Transform } from "./data/Transform.js";
import { Graphics } from "./Graphics.js";
import { ProgramInfo, WebglUtil } from "./WebgUtil.js";
import { Util } from "./Util.js";
import { Events } from "./Events.js";
import { GameObject } from "./GameObject.js";

const MaxCount = 1024;

const WorldSpace = 1;
const ScreenSpace = 0;

const PostProcessingUniforms = {
	uTexture: 0,
};

const PostProcessingAttributeBuffers = {
	// prettier-ignore
	aVertexCoord: new Float32Array([
		-1, -1,
		 1, -1,
		 1,  1,
		 1,  1,
		-1,  1,
	    -1, -1,
	]),
};

export class RenderCommand {
	/** @type {number */ z = Number;
	/** @type {number[]} */ vertexCoords = [Number];
	/** @type {number[]} */ textureCoords = [Number];
	/** @type {WebGLTexture} */ texture = WebGLTexture;
	/** @type {Color} */ tint = Color;

	/**
	 *
	 * @param {RenderCommand} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export class Renderer {
	/** @type {gl} */ gl = WebGL2RenderingContext;
	/** @type {ProgramInfo} */ renderProgramInfo = ProgramInfo;
	/** @type {WebGLTexture} */ renderTexture = WebGLTexture;
	/** @type {WebGLFramebuffer} */ renderFrameBuffer = WebGLFramebuffer;
	/** @type {ProgramInfo} */ postProcessProgramInfo = ProgramInfo;
	/** @type {WebGLTexture} */ emptyTexture = WebGLTexture;
	/** @type {number} */ count = Number;
	/** @type {WebGLTexture[]} */ textures = [WebGLTexture];
	/** @type {RenderCommand[]} */ cmdStack = [RenderCommand];
	/** @type {{ aVertexCoord: Float32Array, aTextureCoord: Float32Array, aColorTint: Float32Array }} */
	attributeBuffers = {
		aVertexCoord: Float32Array,
		aTextureCoord: Float32Array,
		aColorTint: Float32Array,
	};

	/**
	 *
	 * @param {Renderer} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @returns {Renderer}
 */
Renderer.createFromWebGLContext = async function (gl) {
	let renderTexture = WebglUtil.createEmptyTexture(
		gl,
		Graphics.width,
		Graphics.height
	);
	return new Renderer({
		gl,
		renderProgramInfo: WebglUtil.createProgramInfo(
			gl,
			await Util.fetchText("engine/shaders/RenderVertex.glsl"),
			await Util.fetchText("engine/shaders/RenderFragment.glsl")
		),
		renderTexture,
		renderFrameBuffer: WebglUtil.createFrameBufferForTexture(gl, renderTexture),
		postProcessProgramInfo: WebglUtil.createProgramInfo(
			gl,
			await Util.fetchText("engine/shaders/PostprocessVertex.glsl"),
			await Util.fetchText("engine/shaders/PostprocessFragment.glsl")
		),
		emptyTexture: WebglUtil.createEmptyTexture(gl, 1, 1),
		count: 0,
		textures: [],
		cmdStack: [],
		attributeBuffers: {
			aVertexCoord: new Float32Array(MaxCount * 3),
			aTextureCoord: new Float32Array(MaxCount * 3),
			aColorTint: new Float32Array(MaxCount * 4),
		},
	});
};

/**
 *
 * @param {Renderer} renderer
 * @param {RenderCommand} command
 */
Renderer.pushCommand = function (renderer, command) {
	Types.check(Renderer, renderer);
	Types.check(RenderCommand, command);
	renderer.cmdStack.push(command);
};

/**
 *
 * @param {Renderer} renderer
 * @param {Scene} scene
 */
Renderer.render = function (renderer, scene) {
	Types.check(Renderer, renderer);
	Types.check(Scene, scene);

	let cmdStack = renderer.cmdStack;
	let drawCalls = 0;
	let cmdCount = 0;
	let uniforms = {
		uCamera: Transform.toMat3(scene.camera),
		uViewport: Mat3.scale(
			Mat3.Identity,
			1 / Graphics.width,
			1 / Graphics.height
		),
		uTextureUnits: [0, 1, 2, 3, 4, 5, 6, 7],
	};

	// Render
	WebglUtil.clear(
		renderer.gl,
		renderer.renderFrameBuffer,
		scene.backgroundColor
	);
	for (const layer of scene.layers) {
		renderGameObjects(layer.gameObjects, { event: Events.Render });
		sortCmdStack(cmdStack);
		cmdCount += cmdStack.length;
		let space = layer.inWorldSpace ? WorldSpace : ScreenSpace;
		while (cmdStack.length > 0) {
			let cmd = cmdStack.pop();
			let buffered = tryToBuffer(renderer, cmd, space);
			if (!buffered) {
				cmdStack.push(cmd);
				drawBuffered(renderer, uniforms);
				drawCalls += 1;
			}
		}
		if (renderer.count > 0) {
			drawBuffered(renderGameObject, uniforms);
			drawCalls += 1;
		}
	}
	// Post process
	WebglUtil.draw(
		renderer.gl,
		null,
		renderer.postProcessProgramInfo,
		PostProcessingUniforms,
		PostProcessingAttributeBuffers,
		6
	);
	return { drawCalls, cmdCount };
};

/**
 *
 * @param {GameObject[]} gameObjects
 * @param {Object} properties
 */
function renderGameObjects(gameObjects, properties) {
	for (const gameObject of gameObjects) {
		renderGameObject(gameObject);
	}
}

/**
 *
 * @param {GameObject} gameObject
 * @param {Object} properties
 */
function renderGameObject(gameObject, properties) {
	for (const behaviour of gameObject.behaviours) {
		const onRender = behaviour.eventHandlers.Render;
		if (onRender) {
			onRender(properties, gameObject);
		}
	}
	renderGameObjects(gameObject.children, properties);
}

/**
 *
 * @param {RenderCommand[]} cmdStack
 */
function sortCmdStack(cmdStack) {
	cmdStack.sort((cmd1, cmd2) => {
		return cmd2.z - cmd1.z;
	});
}

/**
 *
 * @param {Renderer} renderer
 * @param {RenderCommand} cmd
 * @param {number} space
 */
function tryToBuffer(renderer, cmd, space) {
	if (renderer.count + 3 > MaxCount) {
		return false;
	}
	let textureUnit = renderer.textures.indexOf(cmd.texture);
	if (textureUnit === -1) {
		let textureCount = renderer.textures.length;
		if (length === WebglUtil.MaxTextures) {
			return false;
		}
		textureUnit = textureCount;
		renderer.textures.push(cmd.texture);
	}
	let { aVertexCoord, aTextureCoord, aColorTint } = renderer.attributeBuffers;
	let { vertexCoords, textureCoords, tint } = cmd;
	let { red, green, blue, alpha } = tint;
	let vertexCoordsOffset = renderer.count * 3;
	aVertexCoord[vertexCoordsOffset + 0] = vertexCoords[0];
	aVertexCoord[vertexCoordsOffset + 1] = vertexCoords[1];
	aVertexCoord[vertexCoordsOffset + 2] = space;
	aVertexCoord[vertexCoordsOffset + 3] = vertexCoords[2];
	aVertexCoord[vertexCoordsOffset + 4] = vertexCoords[3];
	aVertexCoord[vertexCoordsOffset + 5] = space;
	aVertexCoord[vertexCoordsOffset + 6] = vertexCoords[4];
	aVertexCoord[vertexCoordsOffset + 7] = vertexCoords[5];
	aVertexCoord[vertexCoordsOffset + 8] = space;
	let textureCoordsOffset = renderer.count * 3;
	aTextureCoord[textureCoordsOffset + 0] = textureCoords[0];
	aTextureCoord[textureCoordsOffset + 1] = textureCoords[1];
	aTextureCoord[textureCoordsOffset + 2] = textureUnit;
	aTextureCoord[textureCoordsOffset + 3] = textureCoords[2];
	aTextureCoord[textureCoordsOffset + 4] = textureCoords[3];
	aTextureCoord[textureCoordsOffset + 5] = textureUnit;
	aTextureCoord[textureCoordsOffset + 6] = textureCoords[4];
	aTextureCoord[textureCoordsOffset + 7] = textureCoords[5];
	aTextureCoord[textureCoordsOffset + 8] = textureUnit;
	let colorTintOffset = renderer.count * 4;
	aColorTint[tintColorOffset + 0] = red;
	aColorTint[tintColorOffset + 1] = green;
	aColorTint[tintColorOffset + 2] = blue;
	aColorTint[tintColorOffset + 3] = alpha;
	aColorTint[tintColorOffset + 4] = red;
	aColorTint[tintColorOffset + 5] = green;
	aColorTint[tintColorOffset + 6] = blue;
	aColorTint[tintColorOffset + 7] = alpha;
	aColorTint[tintColorOffset + 8] = red;
	aColorTint[tintColorOffset + 9] = green;
	aColorTint[tintColorOffset + 10] = blue;
	aColorTint[tintColorOffset + 11] = alpha;
	renderer.count += 3;
	return true;
}

/**
 *
 * @param {Renderer} renderer
 */
function drawBuffered(renderer, uniforms) {
	// Fill the unused texture units with empty textures
	while (renderer.textures.length < WebglUtil.MaxTextures) {
		renderer.textures.push(renderer.emptyTexture);
	}
	WebglUtil.setTextureUnits(gl, renderer.textures);
	WebglUtil.draw(
		renderer.gl,
		renderer.renderFrameBuffer,
		renderer.renderProgramInfo,
		uniforms,
		renderer.attributeBuffers,
		renderer.count
	);
	renderer.count = 0;
	renderer.textures = [];
}
