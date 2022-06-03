import "./math.js";
import "./keyboard.js";
import "./mouse.js";

import { Schema } from "./schema.js";
import { Project } from "./project.js";
import { Node, NodeTypes } from "./node.js";
import { Assets } from "./assets.js";
import { Runtime } from "./runtime.js";

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

Runtime.root = (await Assets.loadScene(Project.root)).hydrate();
Runtime.start();
