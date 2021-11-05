import { ProgramInterface } from "./webgl.js";

export class Command {
	constructor(
		public vertexData: Float32Array,
		public textureCoordData: Float32Array,
		public textrureData: WebGLTexture,
		public tintData: Float32Array
	) {}
}

export class Renderer {
	constructor(gl: WebGL2RenderingContext) {}
	buffer(command: Command) {}
	flush(transformData: Float32Array) {}
	postProcess(program: ProgramInterface) {}
	swap() {}
}
