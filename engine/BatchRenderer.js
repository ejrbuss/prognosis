/**
 * Support tint?
 * Switch textureCoords to vec3
 *  - tx, ty, texture unit
 *  - keep texture unit as a 1x1 white pixel
 *  - for colored triangles pass tint and multiply
 *  - for textured triangles we can now provide tint (by default white)
 *
 * How textureCoords work:
 * - textures are encoded as a vec4
 * - it can be interpreted in two ways, as a color, or as a texture
 * - it is treated as a color if vec4.w != 0
 * - it is treated as a texture otherwise
 * - in color mode
 * 	- xyzw corresponds to rgba
 * - in texture mode
 * 	- xy correspond to the texture coordinates
 *  - z corresponds to the assigned texture unit
 *
 * How vertexCoords work:
 *  - z coordinates are managed by draw order
 *  - xy correspond to untransformed position
 *  - z corresponds to the space (screen or world)
 */

import { Types } from "./Types.js";
import { WebglWrapper } from "./WebglWrapper.js";

const AttributeBufferCapacity = 1024;
const WorldSpace = 0;
const ScreenSpace = 1;

let count = 0;
let textures = [];
let cmdStack = [];
let attributeBuffers = {
	aVertexCoord: new Float32Array(AttributeBufferCapacity * 3),
	aTextureCoord: new Float32Array(AttributeBufferCapacity * 4),
};

function pushColoredTriangle(options) {
	Types.check(
		{
			z: Types.Number,
			layerIndex: Types.Number,
			space: Types.Number,
			vertexCoords: [Types.Number],
			color: Types.Color,
		},
		options
	);
	if (options.color.alpha > 0) {
		cmdStack.push(options);
	}
}

function pushTexturedTriangle(options) {
	Types.check(
		{
			z: Types.Number,
			layerIndex: Types.Number,
			space: Types.Number,
			vertexCoords: [Types.Number],
			textureCoords: [Types.Number],
			// texture: Types.Texture,
		},
		options
	);
	cmdStack.push(options);
}

function flushWithUniforms(uniforms) {
	WebglWrapper.clear();
	WebglWrapper.setUniforms(uniforms);
	sortCmdStack(cmdStack);
	let drawCalls = 0;
	while (cmdStack.length) {
		const cmd = cmdStack.pop();
		const buffered = tryBuffer(cmd);
		if (!buffered) {
			drawCalls += 1;
			drawBuffered();
			cmdStack.push(cmd);
		}
	}
	if (count > 0) {
		drawCalls += 1;
		drawBuffered();
	}
	return drawCalls;
}

function sortCmdStack(cmdStack) {
	let depthOffset = 0;
	for (const { z } of cmdStack) {
		depthOffset = Math.max(-z, depthOffset);
	}
	let maxDepth = 0;
	for (const { z } of cmdStack) {
		maxDepth = Math.max(z + depthOffset, maxDepth);
	}
	cmdStack.sort((cmd1, cmd2) => {
		const zOrder1 = cmdZOrder(cmd1, depthOffset, maxDepth);
		const zOrder2 = cmdZOrder(cmd2, depthOffset, maxDepth);
		// Sort in reverse order, because we iterate backwards (Array#pop)
		return zOrder2 - zOrder1;
	});
}

function cmdZOrder(cmd, depthOffset, maxDepth) {
	const { z, layerIndex } = cmd;
	return layerIndex + (z + depthOffset) / maxDepth;
}

function tryBuffer(cmd) {
	if (count + 3 > AttributeBufferCapacity) {
		return false;
	} else if (cmd.color) {
		return tryBufferColoredTriangleCmd(cmd);
	} else {
		return tryBufferTexturedTriangleCmd(cmd);
	}
}

function tryBufferColoredTriangleCmd(cmd) {
	const { space, vertexCoords, color } = cmd;
	const { aVertexCoord, aTextureCoord } = attributeBuffers;
	const vertexCoordsOffset = count * 3;
	aVertexCoord[vertexCoordsOffset + 0] = vertexCoords[0];
	aVertexCoord[vertexCoordsOffset + 1] = vertexCoords[1];
	aVertexCoord[vertexCoordsOffset + 2] = space;
	aVertexCoord[vertexCoordsOffset + 3] = vertexCoords[2];
	aVertexCoord[vertexCoordsOffset + 4] = vertexCoords[3];
	aVertexCoord[vertexCoordsOffset + 5] = space;
	aVertexCoord[vertexCoordsOffset + 6] = vertexCoords[4];
	aVertexCoord[vertexCoordsOffset + 7] = vertexCoords[5];
	aVertexCoord[vertexCoordsOffset + 8] = space;
	const textureCoordsOffset = count * 4;
	let { red, green, blue, alpha } = color;
	aTextureCoord[textureCoordsOffset + 0] = red;
	aTextureCoord[textureCoordsOffset + 1] = green;
	aTextureCoord[textureCoordsOffset + 2] = blue;
	aTextureCoord[textureCoordsOffset + 3] = alpha;
	aTextureCoord[textureCoordsOffset + 4] = red;
	aTextureCoord[textureCoordsOffset + 5] = green;
	aTextureCoord[textureCoordsOffset + 6] = blue;
	aTextureCoord[textureCoordsOffset + 7] = alpha;
	aTextureCoord[textureCoordsOffset + 8] = red;
	aTextureCoord[textureCoordsOffset + 9] = green;
	aTextureCoord[textureCoordsOffset + 10] = blue;
	aTextureCoord[textureCoordsOffset + 11] = alpha;
	count += 3;
	return true;
}

function tryBufferTexturedTriangleCmd(cmd) {
	const { space, vertexCoords, textureCoords, texture } = cmd;
	let textureUnit = textures.indexOf(texture);
	if (textureUnit === -1) {
		const textureCount = textures.length;
		if (textureCount === WebglWrapper.MaxTextures) {
			return false;
		}
		textureUnit = textureCount;
		textures.push(texture);
	}
	const { aVertexCoord, aTextureCoord } = attributeBuffers;
	const vertexCoordsOffset = count * 3;
	aVertexCoord[vertexCoordsOffset + 0] = vertexCoords[0];
	aVertexCoord[vertexCoordsOffset + 1] = vertexCoords[1];
	aVertexCoord[vertexCoordsOffset + 2] = space;
	aVertexCoord[vertexCoordsOffset + 3] = vertexCoords[2];
	aVertexCoord[vertexCoordsOffset + 4] = vertexCoords[3];
	aVertexCoord[vertexCoordsOffset + 5] = space;
	aVertexCoord[vertexCoordsOffset + 6] = vertexCoords[4];
	aVertexCoord[vertexCoordsOffset + 7] = vertexCoords[5];
	aVertexCoord[vertexCoordsOffset + 8] = space;
	const textureCoordsOffset = count * 4;
	aTextureCoord[textureCoordsOffset + 0] = textureCoords[0];
	aTextureCoord[textureCoordsOffset + 1] = textureCoords[1];
	aTextureCoord[textureCoordsOffset + 2] = textureUnit;
	aTextureCoord[textureCoordsOffset + 3] = 0;
	aTextureCoord[textureCoordsOffset + 4] = textureCoords[2];
	aTextureCoord[textureCoordsOffset + 5] = textureCoords[3];
	aTextureCoord[textureCoordsOffset + 6] = textureUnit;
	aTextureCoord[textureCoordsOffset + 7] = 0;
	aTextureCoord[textureCoordsOffset + 8] = textureCoords[4];
	aTextureCoord[textureCoordsOffset + 9] = textureCoords[5];
	aTextureCoord[textureCoordsOffset + 10] = textureUnit;
	aTextureCoord[textureCoordsOffset + 11] = 0;
	count += 3;
	return true;
}

function drawBuffered() {
	WebglWrapper.setTextures(textures);
	WebglWrapper.drawArrays(attributeBuffers, count);
	count = 0;
	textures = [];
}

export const BatchRenderer = {
	WorldSpace,
	ScreenSpace,
	pushColoredTriangle,
	pushTexturedTriangle,
	flushWithUniforms,
};
