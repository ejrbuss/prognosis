import { Node } from "../nodes/node.js";
import { Schema, SchemaType } from "../data/schema.js";
import { Resources } from "./resources.js";
import { JsonData } from "../data/store.js";

const NodeDataSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	variables: Schema.record(Schema.any),
	children: Schema.array(Schema.number),
});

type NodeData = SchemaType<typeof NodeDataSchema>;

export const SceneDataSchema = Schema.object({
	rootNodes: Schema.array(Schema.number),
	nodeData: Schema.array(NodeDataSchema),
});

export type SceneData = SchemaType<typeof SceneDataSchema>;

export class SceneResource {
	static toStore(scene: SceneResource): JsonData {
		return scene.sceneData;
	}

	static fromStore(data: JsonData): SceneResource {
		return new SceneResource(SceneDataSchema.assert(data));
	}

	static load(url: string): Promise<SceneResource> {
		return Resources.load(url, async () =>
			SceneResource.fromStore(await (await fetch(url)).json())
		);
	}

	static fromNodes(nodes: Node[]): SceneResource {
		const sceneData: SceneData = { rootNodes: [], nodeData: [] };
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
		sceneData.rootNodes = nodes.map(recurse);
		return new SceneResource(sceneData);
	}

	constructor(readonly sceneData: SceneData) {}

	toNodes(): Node[] {
		const recurse = (nodeIndex: number): Node => {
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
				(node as any)[name] = variable.fromStore(nodeData.variables[name]);
			}
			nodeData.children.forEach((childIndex) => node.add(recurse(childIndex)));
			return node;
		};
		return this.sceneData.rootNodes.map(recurse);
	}
}
