/* Heavily inspired by https://github.com/greggman/twgl.js */

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
		gl.uniform2fv(location, asFloat32Array(data)),
	[WebGLRenderingContext.FLOAT_VEC3]: (gl, location, data) =>
		gl.uniform3fv(location, asFloat32Array(data)),
	[WebGLRenderingContext.FLOAT_VEC4]: (gl, location, data) =>
		gl.uniform4fv(location, asFloat32Array(data)),
	[WebGLRenderingContext.FLOAT_MAT2]: (gl, location, data) =>
		gl.uniformMatrix2fv(location, false, asFloat32Array(data)),
	[WebGLRenderingContext.FLOAT_MAT3]: (gl, location, data) =>
		gl.uniformMatrix3fv(location, false, asFloat32Array(data)),
	[WebGLRenderingContext.FLOAT_MAT4]: (gl, location, data) =>
		gl.uniformMatrix4fv(location, false, asFloat32Array(data)),
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} vertexSource
 * @param {*} fragmentSource
 * @returns
 */
const createProgramInfo = (gl, vertexSource, fragmentSource) => {
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Error linking shaders: ${gl.getProgramInfoLog(program)}!`);
	}

	gl.useProgram(program);
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	const megaTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, megaTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	const uniformInfo = createUniformInfo(gl, program);
	const attributeInfo = createAttributeInfo(gl, program);

	return { program, megaTexture, uniformInfo, attributeInfo };
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} programInfo
 * @param {*} uniforms
 */
const setUniforms = (gl, programInfo, uniforms) => {
	const { uniformInfo } = programInfo;
	for (const name in uniforms) {
		if (!(name in uniformInfo)) {
			throw new Error(`Unknown uniform: ${name}!`);
		}
		const { type, location } = uniformInfo[name];
		const data = uniforms[name];
		const setter = TypeToSetter[type];
		if (!setter) {
			throw new Error(`Unknown webgl type: ${type}!`);
		}
		setter(gl, location, data);
	}
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} canvas
 */
const setMegaTexture = (gl, canvas) => {
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
};

/**
 *
 * @param {WebGLRenderingContext} gl
 * @param {*} programInfo
 * @param {*} arrays
 */
const drawArrays = (gl, programInfo, mode, arrays, length) => {
	if (length === 0) {
		return;
	}
	// Write arrays to buffers
	const { attributeInfo } = programInfo;
	for (const name in arrays) {
		if (!(name in attributeInfo)) {
			throw new Error(`Unknown attribute: ${name}!`);
		}
		const { buffer } = attributeInfo[name];
		const data = asFloat32Array(arrays[name]);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
	}
	gl.drawArrays(mode, 0, length);
};

/**
 *
 * @param {WebGLRenderingContext} gl
 */
const clear = (gl) => {
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
};

const clearDepth = (gl) => {
	gl.clearDepth(1.0);
	gl.clear(gl.DEPTH_BUFFER_BIT);
};

const createShader = (gl, type, source) => {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
	}

	return shader;
};

const createUniformInfo = (gl, program) => {
	const uniformInfo = {};
	const length = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < length; i += 1) {
		const { name, type } = gl.getActiveUniform(program, i);
		const location = gl.getUniformLocation(program, name);
		if (location) {
			uniformInfo[name] = { name, type, location };
		}
	}
	return uniformInfo;
};

const createAttributeInfo = (gl, program) => {
	const attributeInfo = {};
	const length = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < length; i += 1) {
		const { name, type } = gl.getActiveAttrib(program, i);
		const location = gl.getAttribLocation(program, name);
		const buffer = gl.createBuffer();
		const size = TypeToSize[type];
		if (!size) {
			throw new Error(`Unknown webgl type: ${type}!`);
		}
		if (typeof location !== "undefined") {
			attributeInfo[name] = { name, location, buffer, type, size };
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(location);
		}
	}
	return attributeInfo;
};

const asFloat32Array = (array) => {
	if (array instanceof Float32Array) {
		return array;
	}
	if (!Array.isArray(array)) {
		throw new Error(`Expected array: ${array}!`);
	}
	return new Float32Array(array);
};

export const WebglWrapper = {
	createProgramInfo,
	setUniforms,
	setMegaTexture,
	drawArrays,
	clear,
	clearDepth,
};
