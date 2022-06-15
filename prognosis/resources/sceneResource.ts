import { Node } from "../nodes/node.js";
import { Schema, SchemaType } from "../data/schema.js";
import { Resource, Resources } from "./resources.js";
import { JsonData } from "../data/store.js";

const NodeDataSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	variables: Schema.record(Schema.any),
	children: Schema.array(Schema.number),
});

type NodeData = SchemaType<typeof NodeDataSchema>;

export const SceneDataSchema = Schema.object({
	root: Schema.number,
	nodeData: Schema.array(NodeDataSchema),
});

export type SceneData = SchemaType<typeof SceneDataSchema>;

export class SceneResource implements Resource {
	static toStore(scene: SceneResource): JsonData {
		return scene.sceneData;
	}

	static fromStore(data: JsonData): SceneResource {
		return new SceneResource(undefined as any, SceneDataSchema.assert(data));
	}

	static load(url: string): Promise<SceneResource> {
		return Resources.load(
			url,
			async () =>
				new SceneResource(
					url,
					SceneDataSchema.assert(await (await fetch(url)).json())
				)
		);
	}

	static fromNode(node: Node): SceneResource {
		const sceneData: SceneData = { root: 0, nodeData: [] };
		function recurse(node: Node): number {
			const metadata = Node.metadataFor(node);
			const nodeData: NodeData = {
				name: node.name,
				type: metadata.type.name,
				variables: {},
				children: [],
			};
			for (const name in metadata.variables) {
				const variable = metadata.variables[name];
				const value = (node as any)[name];
				if (value !== undefined) {
					nodeData.variables[name] = variable.toStore((node as any)[name]);
				}
			}
			const index = sceneData.nodeData.length;
			sceneData.nodeData.push(nodeData);
			nodeData.children = node.children.map(recurse);
			return index;
		}
		sceneData.root = recurse(node);
		return new SceneResource(undefined as any, sceneData);
	}

	constructor(readonly url: string, readonly sceneData: SceneData) {}

	toNode(): Promise<Node> {
		const recurse = async (nodeIndex: number): Promise<Node> => {
			const nodeData = this.sceneData.nodeData[nodeIndex];
			if (nodeData === undefined) {
				throw new Error(`Scene refers to unknown Node at index: ${nodeIndex}!`);
			}
			const metadata = Node.metadataFor(nodeData.type);
			if (metadata === undefined) {
				throw new Error(
					`Scene refers to unknown Node Type "${nodeData.type}"!`
				);
			}
			const node = new metadata.type(nodeData.name);
			for (const name in nodeData.variables) {
				const variable = metadata.variables[name];
				if (variable !== undefined) {
					if (name === "x") {
						console.log(
							variable,
							await variable.fromStore(nodeData.variables[name])
						);
					}
					(node as any)[name] = await variable.fromStore(
						nodeData.variables[name]
					);
				} else {
					console.error(
						new Error(`Node "${node.name}" has unknown variable "${name}"!'`)
					);
				}
			}
			node.addAll(await Promise.all(nodeData.children.map(recurse)));
			return node;
		};
		return recurse(this.sceneData.root);
	}
}
