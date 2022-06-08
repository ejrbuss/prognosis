import { Schema, SchemaType } from "../data/schema.js";
import { Node, NodeTypes } from "../nodes/node.js";
import { Resource } from "./resources.js";

const NodeSchema = Schema.object({
	name: Schema.string,
	type: Schema.string,
	props: Schema.record(Schema.any),
	children: Schema.array(Schema.number),
});

const SceneSchema = Schema.object({
	root: Schema.number,
	nodes: Schema.array(NodeSchema),
});

export type Scene = SchemaType<typeof SceneSchema>;

export class SceneResource implements Resource {
	url!: string;
	scene!: Scene;

	buildRoot(): Node {
		if (this.scene === undefined) {
			throw new Error(`SceneResource has not been loaded!`);
		}
		return this.#buildNode(this.scene.root);
	}

	#buildNode(nodeIndex: number): Node {
		const spec = this.scene.nodes[nodeIndex];
		if (spec === undefined) {
			throw new Error(`Scene refers to unknown Node at index: ${nodeIndex}!`);
		}
		if (!(spec.type in NodeTypes)) {
			throw new Error(
				`Scene "${this.url}" refers to unknown Node Type "${spec.type}"!`
			);
		}
		const node = new NodeTypes[spec.type](spec.name);
		const children = spec.children.map((childIndex) =>
			this.#buildNode(childIndex)
		);
		children.forEach((child) => node.add(child));
		return node;
	}

	async load(url: string): Promise<void> {
		this.url = url;
		const sceneJson = await (await fetch(url)).json();
		this.scene = SceneSchema.assert(sceneJson);
	}
}
