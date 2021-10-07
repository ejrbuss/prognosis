// TODO another "rewrite"

import { Util } from "./Util.js";
import { Texture } from "./Texture.js";

/** @type {HTMLCanvasElement} */
let gameCanvas;
/** @type {WebGL2RenderingContext} */
let gl;

const InitialSize = 128;
const ResizeFactor = 2;

const Uniforms = {
	camera: null,
	megaTextureDimensions: null,
	megaTexture: null,
};

const Attributes = {
	vertex: null,
	uv: null,
};

const AttributeSizes = {
	vertex: 3,
	uv: 2,
};

const Buffers = {
	vertex: null,
	uv: null,
};

const BufferData = {
	capacity: InitialSize,
	vertex: new Float32Array(InitialSize * AttributeSizes.vertex),
	uv: new Float32Array(InitialSize * AttributeSizes.uv),
};

const Points = {
	length: 0,
	capacity: InitialSize,
	vertex: new Float32Array(InitialSize * AttributeSizes.vertex),
	uv: new Float32Array(InitialSize * AttributeSizes.uv),
};

const Lines = {
	length: 0,
	capacity: InitialSize,
	vertex: new Float32Array(InitialSize * AttributeSizes.vertex),
	uv: new Float32Array(InitialSize * AttributeSizes.uv),
};

const Triangles = {
	length: 0,
	capacity: InitialSize,
	vertex: new Float32Array(InitialSize * AttributeSizes.vertex),
	uv: new Float32Array(InitialSize * AttributeSizes.uv),
};

const init = async () => {
	Texture.init();

	gameCanvas = document.getElementById("game-canvas");
	gameCanvas.width = Graphics.width;
	gameCanvas.height = Graphics.height;

	gl = gameCanvas.getContext("webgl", {
		antialias: Graphics.antiAlias,
		desynchronized: true,
	});

	Graphics.camera = {
		x: 0,
		y: 0,
		width: Graphics.width,
		height: Graphics.height,
	};

	window.addEventListener("resize", resize);
	resize();

	const vertexShader = await loadShader(
		gl.VERTEX_SHADER,
		"engine/shader/vertex.glsl"
	);
	const fragmentShader = await loadShader(
		gl.FRAGMENT_SHADER,
		"engine/shader/fragment.glsl"
	);
	const program = gl.createProgram();

	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Shader link error! ${gl.getProgramInfoLog(program)}`);
	}

	for (const attribute in Attributes) {
		const attributeLocation = gl.getAttribLocation(program, `a_${attribute}`);
		const buffer = gl.createBuffer();
		const size = AttributeSizes[attribute];

		Attributes[attribute] = attributeLocation;
		Buffers[attribute] = buffer;

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(attributeLocation, size, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(attributeLocation);
	}

	gl.useProgram(program);

	for (const uniform in Uniforms) {
		Uniforms[uniform] = gl.getUniformLocation(program, `u_${uniform}`);
	}

	gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.enable(gl.DEPTH_TEST);
};

const resize = () => {
	const gameAspect = Graphics.width / Graphics.height;
	const screenAspect = innerWidth / innerHeight;

	if (screenAspect < gameAspect) {
		gameCanvas.style.width = "100vw";
		gameCanvas.style.height = `calc(100vw / ${gameAspect})`;
	} else {
		gameCanvas.style.width = `calc(100vh * ${gameAspect})`;
		gameCanvas.style.height = "100vh";
	}
};

const loadShader = async (type, url) => {
	const source = await Util.fetchText(url);
	const shader = gl.createShader(type);

	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(
			`Shader compilation error in ${url}! ${gl.getShaderInfoLog(shader)}`
		);
	}
	return shader;
};

// ?? pull dependencies and create ??
// render = (renderContext, scene) => {}

const render = () => {
	// Prepare data
	writeBuffers();
	writeMegaTexture();

	// Uniforms
	gl.uniform4fv(
		Uniforms.camera,
		new Float32Array([
			Render.camera.x,
			Render.camera.y,
			Render.camera.width,
			Render.camera.height,
		])
	);
	gl.uniform2fv(
		Uniforms.megaTextureDimensions,
		new Float32Array([
			Texture.MegaTexture.canvas.width,
			Texture.MegaTexture.canvas.height,
		])
	);
	gl.uniform1i(Uniforms.megaTexture, 0);

	// Draw calls
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	if (Points.length) {
		gl.drawArrays(gl.POINTS, 0, Points.length);
	}
	if (Lines.length) {
		gl.drawArrays(gl.LINES, Points.length, Lines.length);
	}
	if (Triangles.length) {
		gl.drawArrays(gl.TRIANGLES, Points.length + Lines.length, Triangles.length);
	}
	Points.length = Lines.length = Triangles.length = 0;
};

const calculateNewCapacity = (length, currenctCapacity) => {
	let newCapacity = currenctCapacity * ResizeFactor;
	while (length > newCapacity) {
		newCapacity *= ResizeFactor;
	}
	return newCapacity;
};

const writeBuffers = () => {
	// Check that the JS buffers have room
	const length = Points.length + Lines.length + Triangles.length;
	if (length > BufferData.capacity) {
		BufferData.capacity = calculateNewCapacity(length, BufferData.capacity);
		for (const attribute in Attributes) {
			BufferData[attribute] = new Float32Array(
				BufferData.capacity * AttributeSizes[attribute]
			);
		}
	}

	// Write vertex data
	for (const attribute in Attributes) {
		const buffer = Buffers[attribute];
		const bufferData = BufferData[attribute];
		const size = AttributeSizes[attribute];
		const pointsLength = Points.length * size;
		const linesLength = Lines.length * size;
		const trianglesLength = Triangles.length * size;

		bufferData.set(Points[attribute].subarray(0, pointsLength), 0);
		bufferData.set(Lines[attribute].subarray(0, linesLength), pointsLength);
		bufferData.set(
			Triangles[attribute].subarray(0, trianglesLength),
			pointsLength + linesLength
		);

		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
	}
};

const writeMegaTexture = () => {
	if (Texture.MegaTexture.dirty) {
		gl.texImage2D(
			gl.TEXTURE_2D,
			0,
			gl.RGBA,
			gl.RGBA,
			gl.UNSIGNED_BYTE,
			Texture.MegaTexture.canvas
		);
		Texture.MegaTexture.dirty = false;
	}
};

const pushPoints = (vs, uvs) => {
	push(Points, vs, uvs);
};

const pushLines = (vs, uvs) => {
	push(Lines, vs, uvs);
};

const pushTriangles = (vs, uvs) => {
	push(Triangles, vs, uvs);
};

const push = (geo, vs, uvs) => {
	const { length, capacity } = geo;
	const newLength = length + vs.length / 3;
	if (newLength > capacity) {
		const newCapacity = (geo.capacity = calculateNewCapacity(
			newLength,
			capacity
		));
		for (const attribute in Attributes) {
			const newData = new Float32Array(newCapacity * AttributeSizes[attribute]);
			newData.set(geo[attribute], 0);
			geo[attribute] = newData;
		}
	}
	geo.vertex.set(vs, length * AttributeSizes.vertex);
	geo.uv.set(uvs, length * AttributeSizes.uv);
	geo.length = newLength;
};

export const Graphics = {
	camera: null,
	width: null,
	height: null,
	antiAlias: null,
	frameRate: 0,
	init,
	render,
	pushPoints,
	pushLines,
	pushTriangles,
};
