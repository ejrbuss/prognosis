import { Component } from "../runtime/component.js";
import { Vector } from "../runtime/vector.js";

export class Transform extends Component {
	position: Vector = new Vector(0);
	scale: Vector = new Vector(1);
	rotation: number = 0;
}
