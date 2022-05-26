import { Component } from "../core.js";

// TODO support builtin datatypes: Transform, Color, Entity, Image, Sound
export const Transform = new Component({
	sx: Number,
	ky: Number,
	kx: Number,
	sy: Number,
	x: Number,
	y: Number,
});
