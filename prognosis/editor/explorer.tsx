import { Node, NodeTypes } from "../nodes/node.js";
import { Scene, SceneSchema } from "../resources/sceneResource.js";
import { classNames } from "./classnames.js";
import { EditorApi } from "./editorapi.js";
import { EditorState } from "./editorstate.js";
import { Empty } from "./empty.js";
import { useInterval } from "./hooks.js";
import { Icon } from "./icon.js";

type ExplorerProps = {
	editorState: EditorState;
};

// TODO prevent actions when readonly !!!

export function Explorer({ editorState }: ExplorerProps) {
	useInterval(100);
	const [nodeType, setNodeType] = React.useState("Node");
	const [filterValue, setFilterValue] = React.useState("");
	const nodeTypes = Object.keys(NodeTypes).sort();
	const nodeVisibilty: Record<string, boolean> = {};
	const editorRoot = editorState.editorRoot;
	filterNode(editorRoot, filterValue.toLowerCase(), nodeVisibilty);
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
							editorState.loadScene(sceneUrl);
						}
					}}
				/>
				<Icon
					large
					button
					title="Add Node"
					icon="add-outline"
					onClick={() => {
						const parent = editorState.selectedNode;
						if (parent !== undefined) {
							const child = new NodeTypes[nodeType]();
							parent.add(child);
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
			{editorRoot.children.length === 0 ? (
				<React.Fragment>
					<Empty
						icon="folder-open-outline"
						text="Open a scene to get started."
					/>
					<div className="spacer" style={{ height: "38px" }} />
				</React.Fragment>
			) : (
				<div className="nodes">
					{editorRoot.children.map((childNode, index) => (
						<NodeTree
							key={index}
							node={childNode}
							depth={0}
							nodeVisibility={nodeVisibilty}
							editorState={editorState}
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
	editorState: EditorState;
};

function NodeTree({ node, depth, nodeVisibility, editorState }: NodeTreeProps) {
	const [dragging, setDragging] = React.useState(false);
	const [over, setOver] = React.useState(false);
	if (!nodeVisibility[node.path]) {
		return <React.Fragment />;
	}
	const expanded = editorState.nodeExpanded(node);
	const expandIcon = expanded
		? "chevron-down-outline"
		: "chevron-forward-outline";
	return (
		<ul
			draggable
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
					const childNode = editorState.selectedNode;
					if (
						childNode !== undefined &&
						!node.path.startsWith(childNode.path)
					) {
						node.add(childNode);
					}
				}}
				onClick={() => {
					editorState.toggleNodeExpansion(node);
					editorState.selectNode(node);
				}}
				onFocus={() => {
					editorState.selectNode(node);
				}}
				onKeyDown={async (event) => {
					if (event.key === "c" && event.metaKey) {
						navigator.clipboard.writeText(JSON.stringify(Scene.fromNode(node)));
					}
					if (event.key === "x" && event.metaKey) {
						navigator.clipboard.writeText(JSON.stringify(Scene.fromNode(node)));
						if (node !== undefined && node.parent !== undefined) {
							node.parent.remove(node);
						}
					}
					if (event.key === "v" && event.metaKey) {
						const scene = SceneSchema.validate(
							JSON.parse(await navigator.clipboard.readText())
						);
						if (scene !== undefined) {
							node.add(Scene.toNode(scene));
						}
					}
					if (event.key === "Backspace") {
						// Handle root editor elements special
						if (node !== undefined && node.parent !== undefined) {
							node.parent.remove(node);
						}
					}
				}}
				className={classNames("node", {
					selected: editorState.selectedNode === node,
					dragging,
					over,
				})}
				tabIndex={0}
			>
				<div className="spacer" style={{ minWidth: `${depth * 12}px` }} />
				<Icon
					className="node-expand"
					icon={expandIcon}
					style={{ opacity: node.children.length > 0 ? 1 : 0 }}
				/>
				<Icon className="node-icon" icon={node.icon} />
				<div className="node-name">{node.name}</div>
			</div>
			{expanded ? (
				node.children.map((child, index) => (
					<li key={index}>
						<NodeTree
							node={child}
							depth={depth + 1}
							nodeVisibility={nodeVisibility}
							editorState={editorState}
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
