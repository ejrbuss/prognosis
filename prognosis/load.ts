import { Schema } from "./data/schema.js";
import { Node } from "./nodes/node.js";

const ModulesSchema = Schema.array(Schema.string);
const modulesJson = await (await fetch("/modules.json")).json();
const modules = ModulesSchema.assert(modulesJson);
await Promise.all(
	modules.map(async (modulePath) => {
		const exportedValues = await import(modulePath);
		Object.values(exportedValues).forEach((value) => {
			if (
				typeof value === "function" &&
				(Node.isPrototypeOf(value) || value === Node)
			) {
				const nodeConstructor = value as typeof Node;
				const metadata = Node.metadataFor(nodeConstructor);
				metadata.type = nodeConstructor;
				metadata.modulePath = modulePath;
				try {
					new nodeConstructor();
				} catch (error) {
					console.error(error);
				}
			}
		});
	})
);
