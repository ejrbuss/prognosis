import { Store } from "../data/store.js";
import { Inspector } from "../inspector.js";
import { Node } from "../nodes/node.js";
import { Resources } from "../resources/resources.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { Signal } from "../signal.js";

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

export const GridConstants = {
	GutterSize: 1,
	ToolbarHeight: 48,
	ToolBarMinWidth: 416,
	InspectorMinWidth: 200,
	ExplorerMinWidth: 200,
	PreviewMinHeight: 200,
	TimelineMinHeight: 200,
};

export type GridConstraints = {
	desiredInspectorWidth: number;
	desiredExplorerWidth: number;
	desiredTimelineHeight: number;
};

type EditorStore = Store<{
	gridConstraints: GridConstraints;
	sceneUrl?: string;
	selectedNodePath?: string;
	nodeExpansions: Partial<Record<string, boolean>>;
}>;

export function _loadSceneFromStore() {
	editorState._loadSceneFromStore();
}

export class EditorState {
	#store: EditorStore = new Store("editor.store", {
		gridConstraints: {
			desiredInspectorWidth: 300,
			desiredExplorerWidth: 300,
			desiredTimelineHeight: 300,
		},
		nodeExpansions: {},
	});
	#scene?: SceneResource;
	#selectedNode?: Node;
	#inspector?: Inspector;
	#readOnly: boolean = false;

	get gridConstraints(): GridConstraints {
		return this.#store.value.gridConstraints;
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

	get readOnly(): boolean {
		return this.#readOnly;
	}

	nodeExpanded(node: Node): boolean {
		return this.#store.value.nodeExpansions[node.path] === true;
	}

	async _loadSceneFromStore() {
		const sceneUrl = this.#store.value.sceneUrl;
		if (sceneUrl !== undefined) {
			this.#scene = await Resources.load(SceneResource, sceneUrl);
			this.resetScene();
		}
	}

	resetScene() {
		(Runtime.root as any) = this.#scene?.buildRoot();
		const selectedNodePath = this.#store.value.selectedNodePath;
		if (Runtime.root !== undefined && selectedNodePath !== undefined) {
			this.#selectedNode = Runtime.find(selectedNodePath);
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

	makeReadonly() {
		if (this.#readOnly) {
			return;
		}
		this.#readOnly = true;
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
		this.#store.value.gridConstraints.desiredInspectorWidth -= delta;
		this.#store.save();
		stateChanges.send();
	}

	resizeExplorer(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#store.value.gridConstraints.desiredExplorerWidth -= delta;
		this.#store.save();
		stateChanges.send();
	}

	resizeTimeline(delta: number) {
		if (delta === 0) {
			return;
		}
		this.#store.value.gridConstraints.desiredTimelineHeight -= delta;
		this.#store.save();
		stateChanges.send();
	}
}

const stateChanges = new Signal();
const editorState = new EditorState();

(window as any).editorState = editorState;
