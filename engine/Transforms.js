import { Mat3 } from "./linearAlgebra/Mat3.js";

const Identity = {
	position: {
		x: 0,
		y: 0,
		z: 0,
	},
	rotation: 0,
	scale: {
		x: 1,
		y: 1,
	},
};

const combine = (t1, t2) => {
	const p1 = t1.position;
	const p2 = t2.position;
	const s1 = t1.scale;
	const s2 = t2.scale;
	return {
		position: {
			x: p1.x + p2.x,
			y: p1.y + p2.y,
			z: p1.z + p2.z,
		},
		rotation: t1.rotation + t2.rotation,
		scale: {
			x: s1.x * s2.x,
			y: s1.y * s2.y,
		},
	};
};

const toMat3 = (transform) => {
	const { position, rotation, scale } = transform;
	const T = Mat3.translate(Mat3.Identity, position.x, position.y);
	const R = Mat3.rotateRadians(T, (rotation * Math.PI) / 180);
	const S = Mat3.scale(R, scale.x, scale.y);
	return S;
};

export const Transforms = {
	Identity,
	combine,
	toMat3,
};
