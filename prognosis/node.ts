import { Point } from "./point.js";

export class Node {
	#started: boolean = false;
	#parent?: Node;
	#children: Node[] = [];
	readonly name: string;
	localX: number = 0;
	localY: number = 0;
	priority: number = 0;
	z: number = 0;

	constructor(name?: string) {
		this.name = name ?? this.constructor.name;
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

	add(node: Node) {
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

	start?(): void;
	childrenChanged?(): void;
	update?(): void;
	physicsUpdate?(): void;
	render?(context: CanvasRenderingContext2D): void;
}

export const NodeTypes: Record<string, typeof Node> = { Node };
