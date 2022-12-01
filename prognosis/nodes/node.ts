import { Color } from "../data/color.js";
import { Point } from "../data/point.js";
import { Schema } from "../data/schema.js";
import { JsonData } from "../data/store.js";

export enum Tool {
	Translate = "Translation",
	Scale = "Scale",
	Rotate = "Rotate",
}

export type DebugOptions = {
	selectedNode?: Node;
	selectedTool: Tool;
	lockToGrid: boolean;
	gridSize: number;
};

export interface Variable<Type> {
	copy(value: Type): Type;
	toStore(value: Type): JsonData;
	fromStore(data: JsonData): Type | Promise<Type>;
}

export class BooleanVariable {
	static copy(value: boolean): boolean {
		return value;
	}

	static toStore(value: boolean): JsonData {
		return value;
	}

	static fromStore(data: JsonData): boolean {
		return Schema.boolean.assert(data);
	}
}

export class NumberVariable {
	static copy(value: number): number {
		return value;
	}

	static toStore(value: number): JsonData {
		return value;
	}

	static fromStore(data: JsonData): number {
		return Schema.number.assert(data);
	}
}

export class StringVariable {
	static copy(value: string): string {
		return value;
	}

	static toStore(value: string): JsonData {
		return value;
	}

	static fromStore(data: JsonData): string {
		return Schema.string.assert(data);
	}
}

export class EnumVariable<Enum> implements Variable<Enum> {
	constructor(readonly keys: string[], readonly values: Enum[]) {}

	keyOf(value: Enum): string {
		return this.keys[this.values.indexOf(value)];
	}

	valueOf(key: string): Enum {
		return this.values[this.keys.indexOf(key)];
	}

	copy(value: Enum): Enum {
		return value;
	}

	toStore(value: Enum): JsonData {
		return this.keyOf(value);
	}

	fromStore(data: JsonData): Enum {
		return this.valueOf(Schema.string.assert(data));
	}
}

export function Enum<Enum>(enumValues: Record<string, Enum>): Variable<Enum> {
	return new EnumVariable(Object.keys(enumValues), Object.values(enumValues));
}

export function variable<Type>(
	variable:
		| BooleanConstructor
		| NumberConstructor
		| StringConstructor
		| Variable<Type>
) {
	return function variableDecorator(target: Node, key: string) {
		if (variable === Boolean) {
			Node.metadataFor(target).variables[key] = BooleanVariable;
			return;
		}
		if (variable === Number) {
			Node.metadataFor(target).variables[key] = NumberVariable;
			return;
		}
		if (variable === String) {
			Node.metadataFor(target).variables[key] = StringVariable;
			return;
		}
		Node.metadataFor(target).variables[key] = variable as Variable<any>;
	};
}

export function icon(icon: string) {
	return function iconDecorator(target: typeof Node) {
		Node.metadataFor(target).icon = icon;
	};
}

type NodeMetadata = {
	type: { new (name?: string): Node };
	icon: string;
	modulePath: string;
	variables: Record<string, Variable<any>>;
};

export class Node {
	static Metadata: Partial<Record<string, NodeMetadata>> = {};

	static metadataFor(node: typeof Node | Node | string): NodeMetadata {
		let nodeName: string;
		if (typeof node === "function") {
			nodeName = node.name;
		} else if (typeof node === "string") {
			nodeName = node;
		} else {
			nodeName = node.constructor.name;
		}
		let nodeMetadata = Node.Metadata[nodeName];
		if (nodeMetadata === undefined) {
			nodeMetadata = {
				icon: "cube-outline",
				variables: {
					x: NumberVariable,
					y: NumberVariable,
					z: NumberVariable,
					priority: NumberVariable,
				},
			} as any;
			Node.Metadata[nodeName] = nodeMetadata;
		}
		return nodeMetadata as NodeMetadata;
	}

	protected _name: string;
	protected _parent?: Node;
	protected _children: Node[] = [];

	x: number = 0;
	y: number = 0;
	z: number = 0;
	priority: number = 0;

	constructor(name?: string) {
		this._name = name ?? this.constructor.name;
	}

	get name(): string {
		return this._name;
	}

	set name(name: string) {
		const parent = this._parent;
		if (parent !== undefined) {
			while (
				parent._children.some((child) => child !== this && child.name === name)
			) {
				name = incrementName(name);
			}
		}
		this._name = name;
	}

	get path(): string {
		return `${this._parent?.path ?? ""}${this.name}/`;
	}

	get parent(): Node | undefined {
		return this._parent;
	}

	get children(): Node[] {
		return this._children.slice();
	}

	get position(): Point {
		return new Point(this.x, this.y);
	}

	set position(position: Point) {
		this.x = position.x;
		this.y = position.y;
	}

	get screenPosition(): Point {
		throw new Error("TODO implement me");
	}

	get worldPosition(): Point {
		throw new Error("TODO implement me");
	}

	findByPath(path: string): Node | undefined {
		const seperator = path.indexOf("/");
		if (seperator === -1) {
			throw new Error(`Invalid  Node path "${path}"!`);
		}
		const name = path.substring(0, seperator);
		const child = this._children.find((child) => child.name === name);
		if (path.length === name.length + 1) {
			return child;
		}
		return child?.findByPath(path.substring(seperator + 1));
	}

	add(node: Node) {
		if (node._parent === this) {
			return;
		}
		if (node._parent !== undefined) {
			node._parent.remove(node);
		}
		while (this._children.some((child) => child.name === node.name)) {
			node.name = incrementName(node.name);
		}
		node._parent = this;
		this._children.push(node);
		if (this.childrenChanged !== undefined) {
			this.childrenChanged();
		}
	}

	addAll(nodes: Node[]) {
		nodes.forEach((node) => this.add(node));
	}

	remove(node: Node): boolean {
		const index = this._children.indexOf(node);
		if (index !== -1) {
			(this._children as Node[]).splice(index, 1);
			node._parent = undefined;
			if (this.childrenChanged !== undefined) {
				this.childrenChanged();
			}
			return true;
		}
		return false;
	}

	removeAll(nodes?: Node[]) {
		(nodes ?? this.children).forEach((child) => this.remove(child));
	}

	has(nodeType: typeof Node): boolean {
		return this._children.some((child) => child instanceof nodeType);
	}

	get<NodeType extends typeof Node>(
		nodeType: NodeType
	): InstanceType<NodeType> | undefined {
		return this._children.find(
			(child) => child instanceof nodeType
		) as InstanceType<NodeType>;
	}

	copy(): this {
		const metadata = Node.metadataFor(this);
		const copy = new metadata.type(this.name) as this;
		for (const name in metadata.variables) {
			const variable = metadata.variables[name];
			(copy as any)[name] = variable.copy((this as any)[name]);
		}
		return copy;
	}

	// Lifecycle methods

	_update() {
		if (this.update !== undefined) {
			this.update();
		}
		this.children
			.sort((a, b) => b.priority - a.priority)
			.forEach((child) => child._update());
	}

	_render(context: CanvasRenderingContext2D) {
		const preRender: Node[] = [];
		const postRender: Node[] = [];
		this._children.forEach((child) => {
			if (child.z < 0) {
				preRender.push(child);
			} else {
				postRender.push(child);
			}
		});
		preRender.sort((a, b) => a.z - b.z);
		postRender.sort((a, b) => a.z - b.z);
		context.translate(this.x, this.y);
		preRender.forEach((child) => child._render(context));
		if (this.render !== undefined) {
			this.render(context);
		}
		postRender.forEach((child) => child._render(context));
	}

	// Runtime hooks

	childrenChanged?(): void;
	update?(): void;
	render?(context: CanvasRenderingContext2D): void;

	// Debug lifecycle methods

	_debugUpdate(debugProps: DebugOptions) {
		if (this.debugUpdate !== undefined) {
			this.debugUpdate(debugProps);
		}
		this.children
			.sort((a, b) => b.priority - a.priority)
			.forEach((child) => child._debugUpdate(debugProps));
	}

	_debugRender(context: CanvasRenderingContext2D, debugProps: DebugOptions) {
		const preRender: Node[] = [];
		const postRender: Node[] = [];
		this._children.forEach((child) => {
			if (child.z < 0) {
				preRender.push(child);
			} else {
				postRender.push(child);
			}
		});
		preRender.sort((a, b) => a.z - b.z);
		postRender.sort((a, b) => a.z - b.z);
		context.translate(this.x, this.y);
		preRender.forEach((child) => child._debugRender(context, debugProps));
		if (this.debugRender !== undefined) {
			this.debugRender(context, debugProps);
		} else if (this.render !== undefined) {
			this.render(context);
		}
		postRender.forEach((child) => child._debugRender(context, debugProps));
		context.translate(-this.x, -this.y);
	}

	// Debug hooks

	debugUpdate?(debugProps: DebugOptions): void;
	debugRender?(
		context: CanvasRenderingContext2D,
		debugProps: DebugOptions
	): void;
}

// TODO better home?

const CountPattern = /(.* )\((\d+)\)$/;

function incrementName(name: string): string {
	const match = name.match(CountPattern);
	if (match === null) {
		return `${name} (1)`;
	}
	const count = parseInt(match[2]);
	return `${match[1]} (${count + 1})`;
}
