import { Node } from "../nodes/node.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { EditorApi } from "./editorApi.js";
import { EditorState, RuntimeState } from "./editorState.js";
import { Empty } from "./empty.js";
import { useInterval, classNames } from "./reactUtil.js";
import { Icon } from "./icon.js";

export function Explorer() {
	useInterval(100);
	const [nodeType, setNodeType] = React.useState("Node");
	const [filterValue, setFilterValue] = React.useState("");
	const nodeVisibilty: Record<string, boolean> = {};
	const nodeTypes = Object.keys(Node.Metadata).sort();
	const explorerRoot =
		EditorState.runtimeState === RuntimeState.Running
			? Runtime.root
			: EditorState.editorRoot;
	filterNode(explorerRoot, filterValue.toLowerCase(), nodeVisibilty);
	const sceneFileRef = React.useRef<HTMLInputElement>(null);
	return (
		<div className="explorer" style={{ gridRow: "span 4" }}>
			<h1>EXPLORER</h1>
			<div className="tools">
				<Icon
					button
					large
					onClick={() => {
						if (sceneFileRef.current !== null) {
							sceneFileRef.current.click();
						}
					}}
					title="Open Scene"
					icon="folder-open-outline"
				/>
				<input
					hidden
					type="file"
					accept=".json"
					ref={sceneFileRef}
					onChange={async (event) => {
						const files = event.target.files;
						if (files !== null && files.length > 0) {
							const sceneUrl = await EditorApi.getFileUrl(files[0]);
							EditorState.loadScene(sceneUrl);
						}
					}}
				/>
				<Icon
					large
					button
					title="Add Node"
					icon="add-outline"
					disabled={EditorState.runtimeState !== RuntimeState.Editable}
					onClick={() => {
						const parent = EditorState.selectedNode ?? EditorState.editorRoot;
						const child = new (Node.metadataFor(nodeType).type)();
						EditorState.undoable({
							action: () => {
								parent.add(child);
								EditorState.saveSceneChanges();
							},
							undoAction: () => {
								parent.remove(child);
								EditorState.saveSceneChanges();
							},
						});
					}}
				/>
				<select
					value={nodeType}
					onChange={(event) => setNodeType(event.target.value)}
				>
					{nodeTypes.map((nodeType, i) => (
						<option key={i} value={nodeType}>
							{nodeType}
						</option>
					))}
				</select>
				<div className="filter">
					<input
						className="with-icon"
						placeholder="filter nodes"
						size={8}
						type="text"
						value={filterValue}
						onChange={(event) => setFilterValue(event.target.value)}
					/>
					<Icon large className="input-icon" icon="search-outline" />
				</div>
			</div>
			{EditorState.runtimeState === RuntimeState.Empty ? (
				<React.Fragment>
					<Empty
						icon="folder-open-outline"
						text="Open a scene to get started."
					/>
					<div className="spacer" style={{ height: "38px" }} />
				</React.Fragment>
			) : (
				<div className="nodes" onMouseDown={() => EditorState.selectNode()}>
					{explorerRoot.children.map((childNode, index) => (
						<NodeTree
							key={index}
							node={childNode}
							depth={0}
							nodeVisibility={nodeVisibilty}
						/>
					))}
				</div>
			)}
		</div>
	);
}

type NodeTreeProps = {
	node: Node;
	depth: number;
	nodeVisibility: Record<string, boolean>;
};

function NodeTree({ node, depth, nodeVisibility }: NodeTreeProps) {
	const [dragging, setDragging] = React.useState(false);
	const [over, setOver] = React.useState(false);
	if (!nodeVisibility[node.path]) {
		return <React.Fragment />;
	}
	const selected = EditorState.selectedNode === node;
	const expanded = EditorState.nodeExpanded(node);
	const expandIcon = expanded
		? "chevron-down-outline"
		: "chevron-forward-outline";
	return (
		<ul
			draggable={EditorState.runtimeState === RuntimeState.Editable}
			onDragStart={() => setDragging(true)}
			onDragEnd={() => setDragging(false)}
		>
			<div
				onDragEnter={() => setOver(true)}
				onDragLeave={() => setOver(false)}
				onDragOver={(event) => {
					event.stopPropagation();
					event.preventDefault();
				}}
				onDrop={() => {
					setOver(false);
					const child = EditorState.selectedNode;
					const undoNode = child?.parent;
					if (child !== undefined && !child.path.startsWith(node.path)) {
						EditorState.undoable({
							action: () => {
								node.add(child);
								EditorState.saveSceneChanges();
							},
							undoAction: () => {
								undoNode?.add(child);
								EditorState.saveSceneChanges();
							},
						});
					}
				}}
				onMouseDown={(event) => {
					if (selected) {
						EditorState.toggleNodeExpanded(node);
					} else {
						EditorState.selectNode(node);
					}
					event.stopPropagation();
				}}
				onKeyDown={async (event) => {
					if (EditorState.runtimeState !== RuntimeState.Editable) {
						return;
					}
					if (event.key === "c" && event.metaKey) {
						const scene = SceneResource.fromNodes([node]);
						const storeableScene = SceneResource.toStore(scene);
						navigator.clipboard.writeText(JSON.stringify(storeableScene));
					}
					if (event.key === "x" && event.metaKey) {
						const parent = node.parent;
						const scene = SceneResource.fromNodes([node]);
						const storeableScene = SceneResource.toStore(scene);
						navigator.clipboard.writeText(JSON.stringify(storeableScene));
						EditorState.undoable({
							action: () => {
								parent?.remove(node);
								EditorState.saveSceneChanges();
							},
							undoAction: () => {
								parent?.add(node);
								EditorState.saveSceneChanges();
							},
						});
					}
					if (event.key === "v" && event.metaKey) {
						const storeableScene = JSON.parse(
							await navigator.clipboard.readText()
						);
						const scene = SceneResource.fromStore(storeableScene);
						const nodes = scene.toNodes();
						EditorState.undoable({
							action: () => {
								node.addAll(nodes);
								EditorState.saveSceneChanges();
							},
							undoAction: () => {
								node.removeAll(nodes);
								EditorState.saveSceneChanges();
							},
						});
					}
					if (event.key === "Backspace") {
						const parent = node.parent;
						EditorState.undoable({
							action: () => {
								parent?.remove(node);
								EditorState.selectNode();
								EditorState.saveSceneChanges();
							},
							undoAction: () => {
								parent?.add(node);
								EditorState.selectNode(node);
								EditorState.saveSceneChanges();
							},
						});
					}
				}}
				className={classNames("node", { selected, dragging, over })}
				tabIndex={0}
			>
				<div className="spacer" style={{ minWidth: `${depth * 12}px` }} />
				<Icon
					className="node-expand"
					icon={expandIcon}
					style={{ opacity: node.children.length > 0 ? 1 : 0 }}
				/>
				<Icon className="node-icon" icon={Node.metadataFor(node).icon} />
				<div className="node-name">{node.name}</div>
			</div>
			{expanded ? (
				node.children
					.sort((a, b) => b.priority - a.priority)
					.map((child, index) => (
						<li key={index}>
							<NodeTree
								node={child}
								depth={depth + 1}
								nodeVisibility={nodeVisibility}
							/>
						</li>
					))
			) : (
				<React.Fragment />
			)}
		</ul>
	);
}

function filterNode(
	node: Node,
	filterValue: string,
	nodeVisiblity: Record<string, boolean>
): boolean {
	const childAdded = node.children.reduce(
		(added, childNode) =>
			filterNode(childNode, filterValue, nodeVisiblity) || added,
		false
	);
	let visible = childAdded || node.name.toLowerCase().includes(filterValue);
	nodeVisiblity[node.path] = visible;
	return visible;
}
