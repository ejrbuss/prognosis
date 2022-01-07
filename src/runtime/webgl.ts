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

export const MaxTextures = TextureUnits.length;

export class WebGLError extends Error {}

export class UniformInterface {
	constructor(
		public name: string,
		public type: number,
		public location: WebGLUniformLocation,
		public modify: (data: Float32Array) => void
	) {}
}

export class AttributeInterface {
	constructor(
		public name: string,
		public type: number,
		public buffer: WebGLBuffer
	) {}
}

export class ProgramInterface {
	program: WebGLProgram;
	vao: WebGLVertexArrayObject;
	uniforms: Record<string, UniformInterface> = {};
	attributes: Record<string, AttributeInterface> = {};

	constructor(
		gl: WebGL2RenderingContext,
		vertexSource: string,
		fragmentSource: string
	) {
		const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
		const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
		const program = createProgram(gl, vertexShader, fragmentShader);
		const vao = gl.createVertexArray();
		if (!vao) {
			throw new Error("Failed to create vao!");
		}
		this.program = program;
		this.vao = vao;
		gl.bindVertexArray(vao);
		this.uniforms = createUniformInterfaces(gl, program);
		this.attributes = createAttributeInterfaces(gl, program);
		gl.bindVertexArray(null);
	}
}

export function createShader(
	gl: WebGL2RenderingContext,
	source: string,
	type: number
): WebGLShader {
	const shader = gl.createShader(type);
	if (!shader) {
		throw new Error("Failed to create shader!");
	}
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new WebGLError(
			gl.getShaderInfoLog(shader) ?? "Failed to compile shader!"
		);
	}
	return shader;
}

export function createProgram(
	gl: WebGL2RenderingContext,
	vertexShader: WebGLShader,
	fragmentShader: WebGLShader
): WebGLProgram {
	const program = gl.createProgram();
	if (!program) {
		throw new WebGLError("Failed to create program!");
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new WebGLError(
			gl.getProgramInfoLog(program) ?? "Failed to link program!"
		);
	}
	return program;
}

export function createUniformInterfaces(
	gl: WebGL2RenderingContext,
	program: WebGLProgram
): Record<string, UniformInterface> {
	const uniforms: Record<string, UniformInterface> = {};
	const activeUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	for (let i = 0; i < activeUniforms; i += 1) {
		const info = gl.getActiveUniform(program, i);
		if (!info) {
			continue;
		}
		const location = gl.getUniformLocation(program, info.name);
		if (!location) {
			continue;
		}
		uniforms[info.name] = new UniformInterface(
			info.name,
			info.type,
			location,
			modifyFunctionFor(gl, info.type, location)
		);
	}
	return uniforms;
}

export function createAttributeInterfaces(
	gl: WebGL2RenderingContext,
	program: WebGLProgram
): Record<string, AttributeInterface> {
	const attributes: Record<string, AttributeInterface> = {};
	const activeAttributes = gl.getProgramParameter(
		program,
		gl.ACTIVE_ATTRIBUTES
	);
	for (let i = 0; i < activeAttributes; i += 1) {
		const info = gl.getActiveAttrib(program, i);
		if (!info) {
			continue;
		}
		const location = gl.getAttribLocation(program, info.name);
		const buffer = gl.createBuffer();
		if (!buffer) {
			throw new WebGLError("Failed to create buffer!");
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(location, info.size, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(location);
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		attributes[info.name] = new AttributeInterface(
			info.name,
			info.type,
			buffer
		);
	}
	return attributes;
}

export function modifyFunctionFor(
	gl: WebGL2RenderingContext,
	type: number,
	location: WebGLUniformLocation
): (data: Float32Array) => void {
	switch (type) {
		case WebGL2RenderingContext.SAMPLER_2D:
			return (data) => gl.uniform1iv(location, data);
		case WebGL2RenderingContext.FLOAT:
			return (data) => gl.uniform1fv(location, data);
		case WebGL2RenderingContext.FLOAT_VEC2:
			return (data) => gl.uniform2fv(location, data);
		case WebGL2RenderingContext.FLOAT_VEC3:
			return (data) => gl.uniform3fv(location, data);
		case WebGL2RenderingContext.FLOAT_VEC4:
			return (data) => gl.uniform4fv(location, data);
		case WebGL2RenderingContext.FLOAT_MAT2:
			return (data) => gl.uniformMatrix2fv(location, false, data);
		case WebGL2RenderingContext.FLOAT_MAT3:
			return (data) => gl.uniformMatrix3fv(location, false, data);
		case WebGL2RenderingContext.FLOAT_MAT4:
			return (data) => gl.uniformMatrix4fv(location, false, data);
		default:
			throw new WebGLError(`Unsupported webgl type: ${type.toString(16)}!`);
	}
}

export function createTexture(
	gl: WebGL2RenderingContext,
	source: TexImageSource
): WebGLTexture {
	const texture = gl.createTexture();
	if (!texture) {
		throw new WebGLError("Failed to create texture!");
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

export function createTemptyTexture(
	gl: WebGL2RenderingContext,
	width: number,
	height: number
): WebGLTexture {
	const pixels = new Uint8Array(4 * width * height);
	pixels.fill(255);
	const texture = gl.createTexture();
	if (!texture) {
		throw new WebGLError("Failed to create texture!");
	}
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
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
	gl.bindTexture(gl.TEXTURE_2D, null);
	return texture;
}

export function destroyTexture(
	gl: WebGL2RenderingContext,
	texture: WebGLTexture
) {
	gl.deleteTexture(texture);
}

export function createFrameBuffer(
	gl: WebGL2RenderingContext,
	texture: WebGLTexture
): WebGLFramebuffer {
	const frameBuffer = gl.createFramebuffer();
	if (!frameBuffer) {
		throw new WebGLError("Failed to create framebuffer!");
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(
		gl.FRAMEBUFFER,
		gl.COLOR_ATTACHMENT0,
		gl.TEXTURE_2D,
		texture,
		0
	);
	if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
		throw new WebGLError("Failed to create framebuffer!");
	}
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	return frameBuffer;
}

export function draw(
	gl: WebGL2RenderingContext,
	frameBuffer: WebGLFramebuffer | null,
	programInterface: ProgramInterface,
	uniformData: Record<string, Float32Array>,
	attributeData: Record<string, Float32Array>,
	textures: WebGLTexture[],
	count: number
) {
	// bind
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.useProgram(programInterface.program);
	gl.bindVertexArray(programInterface.vao);

	const uniforms = programInterface.uniforms;
	for (const name in uniforms) {
		const data = uniformData[name];
		if (data) {
			uniforms[name].modify(data);
		}
	}

	const attributes = programInterface.attributes;
	for (const name in attributes) {
		const data = attributeData[name];
		if (data) {
			const buffer = attributes[name].buffer;
			gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}

	for (const i in textures) {
		const texture = textures[i];
		const textureUnit = TextureUnits[i];
		gl.activeTexture(textureUnit);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	// draw
	gl.drawArrays(gl.TRIANGLES, 0, count);

	// unbind
	gl.bindVertexArray(null);
	gl.useProgram(null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}
