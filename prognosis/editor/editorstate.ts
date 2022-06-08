import { Node } from "../nodes/node.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Inspector as NodeInspector } from "../inspector.js";
import { Store } from "../data/store.js";
import { Runtime } from "../runtime.js";
import { Resources } from "../resources/resources.js";

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

export enum Tool {
	Transform = "Transform",
	Scale = "Scale",
	Rotate = "Rotate",
}

export type EditorState = {
	gridConstraints: GridConstraints;
	scene?: SceneResource;
	selectedNode?: Node;
	inspector?: NodeInspector;
	nodeExpansions: Partial<Record<number, true>>;
	running: boolean;
	readOnly: boolean;
};

type StoredEditorState = {
	gridConstraints: GridConstraints;
	sceneUrl?: string;
	selectedNodePath?: string;
	nodeExpansions: Partial<Record<string, true>>;
};

const editorStore = new Store<StoredEditorState>("editor.state", {
	gridConstraints: {
		desiredInspectorWidth: 300,
		desiredExplorerWidth: 300,
		desiredTimelineHeight: 300,
	},
	nodeExpansions: {},
});

export async function loadEditorState(
	dispatch: (action: EditorAction) => void
) {
	if (editorStore.value.sceneUrl !== undefined) {
		try {
			const scene = await Resources.load(
				SceneResource,
				editorStore.value.sceneUrl
			);
			dispatch(EditorAction.loadScene(scene));
			const selectedNodePath = editorStore.value.selectedNodePath;
			if (selectedNodePath !== undefined) {
				const selectedNode = Runtime.root.find(selectedNodePath);
				if (selectedNode !== undefined) {
					dispatch(EditorAction.selectNode(selectedNode));
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
}

export const InitialEditorState: EditorState = {
	gridConstraints: editorStore.value.gridConstraints,
	nodeExpansions: {},
	running: false,
	readOnly: false,
};

export namespace EditorAction {
	export function resizeInspector(dx: number) {
		return { type: "resizeInspector", dx } as const;
	}

	export function resizeExplorer(dx: number) {
		return { type: "resizeExplorer", dx } as const;
	}

	export function resizeTimeline(dy: number) {
		return { type: "resizeTimeline", dy } as const;
	}

	export function loadScene(scene: SceneResource) {
		return { type: "loadScene", scene } as const;
	}

	export function selectNode(node: Node) {
		return { type: "selectNode", node } as const;
	}

	export function setReadOnly(readOnly: boolean) {
		return { type: "setReadOnly", readOnly } as const;
	}
}

export type EditorAction = {
	[actionConstructor in keyof typeof EditorAction]: ReturnType<
		typeof EditorAction[actionConstructor]
	>;
}[keyof typeof EditorAction];

export function editorReducer(
	state: EditorState,
	action: EditorAction
): EditorState {
	switch (action.type) {
		case "resizeInspector": {
			const gridConstraints = {
				...state.gridConstraints,
				desiredInspectorWidth: Math.max(
					GridConstants.InspectorMinWidth,
					state.gridConstraints.desiredInspectorWidth - action.dx
				),
			};
			editorStore.value.gridConstraints = gridConstraints;
			editorStore.save();
			return { ...state, gridConstraints };
		}
		case "resizeExplorer": {
			const gridConstraints = {
				...state.gridConstraints,
				desiredExplorerWidth: Math.max(
					GridConstants.ExplorerMinWidth,
					state.gridConstraints.desiredExplorerWidth - action.dx
				),
			};
			editorStore.value.gridConstraints = gridConstraints;
			editorStore.save();
			return { ...state, gridConstraints };
		}
		case "resizeTimeline": {
			const gridConstraints = {
				...state.gridConstraints,
				desiredTimelineHeight: Math.max(
					GridConstants.TimelineMinHeight,
					state.gridConstraints.desiredTimelineHeight - action.dy
				),
			};
			editorStore.value.gridConstraints = gridConstraints;
			editorStore.save();
			return { ...state, gridConstraints };
		}
		case "loadScene": {
			editorStore.value.sceneUrl = action.scene.url;
			editorStore.save();
			Runtime.root = action.scene.buildRoot();
			return { ...state, scene: action.scene, readOnly: false };
		}
		case "setReadOnly": {
			if (state.readOnly === action.readOnly) {
				return state;
			}
			return { ...state, readOnly: action.readOnly };
		}
		case "selectNode": {
			if (state.selectedNode === action.node) {
				return state;
			}
			const inspector = new NodeInspector();
			action.node._inspect(inspector);
			return { ...state, selectedNode: action.node, inspector };
		}
	}
}
