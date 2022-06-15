import { Store } from "../data/store.js";
import { Node } from "../nodes/node.js";
import { Project } from "../project.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { Signal } from "../signal.js";
import { EditorApi } from "./editorApi.js";
import { DebugRoot } from "../nodes/debugRoot.js";
import { Root } from "../nodes/root.js";

const MaxHistorySize = 1000;

type UndoableAction = {
	action: () => void;
	undoAction: () => void;
};

export enum Tool {
	Translate = "Translation",
	Scale = "Scale",
	Rotate = "Rotate",
}

export enum RuntimeState {
	Empty = "Empty",
	Editable = "Editable",
	Running = "Running",
	Paused = "Paused",
}

export const LayoutConstants = {
	GutterSize: 1,
	ToolbarHeight: 48,
	ToolBarMinWidth: 400,
	InspectorMinWidth: 225,
	ExplorerMinWidth: 300,
	PreviewMinHeight: 200,
	TimelineMinHeight: 200,
};

export type LayoutConstraints = {
	desiredInspectorWidth: number;
	desiredExplorerWidth: number;
	desiredTimelineHeight: number;
};

type EditorStore = Store<{
	layoutConstraints: LayoutConstraints;
	sceneUrl?: string;
	selectedNodePath?: string;
	expandedNodePaths: [string, boolean][];
	gridSize: number;
}>;

const EditorStateClass = class EditorState {
	#store: EditorStore;
	#history: UndoableAction[] = [];
	#historyLocation: number = 0;
	#root: Root;
	#debugRoot: DebugRoot = new DebugRoot("Root");
	#layoutConstraints: LayoutConstraints = {
		desiredInspectorWidth: 300,
		desiredExplorerWidth: 300,
		desiredTimelineHeight: 300,
	};
	#sceneUrl?: string;
	#scene?: SceneResource;
	#selectedNode?: Node;
	#expandedNodes: Map<Node, boolean> = new Map();
	#selectedTool: Tool = Tool.Translate;
	#lockGrid: boolean = false;
	#runtimeState: RuntimeState = RuntimeState.Empty;

	updates: Signal = new Signal();

	constructor() {
		this.#root = Runtime.root;
		this.#debugRoot.cameraSpeed = Project.graphics.width / 3;
		this.#debugRoot.gridSize = 100;
		this.#store = new Store("prognosis.editor.store", {
			layoutConstraints: this.#layoutConstraints,
			expandedNodePaths: [],
			gridSize: this.#debugRoot.gridSize,
		});
		this.updates.connect(() => {
			this.#store.value = {
				layoutConstraints: this.#layoutConstraints,
				sceneUrl: this.#sceneUrl,
				selectedNodePath: this.#selectedNode?.path,
				expandedNodePaths: Array.from(this.#expandedNodes).map(
					([node, expanded]) => [node.path, expanded]
				),
				gridSize: this.#debugRoot.gridSize,
			};
			this.#store.save();
		});
		Runtime.root = this.#debugRoot;
		this.load().then(() => setTimeout(() => Runtime.start()));
	}

	get editorRoot(): Node {
		return this.#debugRoot;
	}

	get layoutConstraints(): LayoutConstraints {
		return { ...this.#layoutConstraints };
	}

	get selectedNode(): Node | undefined {
		return this.#selectedNode;
	}

	nodeExpanded(node: Node): boolean {
		return this.#expandedNodes.get(node) ?? false;
	}

	get selectedTool(): Tool {
		return this.#selectedTool;
	}

	get lockGrid(): boolean {
		return this.#lockGrid;
	}

	get showGrid(): boolean {
		return this.#debugRoot.showGrid;
	}

	get gridSize(): number {
		return this.#debugRoot.gridSize;
	}

	get runtimeState(): RuntimeState {
		return this.#runtimeState;
	}

	async load() {
		const store = this.#store.value;
		this.#layoutConstraints = store.layoutConstraints;
		this.#sceneUrl = store.sceneUrl;
		this.#debugRoot.gridSize = store.gridSize;
		if (store.sceneUrl !== undefined) {
			this.#scene = await SceneResource.load(store.sceneUrl);
			this.reset();
		}
	}

	saveSceneChanges() {
		if (
			this.#runtimeState === RuntimeState.Editable &&
			this.#sceneUrl !== undefined
		) {
			this.#scene = SceneResource.fromNodes(this.#debugRoot.children);
			EditorApi.save(this.#sceneUrl, SceneResource.toStore(this.#scene));
		}
	}

	undoable(action: UndoableAction) {
		this.#history.length = this.#historyLocation;
		this.#history.push(action);
		if (this.#history.length > MaxHistorySize) {
			this.#history.shift();
		}
		this.#historyLocation = this.#history.length;
		action.action();
		this.updates.send();
	}

	undo() {
		if (this.#historyLocation === 0) {
			return; // TODO indicate to user cannot undo
		}
		const action = this.#history[--this.#historyLocation];
		action.undoAction();
		this.updates.send();
	}

	redo() {
		if (this.#historyLocation === this.#history.length) {
			return; // TODO indicate to user cannot redo
		}
		const action = this.#history[this.#historyLocation++];
		action.action();
		this.updates.send();
	}

	resizeInspector(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#layoutConstraints.desiredInspectorWidth = Math.max(
			LayoutConstants.InspectorMinWidth,
			this.#layoutConstraints.desiredInspectorWidth - delta
		);
		this.updates.send();
	}

	resizeExplorer(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#layoutConstraints.desiredExplorerWidth = Math.max(
			LayoutConstants.ExplorerMinWidth,
			this.#layoutConstraints.desiredExplorerWidth - delta
		);
		this.updates.send();
	}

	resizeTimeline(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#layoutConstraints.desiredTimelineHeight = Math.max(
			LayoutConstants.TimelineMinHeight,
			this.#layoutConstraints.desiredTimelineHeight - delta
		);
		this.updates.send();
	}

	async loadScene(sceneUrl: string) {
		const scene = await SceneResource.load(sceneUrl);
		this.#history = [];
		this.#sceneUrl = sceneUrl;
		this.#selectedNode = undefined;
		this.#expandedNodes.clear();
		this.#scene = scene;
		this.reset();
	}

	selectNode(node?: Node) {
		if (this.#selectedNode === node) {
			return;
		}
		this.#selectedNode = node;
		this.updates.send();
	}

	toggleNodeExpanded(node: Node) {
		this.#expandedNodes.set(node, !this.nodeExpanded(node));
		this.updates.send();
	}

	selectTool(tool: Tool) {
		this.#selectedTool = tool;
		this.updates.send();
	}

	toggleLockGrid() {
		this.#lockGrid = !this.lockGrid;
		this.updates.send();
	}

	toggleShowGrid() {
		this.#debugRoot.showGrid = !this.showGrid;
		this.updates.send();
	}

	resizeGrid(gridSize: number) {
		if (this.#debugRoot.gridSize === gridSize) {
			return;
		}
		this.#debugRoot.gridSize = gridSize;
		this.updates.send();
	}

	play() {
		this.#scene = SceneResource.fromNodes(this.#debugRoot.children);
		this.#runtimeState = RuntimeState.Running;
		this.#root.addAll(Runtime.root.children);
		Runtime.root = this.#root;
		this.updates.send();
	}

	stop() {
		this.#runtimeState = RuntimeState.Paused;
		this.#debugRoot.addAll(Runtime.root.children);
		Runtime.root = this.#debugRoot;
		this.updates.send();
	}

	reset() {
		Runtime.root = this.#debugRoot;
		this.#debugRoot.removeAll();
		this.#selectedNode = undefined;
		this.#expandedNodes.clear();
		this.#runtimeState = RuntimeState.Empty;
		if (this.#scene !== undefined) {
			this.#debugRoot.addAll(this.#scene.toNodes());
			this.#runtimeState = RuntimeState.Editable;
			const store = this.#store.value;
			if (store.selectedNodePath !== undefined) {
				this.#selectedNode = Runtime.findByPath(store.selectedNodePath);
			}
			for (const [path, expanded] of store.expandedNodePaths) {
				const node = Runtime.findByPath(path);
				if (node !== undefined) {
					this.#expandedNodes.set(node, expanded);
				}
			}
		}
		this.updates.send();
	}
};

export const EditorState = new EditorStateClass();
