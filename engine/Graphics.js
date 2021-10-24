import { Transform } from "./data/Transform.js";
import { Color } from "./data/Color.js";
import { Vec2 } from "./data/Vec2.js";
import { Vec3 } from "./data/Vec3.js";
import { Mat3 } from "./data/Mat3.js";
import { Sprite } from "./data/Sprite.js";
import { RenderCommand, Renderer } from "./Renderer.js";

export const Graphics = {};

/** @type {number} */
Graphics.width = null;

/** @type {number} */
Graphics.height = null;

/** @type {boolean} */
Graphics.antiAlias = null;

/** @type {Transform[]} */
Graphics.transformStack = null;

/** @type {Renderer} */
Graphics.renderer = null;

/**
 *
 * @returns {Transform}
 */
Graphics.currentTransform = function () {
	const transformIndex = Graphics.transformStack.length - 1;
	return Graphics.transformStack[transformIndex];
};

/**
 *
 * @param {Transform} transform
 */
Graphics.pushTransform = function (transform) {
	const currentTransform = Graphics.currentTransform();
	const nextTransform = Transform.compose(currentTransform, transform);
	Graphics.transformStack.push(nextTransform);
};

/**
 *
 */
Graphics.popTransform = function () {
	Graphics.transformStack.pop();
};

/**
 *
 * @param {Vec2[]} points
 * @param {number} thickness
 * @param {Color} color
 */
Graphics.drawLines = function (points, thickness, color) {
	throw new Error("TODO");
};

/**
 * @param {Vec2} point1
 * @param {Vec2} point2
 * @param {Vec2} point3
 * @param {Color} color
 */
Graphics.drawTriangle = function (point1, point2, point3, color) {
	const currentTransform = Graphics.currentTransform();
	const transformMatrix = Transform.toMat3(currentTransform);

	const p1 = Vec3({ x: pos1.x, y: pos1.y, z: 1 });
	const p2 = Vec3({ x: pos2.x, y: pos2.y, z: 1 });
	const p3 = Vec3({ x: pos3.x, y: pos3.y, z: 1 });

	const v1 = Mat3.transform(transformMatrix, p1);
	const v2 = Mat3.transform(transformMatrix, p2);
	const v3 = Mat3.transform(transformMatrix, p3);

	Renderer.pushCommand(
		Graphics.renderer,
		new RenderCommand({
			vertexCoords: [v1.x, v1.y, v2.x, v2.y, v3.x, v3.y],
			textureCoords: [0, 0, 0, 0, 0, 0],
			texture: Graphics.renderer.emptyTexture,
			tint: color,
			z: currentTransform.z,
		})
	);
};

/**
 *
 * @param {Vec2} position
 * @param {number} width
 * @param {number} height
 * @param {Color} color
 */
Graphics.drawRectangle = function (position, width, height, color) {
	const currentTransform = Graphics.currentTransform();
	const transformMatrix = Transform.toMat3(currentTransform);

	const x1 = position.x;
	const x2 = x1 + width;
	const y1 = position.y;
	const y2 = y1 + height;

	const p1 = Vec3({ x: x1, y: y1, z: 1 });
	const p2 = Vec3({ x: x2, y: y1, z: 1 });
	const p3 = Vec3({ x: x2, y: y2, z: 1 });
	const p4 = Vec3({ x: x1, y: y2, z: 1 });

	const v1 = Mat3.transform(transformMatrix, p1);
	const v2 = Mat3.transform(transformMatrix, p2);
	const v3 = Mat3.transform(transformMatrix, p3);
	const v4 = Mat3.transform(transformMatrix, p4);

	Renderer.pushCommand(
		Graphics.renderer,
		new RenderCommand({
			vertexCoords: [v1.x, v1.y, v2.x, v2.y, v3.x, v3.y],
			textureCoords: [0, 0, 0, 0, 0, 0],
			texture: Graphics.renderer.emptyTexture,
			tint: color,
			z: currentTransform.z,
		})
	);
	Renderer.pushCommand(
		Graphics.renderer,
		new RenderCommand({
			vertexCoords: [v3.x, v3.y, v4.x, v4.y, v1.x, v1.y],
			textureCoords: [0, 0, 0, 0, 0, 0],
			texture: Graphics.renderer.emptyTexture,
			tint: color,
			z: currentTransform.z,
		})
	);
};

/**
 *
 * @param {Vec2} position
 * @param {number} width
 * @param {number} height
 * @param {Sprite} sprite
 */
Graphics.drawSprite = function (position, width, height, sprite, tint) {
	const currentTransform = Graphics.currentTransform();
	const transformMatrix = Transform.toMat3(currentTransform);

	const x1 = position.x;
	const x2 = x1 + width;
	const y1 = position.y;
	const y2 = y1 + height;

	const p1 = Vec3({ x: x1, y: y1, z: 1 });
	const p2 = Vec3({ x: x2, y: y1, z: 1 });
	const p3 = Vec3({ x: x2, y: y2, z: 1 });
	const p4 = Vec3({ x: x1, y: y2, z: 1 });

	const v1 = Mat3.transform(transformMatrix, p2);
	const v2 = Mat3.transform(transformMatrix, p1);
	const v3 = Mat3.transform(transformMatrix, p3);
	const v4 = Mat3.transform(transformMatrix, p4);

	const tx1 = sprite.x;
	const tx2 = tx1 + sprite.width;
	const ty1 = sprite.y;
	const ty2 = ty1 + sprite.height;

	Renderer.pushCommand(
		Graphics.renderer,
		new RenderCommand({
			vertexCoords: [v1.x, v1.y, v2.x, v2.y, v3.x, v3.y],
			textureCoords: [tx1, ty1, tx2, ty1, tx2, ty2],
			texture: sprite.texture,
			z: currentTransform.z,
			tint,
		})
	);
	Renderer.pushCommand(
		Graphics.renderer,
		new RenderCommand({
			vertexCoords: [v3.x, v3.y, v4.x, v4.y, v1.x, v1.y],
			textureCoords: [tx2, ty2, tx1, ty2, tx1, ty1],
			texture: sprite.texture,
			z: currentTransform.z,
			tint,
		})
	);
};

/**
 *
 * @param {Vec2} position
 * @param {string} text
 * @param {Font} font
 */
Graphics.drawText = function (position, text, font) {
	throw new Error("TODO");
};
