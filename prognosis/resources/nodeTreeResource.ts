import { Schema, SchemaType } from "../data/schema.js";
import { Node, NodeTypes } from "../nodes/node.js";
import { Resource } from "./resources.js";

const NodeSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	props: Schema.record(Schema.any),
	children: Schema.array(Schema.string),
});

const NodeTreeSchema = Schema.object({
	root: Schema.string,
	nodes: Schema.array(NodeSchema),
});

export type NodeTree = SchemaType<typeof NodeTreeSchema>;

export class NodeTreeResource implements Resource {
	name!: string;
	nodeTree!: NodeTree;

	get node(): Node {
		if (this.nodeTree === undefined) {
			throw new Error(`NodeTreeResource has not been loaded!`);
		}
		return this.#buildNode(this.nodeTree.root);
	}

	#buildNode(name: string): Node {
		const spec = this.nodeTree?.nodes.find((node) => node.name === name);
		if (spec === undefined) {
			throw new Error(
				`NodeTree "${this.name}" refers to unknown Node "${name}"!`
			);
		}
		const node = new NodeTypes[spec.type](spec.name);
		const children = spec.children.map((ChildName) =>
			this.#buildNode(ChildName)
		);
		children.forEach((child) => node.add(child));
		return node;
	}

	async load(url: string): Promise<void> {
		const nodeTreeJson = await (await fetch(url)).json();
		this.name =
			url
				.split("/")
				.pop()
				?.replace(/\.json$/, "") ?? "";
		this.nodeTree = NodeTreeSchema.assert(nodeTreeJson);
	}
}
