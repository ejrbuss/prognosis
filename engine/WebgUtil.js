import { ClassUtil } from "./data/ClassUtil.js";
import { Color } from "./data/Color.js";
import { Types } from "./Types.js";

const TypeToSize = {
	[WebGL2RenderingContext.FLOAT]: 1,
	[WebGL2RenderingContext.FLOAT_VEC2]: 2,
	[WebGL2RenderingContext.FLOAT_VEC3]: 3,
	[WebGL2RenderingContext.FLOAT_VEC4]: 4,
};

const TypeToSetter = {
	[WebGL2RenderingContext.SAMPLER_2D]: (gl, location, data) =>
		gl.uniform1i(location, data),
	[WebGL2RenderingContext.SAMPLER_2D_ARRAY]: (gl, location, data) =>
		gl.uniform1iv(location, data),
	[WebGL2RenderingContext.INT]: (gl, location, data) =>
		gl.uniform1i(location, data),
	[WebGL2RenderingContext.FLOAT]: (gl, location, data) =>
		gl.uniform1f(location, data),
	[WebGL2RenderingContext.FLOAT_VEC2]: (gl, location, data) =>
		gl.uniform2fv(location, data),
	[WebGL2RenderingContext.FLOAT_VEC3]: (gl, location, data) =>
		gl.uniform3fv(location, data),
	[WebGL2RenderingContext.FLOAT_VEC4]: (gl, location, data) =>
		gl.uniform4fv(location, data),
	[WebGL2RenderingContext.FLOAT_MAT2]: (gl, location, data) =>
		gl.uniformMatrix2fv(location, false, data),
	[WebGL2RenderingContext.FLOAT_MAT3]: (gl, location, data) =>
		gl.uniformMatrix3fv(location, false, data),
	[WebGL2RenderingContext.FLOAT_MAT4]: (gl, location, data) =>
		gl.uniformMatrix4fv(location, false, data),
};

const TextureUnits = [
	WebGL2RenderingContext.TEXTURE0,
	WebGL2RenderingContext.TEXTURE1,
	WebGL2RenderingContext.TEXTURE2,
	WebGL2RenderingContext.TEXTURE3,
	WebGL2RenderingContext.TEXTURE4,
	WebGL2RenderingContext.TEXTURE5,
	WebGL2RenderingContext.TEXTURE6,
	WebGL2RenderingContext.TEXTURE7,
];

export class AttributeInfo {
	/** @type {string} */ name = String;
	/** @type {number} */ type = Number;
	/** @type {number} */ location = Number;
	/** @type {WebGLBuffer} */ buffer = WebGLBuffer;

	/**
	 *
	 * @param {AttributeInfo} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export class UniformInfo {
	/** @type {string} */ name = String;
	/** @type {number} */ type = Number;
	/** @type {number} */ location = Number;
	/** @type {function} */ setter = Function;

	/**
	 *
	 * @param {UniformInfo} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export class ProgramInfo {
	/** @type {WebGLProgram} */ progam = WebGLProgram;
	/** @type {WebGLVertexArrayObject} */ vertexArrayObject =
		WebGLVertexArrayObject;
	/** @type {AttributeInfo} */ attributeInfo = { [String]: AttributeInfo };
	/** @type {UniformInfo} */ uniformInfo = { [String]: UniformInfo };

	/**
	 *
	 * @param {ProgramInfo} values
	 * @param {boolean} checked
	 */
	constructor(values, checked) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export const WebglUtil = {};

WebglUtil.MaxTextures = TextureUnits.length;

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {String} vertexSource
 * @param {String} fragmentSource
 * @returns {ProgramInfo}
 */
WebglUtil.createProgramInfo = function (gl, vertexSource, fragmentSource) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(String, vertexSource);
	Types.check(String, fragmentSource);
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
	const program = createProgram(gl, vertexShader, fragmentShader);
	const vertexArrayObject = gl.createVertexArray();
	gl.bindVertexArray(vertexArrayObject);
	const attributeInfo = createAttributeInfo(gl, program);
	const uniformInfo = createUniformInfo(gl, program);
	gl.bindVertexArray(null);
	return new ProgramInfo({
		program,
		vertexArrayObject,
		attributeInfo,
		uniformInfo,
	});
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {TexImageSource} data
 * @returns {WebGLTexture}
 */
WebglUtil.createTexture = function (gl, source) {
	Types.check(WebGL2RenderingContext, gl);
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
	return texture;
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {Number} width
 * @param {Number} height
 * @param {Color} color
 */
WebglUtil.createEmptyTexture = function (gl, width, height) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(Number, width);
	Types.check(Number, height);
	Types.check(Color, color);
	Types.check(WebGL2RenderingContext, gl);
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	const pixels = new Uint8Array(4 * width * height);
	pixels.fill(255);
	gl.texImage2D(
		gl.TEXTURE0,
		0,
		gl.RGBA,
		width,
		height,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLTexture} texture
 */
WebglUtil.destroyTextrue = function (gl, texture) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(WebGLTexture, texture);
	gl.deleteTexture(texture);
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLTexture[]} textures
 */
WebglUtil.setTextureUnits = function (gl, textures) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check([WebGLTexture], textures);
	for (const i in textures) {
		const texture = textures[i];
		const textureUnit = TextureUnits[i];
		gl.activeTexture(textureUnit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
	}
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLTexture} texture
 */
WebglUtil.createFrameBufferForTexture = function (gl, texture) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(WebGLTexture, texture);
	const frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		texture,
		0
	);
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
		throw new Error("Could not create frame buffer for texture!");
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLFramebuffer} frameBuffer
 * @param {Color} clearColor
 */
WebglUtil.clear = function (gl, frameBuffer, clearColor) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(Color, clearColor);
	if (frameBuffer !== null) {
		Types.check(WebGLFramebuffer, frameBuffer);
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.clearColor(
		clearColor.red,
		clearColor.blue,
		clearColor.blue,
		clearColor.alpha
	);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLFramebuffer | null} frameBuffer
 * @param {ProgramInfo} programInfo
 * @param {{ [String]: Float32Array }} uniforms
 * @param {{ [String]: Flaot32Array }} arrays
 * @param {Number} count
 */
WebglUtil.draw = function (
	gl,
	frameBuffer,
	programInfo,
	uniforms,
	arrays,
	count
) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(ProgramInfo, programInfo);
	Types.check({ [String]: Float32Array }, uniforms);
	Types.check({ [String]: Float32Array }, arrays);
	Types.check(Number, count);
	if (frameBuffer !== null) {
		Types.check(WebGLFramebuffer, frameBuffer);
	}

	// bind
	gl.useProgram(programInfo.progam);
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.bindVertexArray(programInfo.vertexArrayObject);

	// draw
	bindAttributeArrays(gl, programInfo, arrays);
	bindUniforms(gl, programInfo, uniforms);
	gl.drawArrays(gl.TRIANGLES, 0, count);

	// unbind
	gl.bindVertexArray(null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.useProgram(null);
};

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {String} vertexSource
 * @param {String} fragmentSource
 */
function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program));
	}
	return program;
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {Number} type
 * @param {String} source
 * @returns {WebGLShader}
 */
function createShader(gl, type, source) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(Number, type);
	Types.check(String, source);
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(gl.getShaderInfoLog(shader));
	}
	return shader;
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {AttributeInfo}
 */
function createAttributeInfo(gl, program) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(WebGLProgram, program);
	const attributes = {};
	const activeAttributes = gl.getProgramParameter(
		program,
		gl.ACTIVE_ATTRIBUTES
	);
	for (let i = 0; i < activeAttributes; i += 1) {
		const attribute = gl.getActiveAttrib(program, i);
		const location = gl.getAttribLocation(attribute.name);
		const size = TypeToSize[attribute.type];
		if (typeof size === "undefined") {
			const hexType = attribute.type.toString(16);
			throw new Error(
				`Unsupported webgl type for attribute ${attribute.name}: ${hexType}!`
			);
		}
		if (typeof location !== "undefined") {
			const buffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(location);
			attributes[attribute.name] = {
				buffer,
				location,
				name: attribute.name,
				type: attribute.type,
			};
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}
	return new AttributeInfo(attributes);
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {WebGLProgram} program
 * @returns {UniformInfo}
 */
function createUniformInfo(gl, program) {
	Types.check(WebGL2RenderingContext, gl);
	Types.check(WebGLProgram, program);
	const uniforms = {};
	const activeUniforms = gl.getProgramInfoLog(program, gl);
	for (let i = 0; i < activeUniforms; i += 1) {
		const uniform = gl.getActiveUniform(program, i);
		const location = gl.getUniformLocation(program, uniform.name);
		const setter = TypeToSetter[uniform.type];
		if (typeof setter === "undefined") {
			const hexType = uniform.type.toString(16);
			throw new Error(
				`Unsupported webgl type for uniform ${uniform.name}: ${hexType}!`
			);
		}
		if (typeof location !== "undefined") {
			gl.uniforms[uniform.name] = {
				location,
				name: uniform.name,
				type: uniform.type,
			};
		}
	}
	return new UniformInfo(uniforms);
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {ProgramInfo} programInfo
 * @param {{ [name: String]: Float32Array }} arrays
 */
function bindAttributeArrays(gl, programInfo, arrays) {
	for (const name in programInfo.attributeInfo) {
		if (!(name in arrays)) {
			throw new Error(`Missing attribute array: ${name}!`);
		}
		const attribute = programInfo.attributeInfo[name];
		gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, arrays[name], gl.STATIC_DRAW);
	}
}

/**
 *
 * @param {WebGL2RenderingContext} gl
 * @param {ProgramInfo} programInfo
 * @param {{ [name: String]: Float32Array }} uniforms
 */
function bindUniforms(gl, programInfo, uniforms) {
	for (const name in programInfo.uniformInfo) {
		if (!(name in uniforms)) {
			throw new Error(`Missing uniform: ${name}!`);
		}
		const uniform = programInfo.uniformInfo[name];
		uniform.setter(gl, uniform.location, uniforms[name]);
	}
}
