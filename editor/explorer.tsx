import { GameNode } from "../nodes/game-node.js";
import { Runtime } from "../runtime.js";
import { EditorApi } from "./editorApi.js";
import { Editor } from "./editor.js";
import { Empty } from "./empty.js";
import { useInterval, classNames } from "./reactUtil.js";
import { Icon } from "./icon.js";

export function Explorer() {
	useInterval(100);
	const [nodeType, setNodeType] = React.useState("Node");
	const [filterValue, setFilterValue] = React.useState("");
	const nodeTypes = Object.keys(GameNode.Metadata).sort();
	const visibleNodes = findVisibleNodes(
		Runtime.root,
		filterValue.toLowerCase()
	);
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
							Editor.loadScene(sceneUrl);
						}
					}}
				/>
				<Icon
					large
					button
					title="Add Node"
					icon="add-outline"
					disabled={!Editor.editable}
					onClick={() => {
						const parent = Editor.selectedNode;
						if (parent !== undefined) {
							const child = new (GameNode.metadataFor(nodeType).type)();
							Editor.undoable({
								action: () => {
									parent.add(child);
									Editor.saveSceneChanges();
								},
								undoAction: () => {
									parent.remove(child);
									Editor.saveSceneChanges();
								},
							});
						}
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
			{Editor.sceneLoaded ? (
				<div className="nodes">
					<NodeTree node={Runtime.root} depth={0} visibleNodes={visibleNodes} />
				</div>
			) : (
				<React.Fragment>
					<Empty
						icon="folder-open-outline"
						text="Open a scene to get started."
					/>
					<div className="spacer" style={{ height: "38px" }} />
				</React.Fragment>
			)}
		</div>
	);
}

type NodeTreeProps = {
	node: GameNode;
	depth: number;
	visibleNodes: Set<GameNode>;
};

function NodeTree({ node, depth, visibleNodes }: NodeTreeProps) {
	const [dragging, setDragging] = React.useState(false);
	const [over, setOver] = React.useState(false);
	if (!visibleNodes.has(node)) {
		return <React.Fragment />;
	}
	const selected = Editor.selectedNode === node;
	const expanded = Editor.nodeExpanded(node);
	const expandIcon = expanded
		? "chevron-down-outline"
		: "chevron-forward-outline";
	return (
		<ul
			draggable={Editor.editable}
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
					const child = Editor.selectedNode;
					const undoNode = child?.parent;
					if (child !== undefined && !node.path.startsWith(child.path)) {
						Editor.undoable({
							action: () => {
								node.add(child);
								Editor.saveSceneChanges();
							},
							undoAction: () => {
								undoNode?.add(child);
								Editor.saveSceneChanges();
							},
						});
					}
				}}
				onMouseDown={(event) => {
					if (selected) {
						Editor.toggleNodeExpanded(node);
					} else {
						Editor.selectNode(node);
					}
					event.stopPropagation();
				}}
				onKeyDown={async (event) => {
					if (!Editor.editable) {
						return;
					}
					if (event.key === "c" && event.metaKey) {
						Editor.copyNode(node);
					}
					if (event.key === "x" && event.metaKey) {
						Editor.cutNode(node);
					}
					if (event.key === "v" && event.metaKey) {
						Editor.pasteNode(node);
					}
					if (event.key === "Backspace") {
						Editor.removeNode(node);
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
				<Icon className="node-icon" icon={GameNode.metadataFor(node).icon} />
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
								visibleNodes={visibleNodes}
							/>
						</li>
					))
			) : (
				<React.Fragment />
			)}
		</ul>
	);
}

function findVisibleNodes(root: GameNode, filter: string): Set<GameNode> {
	const visibleNodes = new Set([root]);
	function recurse(node: GameNode): boolean {
		const childVisible = node.children.reduce(
			(acc, child) => recurse(child) || acc,
			false
		);
		if (childVisible || node.name.toLowerCase().includes(filter)) {
			visibleNodes.add(node);
			return true;
		}
		return false;
	}
	recurse(root);
	return visibleNodes;
}
