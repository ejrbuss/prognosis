import { Util } from "./Util.js";
import { WebglUtil } from "./WebgUtil.js";

/**
 * Inspired by https://twgljs.org/, this module provides an even further
 * simplified interface for interacting with webgl.
 *
 * Assumptions made by the wrapper:
 * 	- It is the sole owner of the WebglRenderingContext provided
 *  - You provide data as Float32Arrays
 */
const TypeToSize = {
	[WebGLRenderingContext.FLOAT]: 1,
	[WebGLRenderingContext.FLOAT_VEC2]: 2,
	[WebGLRenderingContext.FLOAT_VEC3]: 3,
	[WebGLRenderingContext.FLOAT_VEC4]: 4,
};

const TypeToSetter = {
	[WebGLRenderingContext.SAMPLER_2D]: (gl, location, data) =>
		gl.uniform1i(location, data),
	[WebGL2RenderingContext.INT]: (gl, location, data) =>
		gl.uniform1i(location, data),
	[WebGLRenderingContext.FLOAT]: (gl, location, data) =>
		gl.uniform1f(location, data),
	[WebGLRenderingContext.FLOAT_VEC2]: (gl, location, data) =>
		gl.uniform2fv(location, data),
	[WebGLRenderingContext.FLOAT_VEC3]: (gl, location, data) =>
		gl.uniform3fv(location, data),
	[WebGLRenderingContext.FLOAT_VEC4]: (gl, location, data) =>
		gl.uniform4fv(location, data),
	[WebGLRenderingContext.FLOAT_MAT2]: (gl, location, data) =>
		gl.uniformMatrix2fv(location, false, data),
	[WebGLRenderingContext.FLOAT_MAT3]: (gl, location, data) =>
		gl.uniformMatrix3fv(location, false, data),
	[WebGLRenderingContext.FLOAT_MAT4]: (gl, location, data) =>
		gl.uniformMatrix4fv(location, false, data),
};

const TextureUnits = [
	WebGLRenderingContext.TEXTURE0,
	WebGLRenderingContext.TEXTURE1,
	WebGLRenderingContext.TEXTURE2,
	WebGLRenderingContext.TEXTURE3,
	WebGLRenderingContext.TEXTURE4,
	WebGLRenderingContext.TEXTURE5,
	WebGLRenderingContext.TEXTURE6,
	WebGLRenderingContext.TEXTURE7,
];

/** @type {WebGLRenderingContext} */
let gl;
let uniformInfo;
let attributeInfo;

const _initialize = async (webglRenderingContext) => {
	gl = webglRenderingContext;
	const vertexSource = await Util.fetchText("engine/shaders/vertex.glsl");
	const fragmentSource = await Util.fetchText("engine/shaders/fragment.glsl");
	const program = createProgram(vertexSource, fragmentSource);
	uniformInfo = createUniformInfo(program);
	attributeInfo = createAttributeInfo(program);

	// General Configuration
	gl.enable(gl.BLEND);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

	// Default textures
	const dummyDexture = createDummyTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, dummyDexture);
	setTextures(Util.repeat(dummyDexture, WebglWrapper.MaxTextures));
	setUniforms({
		uTextureUnit0: 0,
		uTextureUnit1: 1,
		uTextureUnit2: 2,
		uTextureUnit3: 3,
		uTextureUnit4: 4,
		uTextureUnit5: 5,
		uTextureUnit6: 6,
		uTextureUnit7: 7,
	});
};

const createTexture = (dataSource) => {
	const texture = createBaseTexture();
	gl.texImage2D(
		gl.TEXTURE_2D,
		0,
		gl.RGBA,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		dataSource
	);
	return texture;
};

const destroyTexture = (texture) => {
	gl.deleteTexture(texture);
};

const setUniforms = (uniforms) => {
	for (const name in uniforms) {
		const { location, setter } = uniformInfo[name];
		setter(gl, location, uniforms[name]);
	}
};

const setTextures = (textures) => {
	for (const i in textures) {
		const texture = textures[i];
		const textureUnit = TextureUnits[i];
		gl.activeTexture(textureUnit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	}
};

const drawArrays = (arrays, count) => {
	for (const name in arrays) {
		if (!(name in attributeInfo)) {
			throw new Error(`Unknown attribute: ${name}!`);
		}
		const { buffer } = attributeInfo[name];
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, arrays[name], gl.STATIC_DRAW);
	}
	gl.drawArrays(gl.TRIANGLES, 0, count);
};

const clear = () => {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
};

const createProgram = (vertexSource, fragmentSource) => {
	const vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.etProgramInfoLog(program));
	}
	gl.useProgram(program);
	return program;
};

const createShader = (type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}
	return shader;
};

const createUniformInfo = (program) => {
	const uniformInfo = {};
	const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < uniformCount; i += 1) {
		const { name, type } = gl.getActiveUniform(program, i);
		const location = gl.getUniformLocation(program, name);
		const setter = TypeToSetter[type];
		if (typeof setter === "undefined") {
			throw new Error(`Unsupported webgl type: 0x${type.toString(16)}!`);
		}
		if (typeof location !== "undefined") {
			uniformInfo[name] = { name, type, setter, location };
		}
	}
	return uniformInfo;
};

const createAttributeInfo = (program) => {
	const attributeInfo = {};
	const length = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < length; i += 1) {
		const { name, type } = gl.getActiveAttrib(program, i);
		const location = gl.getAttribLocation(program, name);
		const size = TypeToSize[type];
		if (typeof size === "undefined") {
			throw new Error(`Unsupported webgl type: 0x${type.toString(16)}!`);
		}
		if (typeof location !== "undefined") {
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(location);
			attributeInfo[name] = { name, type, size, location, buffer };
		}
	}
	return attributeInfo;
};

const createDummyTexture = () => {
	const texture = createBaseTexture();
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const srcData = new Uint8Array([0, 0, 255, 255]);
	gl.texImage2D(
		gl.TEXTURE_2D,
		level,
		internalFormat,
		width,
		height,
		border,
		srcFormat,
		srcType,
		srcData
	);
	return texture;
};

const createBaseTexture = () => {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	return texture;
};

export const WebglWrapper = {
	MaxTextures: TextureUnits.length,
	_initialize,
	createTexture,
	destroyTexture,
	setUniforms,
	setTextures,
	drawArrays,
	clear,
};
