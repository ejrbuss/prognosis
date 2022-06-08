import {
	GridConstants,
	GridConstraints,
	useEditorState,
} from "./editorstate.js";
import { Explorer } from "./explorer.js";
import { Gutter } from "./gutter.js";
import { useRerender } from "./hooks.js";
import { Inspector } from "./inspector.js";
import { Preview } from "./preview.js";
import { Timeline } from "./timeline.js";
import { Toolbar } from "./toolbar.js";

export function Editor() {
	const editorState = useEditorState();
	const rerender = useRerender();
	React.useEffect(() => {
		const listener = () => rerender();
		window.addEventListener("resize", listener);
		return () => window.removeEventListener("resize", listener);
	});
	const grid = gridSolver(editorState.gridConstraints);
	return (
		<div
			className="editor"
			style={{
				gridTemplateColumns: [
					`${grid.toolbarWidth}px`,
					`${GridConstants.GutterSize}px`,
					`${grid.inspectorWidth}px`,
					`${GridConstants.GutterSize}px`,
					`${grid.explorerWidth}px`,
				].join(" "),
				gridTemplateRows: [
					`${GridConstants.ToolbarHeight}px`,
					`${grid.previewHeight}px`,
					`${GridConstants.GutterSize}px`,
					`${grid.tabsHeight}px`,
				].join(" "),
			}}
		>
			<Toolbar editorState={editorState} />
			<Gutter vertical onDrag={(delta) => editorState.resizeInspector(delta)} />
			<Inspector editorState={editorState} />
			<Gutter vertical onDrag={(delta) => editorState.resizeExplorer(delta)} />
			<Explorer editorState={editorState} />
			<Preview />
			<Gutter
				horizontal
				onDrag={(delta) => editorState.resizeTimeline(delta)}
			/>
			<Timeline />
		</div>
	);
}

function gridSolver(constraints: GridConstraints) {
	const maxWidth = window.innerWidth;
	const maxHeight = window.innerHeight;
	const toolbarWidth = Math.max(
		GridConstants.ToolBarMinWidth,
		maxWidth -
			(constraints.desiredInspectorWidth +
				constraints.desiredExplorerWidth +
				2 * GridConstants.GutterSize)
	);
	const desiredWidth =
		constraints.desiredInspectorWidth + constraints.desiredExplorerWidth;
	const inspectorWidth = Math.max(
		GridConstants.InspectorMinWidth,
		(maxWidth - (toolbarWidth + 2 * GridConstants.GutterSize)) *
			(constraints.desiredInspectorWidth / desiredWidth)
	);
	const explorerWidth = Math.max(
		GridConstants.ExplorerMinWidth,
		maxWidth - (toolbarWidth + inspectorWidth + 2 * GridConstants.GutterSize)
	);
	const previewHeight = Math.max(
		GridConstants.PreviewMinHeight,
		maxHeight -
			(constraints.desiredTimelineHeight +
				GridConstants.GutterSize +
				GridConstants.ToolbarHeight)
	);
	const timelineHeight = Math.max(
		GridConstants.TimelineMinHeight,
		maxHeight -
			(previewHeight + GridConstants.GutterSize + GridConstants.ToolbarHeight)
	);
	return {
		toolbarWidth,
		inspectorWidth,
		explorerWidth,
		previewHeight,
		tabsHeight: timelineHeight,
	};
}
