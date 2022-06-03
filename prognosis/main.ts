import "./math.js";
import "./input/keyboard.js";
import "./input/mouse.js";

import { Schema } from "./data/schema.js";
import { Project } from "./project.js";
import { Node, NodeTypes } from "./nodes/node.js";
import { Resources } from "./resources/resources.js";
import { Runtime } from "./runtime.js";
import { NodeTreeResource } from "./resources/nodeTreeResource.js";

// Load dynamic modules

const ModulesSchema = Schema.array(Schema.string);
const modulesJson = await (await fetch("/modules.json")).json();
const modules = ModulesSchema.assert(modulesJson);
await Promise.all(
	modules.map(async (modulePath) => {
		const exportedValues = await import(modulePath);
		Object.values(exportedValues).forEach((value) => {
			// Register NodeTypes
			if (typeof value === "function" && value.prototype instanceof Node) {
				NodeTypes[value.name] = value as typeof Node;
			}
		});
	})
);

// Start runtime

Runtime.root = (await Resources.load(NodeTreeResource, Project.root)).node;
Runtime.start();
