import { Schema, SchemaType } from "../data/schema.js";
import { Inspector } from "../inspector.js";
import { Node, NodeTypes } from "../nodes/node.js";
import { propertiesOf } from "../properties.js";
import { Resource } from "./resources.js";

const NodeDataSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	properties: Schema.any,
	children: Schema.array(Schema.number),
});

type NodeData = SchemaType<typeof NodeDataSchema>;

export const SceneSchema = Schema.object({
	root: Schema.number,
	nodes: Schema.array(NodeDataSchema),
});

export type Scene = SchemaType<typeof SceneSchema>;

export namespace Scene {
	export function fromNode(node: Node): Scene {
		const scene: Scene = { root: 0, nodes: [] };
		function recurse(node: Node): number {
			const nodeData: NodeData = {
				name: node.name,
				type: node.constructor.name,
				properties: {},
				children: [],
			};
			const properties = propertiesOf(node);
			for (const key in properties) {
				const property = properties[key];
				nodeData.properties[key] = property.toJsonData((node as any)[key]);
			}
			const index = scene.nodes.length;
			scene.nodes.push(nodeData);
			nodeData.children = node.children.map((childNode) => recurse(childNode));
			return index;
		}
		recurse(node);
		return scene;
	}

	export function toNode(scene: Scene): Node {
		function recurse(nodeIndex: number): Node {
			const nodeData = scene.nodes[nodeIndex];
			if (nodeData === undefined) {
				throw new Error(`Scene refers to unknown Node at index: ${nodeIndex}!`);
			}
			if (!(nodeData.type in NodeTypes)) {
				throw new Error(
					`Scene refers to unknown Node Type "${nodeData.type}"!`
				);
			}
			const node = new NodeTypes[nodeData.type](nodeData.name);
			const properties = propertiesOf(node);
			for (const key in properties) {
				const property = properties[key];
				try {
					(node as any)[key] = property.fromJsonData(nodeData.properties[key]);
				} catch (error) {
					console.error(
						`Error while loading property "${key}" for Node "${node.name}"`,
						error
					);
				}
			}
			nodeData.children.forEach((childIndex) => node.add(recurse(childIndex)));
			return node;
		}
		return recurse(scene.root);
	}
}

export class SceneResource implements Resource {
	url!: string;
	scene!: Scene;

	toNode(): Node {
		return Scene.toNode(this.scene);
	}

	async load(url: string): Promise<void> {
		this.url = url;
		const sceneJson = await (await fetch(url)).json();
		this.scene = SceneSchema.assert(sceneJson);
	}
}
