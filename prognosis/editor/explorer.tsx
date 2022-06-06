import { Node } from "../nodes/node.js";
import { classNames } from "./classnames.js";
import { Empty } from "./empty.js";
import { useRoot } from "./hooks.js";
import { Icon } from "./icon.js";

export type ExplorerProps = {
	selectedNode?: Node;
	setSelectedNode: (node?: Node) => void;
};

export function Explorer({ selectedNode, setSelectedNode }: ExplorerProps) {
	const root = useRoot();
	return (
		<div className="explorer" style={{ gridRow: "span 4" }}>
			<h1>EXPLORER</h1>
			<div className="tools">
				<Icon button large title="Open Scene" icon="folder-open-outline" />
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
				<Empty icon="folder-open-outline" text="Open a scene to get started." />
			) : (
				<div className="nodes">
					<NodeTree
						node={root}
						depth={0}
						selectedNode={selectedNode}
						setSelectedNode={setSelectedNode}
					/>
				</div>
			)}
		</div>
	);
}

Explorer.minWidth = 200;

type NodeTreeProps = {
	node: Node;
	depth: number;
	selectedNode?: Node;
	setSelectedNode: (node?: Node) => void;
};

function NodeTree({
	node,
	depth,
	selectedNode,
	setSelectedNode,
}: NodeTreeProps) {
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
				onFocus={() => setSelectedNode(node)}
				onClick={() => {
					setExpanded(!expanded);
					setSelectedNode(node);
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
							setSelectedNode={setSelectedNode}
						/>
					</li>
				))
			) : (
				<React.Fragment />
			)}
		</ul>
	);
}
