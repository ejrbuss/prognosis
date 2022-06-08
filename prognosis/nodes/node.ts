import { Point } from "../data/point.js";
import { Inspector, propertiesOf } from "../inspector.js";

export class Node {
	#name: string;
	#started: boolean = false;
	#parent?: Node;
	#children: Node[] = [];
	localX: number = 0;
	localY: number = 0;
	z: number = 0;
	priority: number = 0;

	constructor(name: string) {
		this.#name = name ?? this.constructor.name;
	}

	get name(): string {
		return this.#name;
	}

	set name(name: string) {
		if (
			this.#parent?.children.some(
				(childNode) => childNode !== this && childNode.name === name
			)
		) {
			throw new Error("TODO fix name");
		}
		this.#name = name;
	}

	get path(): string {
		return `${this.#parent?.path ?? ""}${this.name}/`;
	}

	get started(): boolean {
		return this.#started;
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
		const child = this.children.find((child) => child.name === name);
		if (path.length === name.length + 1) {
			return child;
		}
		return child?.find(path.substring(seperator + 1));
	}

	add(node: Node) {
		if (this.children.some((child) => child.name === node.name)) {
			throw Error(
				`Cannot add Node "${node.name}" to ${this.name}, child with the same name already exists!`
			);
		}
		if (node.#parent === this) {
			return;
		}
		if (node.#parent !== undefined) {
			node.#parent.remove(node);
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

	has(nodeType: typeof Node): boolean {
		return this.#children.some((node) => node instanceof nodeType);
	}

	get<NodeType extends typeof Node>(
		nodeType: NodeType
	): InstanceType<NodeType> | undefined {
		return this.#children.find(
			(node) => node instanceof nodeType
		) as InstanceType<NodeType>;
	}

	clone(): this {
		const clone: this = new (this.constructor as any)(this.name);
		// TODO do copy via inspector
		// Copy base Node prioerties
		clone.localX = this.localX;
		clone.localY = this.localY;
		clone.priority = this.priority;
		clone.z = this.z;
		this.#children.forEach((child) => {
			clone.add(child.clone());
		});
		return clone;
	}

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
		this.debugRender(context);
		postRender.forEach((child) => child._debugRender(context));
		context.translate(-this.localX, -this.localY);
	}

	debugRender(context: CanvasRenderingContext2D) {
		if (this.render !== undefined) {
			this.render(context);
		}
	}

	// Runtime hooks

	start?(): void;
	childrenChanged?(): void;
	update?(): void;
	physicsUpdate?(): void;
	render?(context: CanvasRenderingContext2D): void;

	// Editor hooks

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

	inspect?(inspector: Inspector): void;

	get icon(): string {
		return "cube-outline";
	}
}

export const NodeTypes: Record<string, typeof Node> = {};
export const NodeTypeSourceLocation: Record<string, string> = {};
