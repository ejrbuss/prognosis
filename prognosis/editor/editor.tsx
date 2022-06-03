import { Explorer } from "./explorer.js";
import { Gutter } from "./gutter.js";
import { usePersistentState } from "./hooks.js";
import { Inspector } from "./inspector.js";
import { Preview } from "./preview.js";
import { Resources } from "./resources.js";
import { Tabs } from "./tabs.js";
import { Timeline } from "./timeline.js";
import { Toolbar } from "./toolbar.js";

const MinSize = 200;

type GridConstraints = {
	maxWidth: number;
	maxHeight: number;
	desiredInspectorWidth: number;
	desiredExplorerWidth: number;
	desiredTabsHeight: number;
};

export function Editor() {
	const [gridConstraints, setGridConstraints] = usePersistentState(
		"prognosis.editor.state",
		{
			maxWidth: window.innerWidth,
			maxHeight: window.innerHeight,
			desiredInspectorWidth: 300,
			desiredExplorerWidth: 300,
			desiredTabsHeight: 300,
		}
	);

	React.useEffect(() => {
		const listener = () =>
			setGridConstraints({
				...gridConstraints,
				maxWidth: window.innerWidth,
				maxHeight: window.innerHeight,
			});
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
				MinSize,
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
					`${grid.previewWidth}px`,
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
			<Inspector />
			<Gutter vertical onDrag={resizeExplorer} />
			<Explorer />
			<Preview />
			<Gutter horizontal onDrag={resizeTabs} />
			<Tabs>
				<Timeline />
				<Resources />
			</Tabs>
		</div>
	);
}

function gridSolver(constraints: GridConstraints) {
	const previewWidth = Math.max(
		MinSize,
		constraints.maxWidth -
			(constraints.desiredInspectorWidth +
				constraints.desiredExplorerWidth +
				2 * Gutter.size)
	);
	const desiredWidth =
		constraints.desiredInspectorWidth + constraints.desiredExplorerWidth;
	const inspectorWidth = Math.max(
		MinSize,
		(constraints.maxWidth - (previewWidth + 2 * Gutter.size)) *
			(constraints.desiredInspectorWidth / desiredWidth)
	);
	const explorerWidth = Math.max(
		MinSize,
		constraints.maxWidth - (previewWidth + inspectorWidth + 2 * Gutter.size)
	);
	const previewHeight = Math.max(
		MinSize,
		constraints.maxHeight -
			(constraints.desiredTabsHeight + Gutter.size + Toolbar.height)
	);
	const tabsHeight = Math.max(
		MinSize,
		constraints.maxHeight - (previewHeight + Gutter.size + Toolbar.height)
	);
	return {
		previewWidth,
		inspectorWidth,
		explorerWidth,
		previewHeight,
		tabsHeight,
	};
}
