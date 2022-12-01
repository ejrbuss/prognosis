import { Store } from "../data/store.js";
import { GameNode, Tool } from "../nodes/game-node.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { Signal } from "../signal.js";
import { EditorApi } from "./editorApi.js";
import { Root } from "../nodes/root.js";
import { Project } from "../project.js";

const MaxHistorySize = 1000;

type UndoableAction = {
	action: () => void;
	undoAction: () => void;
};

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

const EditorClass = class Editor {
	#store: EditorStore;
	#history: UndoableAction[] = [];
	#historyLocation: number = 0;
	#layoutConstraints: LayoutConstraints = {
		desiredInspectorWidth: 300,
		desiredExplorerWidth: 300,
		desiredTimelineHeight: 300,
	};
	#sceneUrl?: string;
	#scene?: SceneResource;
	#expandedNodes: Map<GameNode, boolean> = new Map();
	#editable: boolean = true;
	#lockGrid: boolean = false;

	updates: Signal = new Signal();

	constructor() {
		this.#store = new Store("prognosis.editor.store", {
			layoutConstraints: this.#layoutConstraints,
			expandedNodePaths: [],
			gridSize: 100,
		});
		this.updates.connect(() => {
			this.#store.value = {
				layoutConstraints: this.#layoutConstraints,
				sceneUrl: this.#sceneUrl,
				selectedNodePath: Runtime.debugOptions.selectedNode?.path,
				expandedNodePaths: Array.from(this.#expandedNodes).map(
					([node, expanded]) => [node.path, expanded]
				),
				gridSize: Runtime.debugOptions.gridSize,
			};
			this.#store.save();
		});
		this.load().then(() => setTimeout(() => Runtime.start()));
	}

	get layoutConstraints(): LayoutConstraints {
		return { ...this.#layoutConstraints };
	}

	get sceneLoaded(): boolean {
		return this.#scene !== undefined;
	}

	get editable(): boolean {
		return this.#editable;
	}

	get debug(): boolean {
		return Runtime.debug;
	}

	get selectedTool(): Tool {
		return Runtime.debugOptions.selectedTool;
	}

	get selectedNode(): GameNode | undefined {
		return Runtime.debugOptions.selectedNode;
	}

	get lockToGrid(): boolean {
		return Runtime.debugOptions.lockToGrid;
	}

	nodeExpanded(node: GameNode): boolean {
		return this.#expandedNodes.get(node) ?? false;
	}

	get showGrid(): boolean {
		return Runtime.root.debugShowGrid;
	}

	get gridSize(): number {
		return Runtime.debugOptions.gridSize;
	}

	async load() {
		const store = this.#store.value;
		this.#layoutConstraints = store.layoutConstraints;
		this.#sceneUrl = store.sceneUrl;
		Runtime.debugOptions.gridSize = store.gridSize;
		Runtime.root.debugCameraSpeed = Project.graphics.width / 3;
		if (store.sceneUrl !== undefined) {
			this.#scene = await SceneResource.load(store.sceneUrl);
			this.reset();
		}
	}

	saveSceneChanges() {
		if (this.editable && this.#sceneUrl !== undefined) {
			this.#scene = SceneResource.fromNode(Runtime.root);
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
		Runtime.debugOptions.selectedNode = undefined;
		this.#history = [];
		this.#expandedNodes.clear();
		this.#sceneUrl = sceneUrl;
		this.#scene = scene;
		this.reset();
	}

	selectNode(node?: GameNode) {
		Runtime.debugOptions.selectedNode = node;
		this.updates.send();
	}

	toggleNodeExpanded(node: GameNode) {
		this.#expandedNodes.set(node, !this.nodeExpanded(node));
		this.updates.send();
	}

	selectTool(tool: Tool) {
		Runtime.debugOptions.selectedTool = tool;
		this.updates.send();
	}

	toggleLockToGrid() {
		Runtime.debugOptions.lockToGrid = !Runtime.debugOptions.lockToGrid;
		this.updates.send();
	}

	toggleShowGrid() {
		Runtime.root.debugShowGrid = !Runtime.root.debugShowGrid;
		this.updates.send();
	}

	resizeGrid(gridSize: number) {
		Runtime.debugOptions.gridSize = gridSize;
		this.updates.send();
	}

	play() {
		this.#scene = SceneResource.fromNode(Runtime.root);
		this.#editable = false;
		Runtime.debug = false;
		this.updates.send();
	}

	stop() {
		Runtime.debug = true;
		this.updates.send();
	}

	async reset() {
		Runtime.root.removeAll();
		Runtime.debug = true;
		Runtime.debugOptions.selectedNode = undefined;
		this.#expandedNodes.clear();
		this.#editable = true;
		const oldRoot = Runtime.root;
		if (this.#scene !== undefined) {
			Runtime.root = (await this.#scene.toNode()) as Root;
			// Copy over old root data
			Runtime.root.debugCamera = oldRoot.debugCamera;
			Runtime.root.debugCameraSpeed = oldRoot.debugCameraSpeed;
			Runtime.root.debugGridColor = oldRoot.debugGridColor;
			Runtime.root.debugShowGrid = oldRoot.debugShowGrid;
			const store = this.#store.value;
			if (store.selectedNodePath !== undefined) {
				Runtime.debugOptions.selectedNode = Runtime.findByPath(
					store.selectedNodePath
				);
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

	copyNode(node: GameNode) {
		const scene = SceneResource.fromNode(node);
		const storeableScene = SceneResource.toStore(scene);
		navigator.clipboard.writeText(JSON.stringify(storeableScene));
	}

	removeNode(node: GameNode) {
		console.log("here!");
		const parent = node.parent;
		if (parent !== undefined) {
			this.undoable({
				action: () => {
					parent.remove(node);
					this.saveSceneChanges();
				},
				undoAction: () => {
					parent.add(node);
					this.saveSceneChanges();
				},
			});
		}
	}

	cutNode(node: GameNode) {
		this.copyNode(node);
		this.removeNode(node);
	}

	async pasteNode(parent: GameNode) {
		const storeableScene = JSON.parse(await navigator.clipboard.readText());
		const scene = SceneResource.fromStore(storeableScene);
		const node = await scene.toNode();
		this.undoable({
			action: () => {
				parent.add(node);
				this.saveSceneChanges();
			},
			undoAction: () => {
				parent.add(node);
				this.saveSceneChanges();
			},
		});
	}
};

export const Editor = new EditorClass();
