import { ObjectPool } from "../data/object-pool.js";

/**
 * Immediate Mode DOM (Imd)
 */

declare global {
	// TypeScript uses this global namespace for typechecking JSX
	namespace JSX {
		// These are constant properties of nodes that should be removed from props
		type NodeConstants =
			| "ATTRIBUTE_NODE"
			| "CDATA_SECTION_NODE"
			| "COMMENT_NODE"
			| "DOCUMENT_FRAGMENT_NODE"
			| "DOCUMENT_NODE"
			| "DOCUMENT_POSITION_CONTAINED_BY"
			| "DOCUMENT_POSITION_CONTAINS"
			| "DOCUMENT_POSITION_DISCONNECTED"
			| "DOCUMENT_POSITION_FOLLOWING"
			| "DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC"
			| "DOCUMENT_POSITION_PRECEDING"
			| "DOCUMENT_TYPE_NODE"
			| "ELEMENT_NODE"
			| "ENTITY_NODE"
			| "ENTITY_REFERENCE_NODE"
			| "NOTATION_NODE"
			| "PROCESSING_INSTRUCTION_NODE"
			| "TEXT_NODE";

		// Returns the non method properties of type T
		type PartialNonMethods<T> = {
			[K in keyof T as T[K] extends Function ? never : K]: Partial<T[K]>;
		};

		// Transforms an Element interface to its JSX props
		type JsxProps<E> = Partial<PartialNonMethods<Omit<E, NodeConstants>>>;

		// Interfaces cannot directly use mapped types, so we have to provide
		// indirection to apply our JSX definition to all HTMLElement tags
		type MappedIntrinsicElements = {
			[K in keyof HTMLElementTagNameMap]: JsxProps<HTMLElementTagNameMap[K]>;
		};

		// These are the interfaces actually used by TypeScript
		interface IntrinsicElements extends MappedIntrinsicElements {}
		interface ElementAttributesProperty {
			props: any;
		}
	}
}

export type Children = { children: VirtualNode[] };
export type ComponentClass<P> = { new (): Component<P> };
export type ComponentFunction<P> = (props: P & Children) => VirtualElement;
export type ComponentType<P> = ComponentClass<P> | ComponentFunction<P>;
export type VirtualNode = VirtualElement | string;

export abstract class Component<P = {}> {
	private props!: P; // Just used by typescript to determine the type of props
	componentWillMount(): void {}
	componentDidMount(): void {}
	componentWillUnmount(): void {}
	abstract render(props: P & Children): VirtualElement;
}

export class VirtualElement<P = any> {
	type!: ComponentType<P> | string;
	props!: P & Children;
}

const VirtualElementPool = new ObjectPool(() => new VirtualElement());
const TagComparer = new Intl.Collator(undefined, { sensitivity: "base" });
const $Props = Symbol("Imd.props");
const $Instance = Symbol("Imd.instance");

export function jsx(
	type: ComponentType<any> | string,
	props: any,
	...children: VirtualNode[]
): VirtualElement {
	if (props === null || props === undefined) {
		props = { children };
	} else if (props.children === undefined) {
		props.children = children;
	} else {
		props.children.push(...children);
	}
	const element = VirtualElementPool.getInstance();
	element.type = type;
	element.props = props;
	return element;
}

export function render(rootElement: VirtualElement, container: Node) {
	VirtualElementPool.baseline();
	let newRootNode = reconcile(rootElement, undefined);
	container.appendChild(newRootNode);
	function renderLoop() {
		VirtualElementPool.reset();
		const oldRootNode = newRootNode;
		newRootNode = reconcile(rootElement, oldRootNode);
		if (newRootNode !== newRootNode) {
			container.replaceChild(newRootNode, oldRootNode);
		}
		requestIdleCallback(renderLoop);
	}
	renderLoop();
}

function reconcile(virtualNode: VirtualNode, domNode?: Node): Node {
	if (typeof virtualNode !== "object") {
		return reconcileTextNode(`${virtualNode}`, domNode);
	}
	switch (typeof virtualNode.type) {
		case "string":
			return reconcileElement(virtualNode.type, virtualNode.props, domNode);
		case "function":
			return reconcileComponent(virtualNode.type, virtualNode.props, domNode);
	}
}

function reconcileTextNode(text: string, domNode?: Node): Node {
	if (domNode instanceof Text) {
		if (domNode.nodeValue !== text) {
			domNode.nodeValue = text;
		}
		return domNode;
	}
	return document.createTextNode(text) as any;
}

function reconcileElement(tagName: string, props: any, domNode?: Node): Node {
	if (TagComparer.compare(tagName, (domNode as any)?.tagName) === 0) {
		return updateDomElement(props, domNode as Element);
	} else {
		return createDomElement(tagName, props);
	}
}

function createDomElement(tagName: string, props: any): Element {
	const domElement = document.createElement(tagName);
	(domElement as any)[$Props] = props;
	for (const prop in props) {
		if (prop === "children") {
			continue;
		}
		if (prop === "style") {
			const style = props[prop];
			for (const cssProp in style) {
				domElement.style[cssProp as any] = style[cssProp];
			}
			continue;
		}
		(domElement as any)[prop] = props[prop];
	}
	(props.children as VirtualNode[]).forEach((child) => {
		domElement.appendChild(reconcile(child, undefined));
	});
	return domElement;
}

function updateDomElement(props: any, domElement: Element): Element {
	const oldProps = (domElement as any)[$Props];
	for (const prop in oldProps) {
		if (prop in props) {
			continue;
		}
		if (prop === "children") {
			continue;
		}
		if (prop === "style") {
			const oldStyle = oldProps[prop];
			const domStyle = (domElement as any).style;
			for (const cssProp in oldStyle) {
				domStyle[cssProp] = "";
			}
			continue;
		}
		(domElement as any)[prop] = undefined;
	}
	for (const prop in props) {
		if (prop === "children") {
			continue;
		}
		if (prop === "style") {
			const oldStyle = oldProps[prop];
			const newStyle = props[prop];
			const domStyle = (domElement as any).style;
			for (const cssProp in oldStyle) {
				if (!(cssProp in newStyle)) {
					domStyle[cssProp] = "";
				}
			}
			for (const cssProp in newStyle) {
				const oldStyleValue = oldStyle[cssProp];
				const newStyleValue = newStyle[cssProp];
				const domStyle = (domElement as any).style;
				if (oldStyleValue !== newStyleValue) {
					domStyle[cssProp] = newStyleValue;
				}
			}
			continue;
		}
		const oldValue = oldProps[prop];
		const newValue = props[prop];
		if (oldValue !== newValue) {
			(domElement as any)[prop] = newValue;
		}
	}
	const childCount = props.children.length;
	const childNodes = domElement.childNodes;
	let childNodeCount = childNodes.length;
	(props.children as VirtualNode[]).forEach((child, i) => {
		if (i < childNodeCount) {
			const oldChildNode = childNodes[i];
			const newChildNode = reconcile(child, oldChildNode);
			if (oldChildNode !== newChildNode) {
				domElement.replaceChild(newChildNode, oldChildNode);
			}
		} else {
			domElement.appendChild(reconcile(child, undefined));
		}
	});
	while (childNodeCount !== childCount) {
		domElement.removeChild(domElement.lastChild as Node);
	}
	return domElement;
}

function reconcileComponent(
	componentType: ComponentType<any>,
	props: any,
	domNode?: Node
): Node {
	if (componentType.prototype instanceof Component) {
		const instance =
			domNode === undefined ? undefined : (domNode as any)[$Instance];
		if (instance?.constructor !== componentType) {
			if (instance !== undefined) {
				unmountDomNode(domNode as Node);
			}
			const newInstance = new (componentType as ComponentClass<any>)();
			newInstance.componentWillMount();
			const newDomNode = reconcile(newInstance.render(props), domNode);
			newInstance.componentDidMount();
			(newDomNode as any)[$Instance] = newInstance;
			return newDomNode;
		}
		const newDomNode = reconcile(instance.render(props), domNode);
		(newDomNode as any)[$Instance] = instance;
		return newDomNode;
	}
	return reconcile((componentType as ComponentFunction<any>)(props), domNode);
}

function unmountDomNode(node: Node) {
	const instance = (node as any)[$Instance];
	if (instance !== undefined) {
		instance.componentWillUnmount();
	}
	node.childNodes.forEach(unmountDomNode);
}
