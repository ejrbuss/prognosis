import { Node } from "../nodes/node.js";
import { Explorer } from "./explorer.js";
import { Gutter } from "./gutter.js";
import { usePersistentState } from "./hooks.js";
import { Inspector } from "./inspector.js";
import { Preview } from "./preview.js";
import { Timeline } from "./timeline.js";
import { Toolbar } from "./toolbar.js";

const MinSize = 200;

type GridConstraints = {
	desiredInspectorWidth: number;
	desiredExplorerWidth: number;
	desiredTabsHeight: number;
};

export function Editor() {
	const [gridConstraints, setGridConstraints] = usePersistentState(
		"prognosis.editor.gridConstraints",
		{
			desiredInspectorWidth: 300,
			desiredExplorerWidth: 300,
			desiredTabsHeight: 300,
		}
	);
	const [selectedNode, setSelectedNode] = React.useState<Node | undefined>();

	React.useEffect(() => {
		const listener = () => setGridConstraints({ ...gridConstraints });
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	}, [gridConstraints]);

	const resizeInspector = (delta: number) =>
		setGridConstraints({
			...gridConstraints,
			desiredInspectorWidth: Math.max(
				MinSize,
				gridConstraints.desiredInspectorWidth - delta
			),
		});
	const resizeExplorer = (delta: number) =>
		setGridConstraints({
			...gridConstraints,
			desiredExplorerWidth: Math.max(
				Explorer.minWidth,
				gridConstraints.desiredExplorerWidth - delta
			),
		});
	const resizeTabs = (delta: number) =>
		setGridConstraints({
			...gridConstraints,
			desiredTabsHeight: Math.max(
				MinSize,
				gridConstraints.desiredTabsHeight - delta
			),
		});

	const grid = gridSolver(gridConstraints);
	return (
		<div
			className="editor"
			style={{
				gridTemplateColumns: [
					`${grid.toolbarWidth}px`,
					`${Gutter.size}px`,
					`${grid.inspectorWidth}px`,
					`${Gutter.size}px`,
					`${grid.explorerWidth}px`,
				].join(" "),
				gridTemplateRows: [
					`${Toolbar.height}px`,
					`${grid.previewHeight}px`,
					`${Gutter.size}px`,
					`${grid.tabsHeight}px`,
				].join(" "),
			}}
		>
			<Toolbar />
			<Gutter vertical onDrag={resizeInspector} />
			<Inspector selectedNode={selectedNode} />
			<Gutter vertical onDrag={resizeExplorer} />
			<Explorer selectedNode={selectedNode} setSelectedNode={setSelectedNode} />
			<Preview />
			<Gutter horizontal onDrag={resizeTabs} />
			<Timeline />
		</div>
	);
}

function gridSolver(constraints: GridConstraints) {
	const maxWidth = window.innerWidth;
	const maxHeight = window.innerHeight;
	const toolbarWidth = Math.max(
		Toolbar.minWidth,
		maxWidth -
			(constraints.desiredInspectorWidth +
				constraints.desiredExplorerWidth +
				2 * Gutter.size)
	);
	const desiredWidth =
		constraints.desiredInspectorWidth + constraints.desiredExplorerWidth;
	const inspectorWidth = Math.max(
		MinSize,
		(maxWidth - (toolbarWidth + 2 * Gutter.size)) *
			(constraints.desiredInspectorWidth / desiredWidth)
	);
	const explorerWidth = Math.max(
		Explorer.minWidth,
		maxWidth - (toolbarWidth + inspectorWidth + 2 * Gutter.size)
	);
	const previewHeight = Math.max(
		MinSize,
		maxHeight - (constraints.desiredTabsHeight + Gutter.size + Toolbar.height)
	);
	const tabsHeight = Math.max(
		MinSize,
		maxHeight - (previewHeight + Gutter.size + Toolbar.height)
	);
	return {
		toolbarWidth,
		inspectorWidth,
		explorerWidth,
		previewHeight,
		tabsHeight,
	};
}
