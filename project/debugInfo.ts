import { Mouse } from "../prognosis/mouse.js";
import { Node, icon } from "../prognosis/nodes/node.js";
import { Text } from "../prognosis/nodes/text.js";
import { Runtime } from "../prognosis/runtime.js";

@icon("bug-outline")
export class DebugInfo extends Node {
	text?: Text;

	childrenChanged() {
		this.text = this.get(Text);
	}

	update() {
		if (this.text !== undefined) {
			const fps = (1 / Runtime.dt).toFixed(0);
			const x = Mouse.x.toFixed(0);
			const y = Mouse.y.toFixed(0);
			this.text.text = `FPS: ${fps} Mouse: ${x}, ${y}`;
		}
	}
}
