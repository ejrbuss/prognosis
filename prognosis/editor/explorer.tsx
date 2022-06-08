import { Node } from "../nodes/node.js";
import { Resources } from "../resources/resources.js";
import { SceneResource } from "../resources/sceneResource.js";
import { Runtime } from "../runtime.js";
import { classNames } from "./classnames.js";
import { EditorApi } from "./editorapi.js";
import { EditorAction } from "./editorstate.js";
import { Empty } from "./empty.js";
import { Icon } from "./icon.js";

export type ExplorerProps = {
	selectedNode?: Node;
	dispatch: (action: EditorAction) => void;
};

export function Explorer({ selectedNode, dispatch }: ExplorerProps) {
	const sceneFileRef = React.useRef<HTMLInputElement>(null);
	const root = Runtime.root;
	const openScene = () => {
		if (sceneFileRef.current !== null) {
			sceneFileRef.current.click();
		}
	};
	return (
		<div className="explorer" style={{ gridRow: "span 4" }}>
			<h1>EXPLORER</h1>
			<div className="tools">
				<Icon
					button
					large
					onClick={openScene}
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
							const scene = await Resources.load(SceneResource, sceneUrl);
							dispatch(EditorAction.loadScene(scene));
						}
					}}
				/>
				<Icon large button title="Add Node" icon="add-outline" />
				<div className="filter">
					<input
						className="with-icon"
						placeholder="filter nodes"
						size={8}
						type="text"
					/>
					<Icon large className="input-icon" icon="search-outline" />
				</div>
			</div>
			{root === undefined ? (
				<React.Fragment>
					<Empty
						icon="folder-open-outline"
						text="Open a scene to get started."
					/>
					<div className="spacer" style={{ height: "38px" }} />
				</React.Fragment>
			) : (
				<div className="nodes">
					<NodeTree
						node={root}
						depth={0}
						selectedNode={selectedNode}
						dispatch={dispatch}
					/>
				</div>
			)}
		</div>
	);
}

type NodeTreeProps = {
	node: Node;
	depth: number;
	selectedNode?: Node;
	dispatch: (action: EditorAction) => void;
};

function NodeTree({ node, depth, selectedNode, dispatch }: NodeTreeProps) {
	const [expanded, setExpanded] = React.useState(false);
	const [dragging, setDragging] = React.useState(false);
	const [over, setOver] = React.useState(false);
	let expandIcon = "";
	if (node.children.length > 0) {
		expandIcon = expanded ? "chevron-down-outline" : "chevron-forward-outline";
	}
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
					// TODO handle drops
				}}
				onClick={() => {
					setExpanded(!expanded);
					dispatch(EditorAction.selectNode(node));
				}}
				className={classNames("node", {
					selected: selectedNode === node,
					dragging,
					over,
				})}
				tabIndex={0}
			>
				<div className="spacer" style={{ minWidth: `${depth * 12}px` }} />
				<Icon className="node-expand" icon={expandIcon} />
				<Icon className="node-icon" icon={node.icon} />
				<div className="node-name">{node.name}</div>
			</div>
			{expanded ? (
				node.children.map((child, index) => (
					<li key={index}>
						<NodeTree
							node={child}
							depth={depth + 1}
							selectedNode={selectedNode}
							dispatch={dispatch}
						/>
					</li>
				))
			) : (
				<React.Fragment />
			)}
		</ul>
	);
}
