import { Component } from "../runtime/component.js";
import { Vector } from "../runtime/vector.js";

export class Transform extends Component {
	position: Vector = new Vector(0);
	scale: Vector = new Vector(1);
	rotation: number = 0;
}

/*

id : (a) -> a forall a
id = (a) -> a

nth : (Vec a n, m) -> forall a, where m < n
nth = (v, m) -> Ptr.Add(v, m)
*/
