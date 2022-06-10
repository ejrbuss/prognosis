import {
	LayoutConstants,
	LayoutConstraints,
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
	const layout = layoutSolver(editorState.layoutContraints);
	return (
		<div
			className="editor"
			style={{
				gridTemplateColumns: [
					`${layout.toolbarWidth}px`,
					`${LayoutConstants.GutterSize}px`,
					`${layout.inspectorWidth}px`,
					`${LayoutConstants.GutterSize}px`,
					`${layout.explorerWidth}px`,
				].join(" "),
				gridTemplateRows: [
					`${LayoutConstants.ToolbarHeight}px`,
					`${layout.previewHeight}px`,
					`${LayoutConstants.GutterSize}px`,
					`${layout.tabsHeight}px`,
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

function layoutSolver(constraints: LayoutConstraints) {
	const maxWidth = window.innerWidth;
	const maxHeight = window.innerHeight;
	const toolbarWidth = Math.max(
		LayoutConstants.ToolBarMinWidth,
		maxWidth -
			(constraints.desiredInspectorWidth +
				constraints.desiredExplorerWidth +
				2 * LayoutConstants.GutterSize)
	);
	const desiredWidth =
		constraints.desiredInspectorWidth + constraints.desiredExplorerWidth;
	const inspectorWidth = Math.max(
		LayoutConstants.InspectorMinWidth,
		(maxWidth - (toolbarWidth + 2 * LayoutConstants.GutterSize)) *
			(constraints.desiredInspectorWidth / desiredWidth)
	);
	const explorerWidth = Math.max(
		LayoutConstants.ExplorerMinWidth,
		maxWidth - (toolbarWidth + inspectorWidth + 2 * LayoutConstants.GutterSize)
	);
	const previewHeight = Math.max(
		LayoutConstants.PreviewMinHeight,
		maxHeight -
			(constraints.desiredTimelineHeight +
				LayoutConstants.GutterSize +
				LayoutConstants.ToolbarHeight)
	);
	const timelineHeight = Math.max(
		LayoutConstants.TimelineMinHeight,
		maxHeight -
			(previewHeight +
				LayoutConstants.GutterSize +
				LayoutConstants.ToolbarHeight)
	);
	return {
		toolbarWidth,
		inspectorWidth,
		explorerWidth,
		previewHeight,
		tabsHeight: timelineHeight,
	};
}
