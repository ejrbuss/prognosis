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
	gl: WebGL2RenderingContext;
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
		this.gl = gl;
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
		throw new Error(gl.getShaderInfoLog(shader) ?? "Failed to compile shader!");
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
		throw new Error("Failed to create program!");
	}
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program) ?? "Failed to link program!");
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
			throw new Error("Failed to create buffer!");
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
			throw new Error(`Unsupported webgl type: ${type.toString(16)}`);
	}
}
