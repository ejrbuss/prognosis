import { Color } from "../data/color.js";
import { Store } from "../data/store.js";
import { Inspector } from "../inspector.js";
import { Grid } from "../nodes/grid.js";
import { Node } from "../nodes/node.js";
import { Project } from "../project.js";
import { Resources } from "../resources/resources.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { Signal } from "../signal.js";
import { EditorRoot } from "./editorroot.js";

export function useEditorState() {
	const [_, forceUpdate] = React.useState({});
	React.useEffect(() => {
		const token = stateChanges.connect(() => forceUpdate({}));
		return () => {
			stateChanges.disconnect(token);
		};
	}, []);
	return editorState;
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
	nodeExpansions: Partial<Record<string, boolean>>;
	gridSize: number;
}>;

export function startEditorState() {
	editorState.start();
}

export class EditorState {
	#store: EditorStore = new Store("prognosis.editor.store", {
		layoutConstraints: {
			desiredInspectorWidth: 300,
			desiredExplorerWidth: 300,
			desiredTimelineHeight: 300,
		},
		nodeExpansions: {},
		gridSize: 100,
	});
	#editorRoot: EditorRoot = new EditorRoot();
	#scene?: SceneResource;
	#selectedNode?: Node;
	#inspector?: Inspector;
	#running: boolean = false;
	#readOnly: boolean = false;

	get layoutContraints(): LayoutConstraints {
		return this.#store.value.layoutConstraints;
	}

	get gridSize(): number {
		return this.#store.value.gridSize;
	}

	get showGrid(): boolean {
		return this.#editorRoot.showGrid;
	}

	get editorRoot(): Node {
		return this.#editorRoot;
	}

	get scene(): SceneResource | undefined {
		return this.#scene;
	}

	get selectedNode(): Node | undefined {
		return this.#selectedNode;
	}

	get inspector(): Inspector | undefined {
		return this.#inspector;
	}

	get running(): boolean {
		return this.#running;
	}

	get readOnly(): boolean {
		return this.#readOnly;
	}

	nodeExpanded(node: Node): boolean {
		return this.#store.value.nodeExpansions[node.path] === true;
	}

	async start() {
		Runtime.root.removeAll();
		Runtime.root.add(this.#editorRoot);
		this.#editorRoot.cameraSpeed = Project.graphics.width / 3;
		this.#editorRoot.gridSize = this.#store.value.gridSize;
		const sceneUrl = this.#store.value.sceneUrl;
		if (sceneUrl !== undefined) {
			this.#scene = await Resources.load(SceneResource, sceneUrl);
			this.resetScene();
		}
	}

	resetScene() {
		this.#editorRoot.removeAll();
		if (this.#scene !== undefined) {
			this.#editorRoot?.add(this.#scene.toNode());
		}
		const selectedNodePath = this.#store.value.selectedNodePath;
		if (selectedNodePath !== undefined) {
			this.#selectedNode = this.#editorRoot.find(selectedNodePath);
			this.#inspector = new Inspector();
			this.#selectedNode?._inspect(this.#inspector);
		} else {
			this.#selectedNode = undefined;
		}
		this.#readOnly = false;
		stateChanges.send();
	}

	async loadScene(sceneUrl: string) {
		const scene = await Resources.load(SceneResource, sceneUrl);
		this.#store.value.sceneUrl = sceneUrl;
		this.#store.value.selectedNodePath = undefined;
		this.#store.value.nodeExpansions = {};
		this.#scene = scene;
		this.#store.save();
		this.resetScene();
	}

	selectNode(node: Node) {
		if (node === this.#selectedNode) {
			return;
		}
		this.#selectedNode = node;
		this.#inspector = new Inspector();
		this.#selectedNode._inspect(this.#inspector);
		this.#store.value.selectedNodePath = node.path;
		this.#store.save();
		stateChanges.send();
	}

	toggleNodeExpansion(node: Node) {
		const expanded = this.nodeExpanded(node);
		this.#store.value.nodeExpansions[node.path] = !expanded;
		this.#store.save();
		stateChanges.send();
	}

	resizeInspector(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#store.value.layoutConstraints.desiredInspectorWidth = Math.max(
			LayoutConstants.InspectorMinWidth,
			this.layoutContraints.desiredInspectorWidth - delta
		);
		this.#store.save();
		stateChanges.send();
	}

	resizeExplorer(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#store.value.layoutConstraints.desiredExplorerWidth = Math.max(
			LayoutConstants.ExplorerMinWidth,
			this.layoutContraints.desiredExplorerWidth - delta
		);
		this.#store.save();
		stateChanges.send();
	}

	resizeTimeline(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#store.value.layoutConstraints.desiredTimelineHeight = Math.max(
			LayoutConstants.TimelineMinHeight,
			this.layoutContraints.desiredTimelineHeight - delta
		);
		this.#store.save();
		stateChanges.send();
	}

	resizeGrid(newGridSize: number) {
		this.#editorRoot.gridSize = newGridSize;
		this.#store.value.gridSize = newGridSize;
		this.#store.save();
		stateChanges.send();
	}

	toggleGrid() {
		this.#editorRoot.showGrid = !this.#editorRoot.showGrid;
		stateChanges.send();
	}

	play() {
		this.#readOnly = true;
		this.#running = true;
		Runtime.root.remove(this.#editorRoot);
		this.#editorRoot.children.forEach((childNode) => {
			Runtime.root.add(childNode);
		});
		stateChanges.send();
	}

	stop() {
		this.#running = false;
		Runtime.root.children.forEach((childNode) => {
			this.#editorRoot.add(childNode);
		});
		Runtime.root.add(this.#editorRoot);
		stateChanges.send();
	}
}

const stateChanges = new Signal();
const editorState = new EditorState();

(window as any).editorState = editorState;
