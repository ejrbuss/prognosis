import { Mouse } from "../prognosis/mouse.js";
import { Node, icon } from "../prognosis/nodes/node.js";
import { Rectangle } from "../prognosis/nodes/rectangle.js";
import { Color } from "../prognosis/data/color.js";
import { Text } from "../prognosis/nodes/text.js";
import { Runtime } from "../prognosis/runtime.js";
import { Project } from "../prognosis/project.js";

@icon("bug-outline")
export class DebugInfo extends Node {
	text?: Text;
	outline?: Rectangle;

	childrenChanged() {
		this.text = this.get(Text);
		this.outline = this.get(Rectangle);
		if (this.outline) {
			this.outline.width = Project.graphics.width;
			this.outline.height = Project.graphics.height;
			this.outline.fill = false;
			this.outline.strokeColor = Color.Yellow;
		}
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
