import { Point } from "../data/point.js";
import { Inspector, propertiesOf } from "../inspector.js";

const CountPattern = /(.* )\((\d+)\)$/;

function incrementName(name: string): string {
	const match = name.match(CountPattern);
	if (match === null) {
		return `${name} (1)`;
	}
	const count = parseInt(match[2]);
	return `${match[1]} (${count + 1})`;
}

export class Node {
	#name: string;
	#started: boolean = false;
	#parent?: Node;
	#children: Node[] = [];
	localX: number = 0;
	localY: number = 0;
	z: number = 0;
	priority: number = 0;

	constructor(name?: string) {
		this.#name = name ?? this.constructor.name;
	}

	get name(): string {
		return this.#name;
	}

	set name(name: string) {
		while (
			this.#parent?.children.some(
				(child) => child !== this && child.name === name
			)
		) {
			name = incrementName(name);
		}
		this.#name = name;
	}

	get path(): string {
		return `${this.#parent?.path ?? ""}${this.name}/`;
	}

	get started(): boolean {
		return this.#started;
	}

	get parent(): Node | undefined {
		return this.#parent;
	}

	get children(): Readonly<Node[]> {
		return this.#children;
	}

	get localPosition(): Point {
		return new Point(this.localX, this.localY);
	}

	set localPosition(localPosition: Point) {
		this.localX = localPosition.x;
		this.localY = localPosition.y;
	}

	get x(): number {
		return this.localX + (this.#parent?.x ?? 0);
	}

	set x(x: number) {
		this.localX = x - (this.#parent?.x ?? 0);
	}

	get y(): number {
		return this.localY + (this.#parent?.y ?? 0);
	}

	set y(y: number) {
		this.localY = y - (this.#parent?.y ?? 0);
	}

	get position(): Point {
		return new Point(this.x, this.y);
	}

	set position(position: Point) {
		this.x = position.x;
		this.y = position.y;
	}

	find(path: string): Node | undefined {
		const seperator = path.indexOf("/");
		if (seperator === -1) {
			throw new Error(`Invalid  Node path "${path}"!`);
		}
		const name = path.substring(0, seperator);
		const child = this.#children.find((child) => child.name === name);
		if (path.length === name.length + 1) {
			return child;
		}
		return child?.find(path.substring(seperator + 1));
	}

	add(node: Node) {
		if (node.#parent === this) {
			return;
		}
		if (node.#parent !== undefined) {
			node.#parent.remove(node);
		}
		while (this.#children.some((child) => child.name === node.name)) {
			node.name = incrementName(node.name);
		}
		node.#parent = this;
		this.#children.push(node);
		if (this.#started && !node.#started) {
			node._start();
		}
		if (this.childrenChanged !== undefined) {
			this.childrenChanged();
		}
	}

	remove(node: Node): boolean {
		const index = this.#children.indexOf(node);
		if (index !== -1) {
			(this.#children as Node[]).splice(index, 1);
			node.#parent = undefined;
			if (this.childrenChanged !== undefined) {
				this.childrenChanged();
			}
			return true;
		}
		return false;
	}

	removeAll() {
		this.#children.forEach((child) => this.remove(child));
	}

	has(nodeType: typeof Node): boolean {
		return this.#children.some((child) => child instanceof nodeType);
	}

	get<NodeType extends typeof Node>(
		nodeType: NodeType
	): InstanceType<NodeType> | undefined {
		return this.#children.find(
			(child) => child instanceof nodeType
		) as InstanceType<NodeType>;
	}

	clone(): this {
		const clone: this = new (this.constructor as any)(this.name);
		const thisInspector = new Inspector();
		this._inspect(thisInspector);
		const cloneInspector = new Inspector();
		clone._inspect(cloneInspector);
		cloneInspector.fromJson(thisInspector.toJson());
		this.#children.forEach((child) => {
			clone.add(child.clone());
		});
		return clone;
	}

	// Lifecycle methods

	_start() {
		if (this.#started) {
			throw new Error("This Node was already started!");
		}
		this.#started = true;
		if (this.start !== undefined) {
			this.start();
		}
		this.#children.forEach((child) => child._start());
	}

	_update() {
		const preUpdate: Node[] = [];
		const postUpdate: Node[] = [];
		this.#children.forEach((child) => {
			if (child.priority > this.priority) {
				preUpdate.push(child);
			} else {
				postUpdate.push(child);
			}
		});
		preUpdate.sort((a, b) => b.priority - a.priority);
		postUpdate.sort((a, b) => b.priority - a.priority);
		preUpdate.forEach((child) => child._update());
		if (this.update !== undefined) {
			this.update();
		}
		postUpdate.forEach((child) => child._update());
	}

	_render(context: CanvasRenderingContext2D) {
		const preRender: Node[] = [];
		const postRender: Node[] = [];
		this.#children.forEach((child) => {
			if (child.z < 0) {
				preRender.push(child);
			} else {
				postRender.push(child);
			}
		});
		preRender.sort((a, b) => a.z - b.z);
		postRender.sort((a, b) => a.z - b.z);
		context.translate(this.localX, this.localY);
		preRender.forEach((child) => child._render(context));
		if (this.render !== undefined) {
			this.render(context);
		}
		postRender.forEach((child) => child._render(context));
		context.translate(-this.localX, -this.localY);
	}

	// Runtime hooks

	childrenChanged?(): void;
	start?(): void;
	update?(): void;
	render?(context: CanvasRenderingContext2D): void;

	// Debug lifecycle methods

	_inspect(inspector: Inspector) {
		const properties = propertiesOf(this);
		inspector.header("Node Properties");
		inspector.inspectNumber(properties.x);
		inspector.inspectNumber(properties.y);
		inspector.inspectNumber(properties.z);
		inspector.inspectNumber(properties.priority);
		if (this.inspect !== undefined) {
			inspector.header(`${this.constructor.name} Properties`);
			this.inspect(inspector);
		}
	}

	_debugUpdate() {
		const preUpdate: Node[] = [];
		const postUpdate: Node[] = [];
		this.#children.forEach((child) => {
			if (child.priority > this.priority) {
				preUpdate.push(child);
			} else {
				postUpdate.push(child);
			}
		});
		preUpdate.sort((a, b) => b.priority - a.priority);
		postUpdate.sort((a, b) => b.priority - a.priority);
		preUpdate.forEach((child) => child._update());
		if (this.debugUpdate !== undefined) {
			this.debugUpdate();
		}
		postUpdate.forEach((child) => child._update());
	}

	_debugRender(context: CanvasRenderingContext2D) {
		const preRender: Node[] = [];
		const postRender: Node[] = [];
		this.#children.forEach((child) => {
			if (child.z < 0) {
				preRender.push(child);
			} else {
				postRender.push(child);
			}
		});
		preRender.sort((a, b) => a.z - b.z);
		postRender.sort((a, b) => a.z - b.z);
		context.translate(this.localX, this.localY);
		preRender.forEach((child) => child._debugRender(context));
		if (this.debugRender !== undefined) {
			this.debugRender(context);
		} else if (this.render !== undefined) {
			this.render(context);
		}
		postRender.forEach((child) => child._debugRender(context));
		context.translate(-this.localX, -this.localY);
	}

	get icon(): string {
		return "cube-outline";
	}

	// Editor hooks

	inspect?(inspector: Inspector): void;
	debugUpdate?(): void;
	debugRender?(context: CanvasRenderingContext2D): void;
}

export const NodeTypes: Record<string, typeof Node> = {};
export const NodeTypeSourceLocation: Record<string, string> = {};
