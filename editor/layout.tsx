import { LayoutConstants, LayoutConstraints, Editor } from "./editor.js";
import { Explorer } from "./explorer.js";
import { Gutter } from "./gutter.js";
import { useEventListener, useRerender, useSignal } from "./reactUtil.js";
import { Inspector } from "./inspector.js";
import { Preview } from "./preview.js";
import { Timeline } from "./timeline.js";
import { Toolbar } from "./toolbar.js";

export function Layout() {
	const rerender = useRerender();
	useSignal(Editor.updates);
	useEventListener(window, "resize", rerender);
	useEventListener(window, "keydown", (event) => {
		const keyEvent = event as KeyboardEvent;
		// Redo
		if (keyEvent.key === "z" && keyEvent.metaKey && keyEvent.shiftKey) {
			if (Editor.editable) {
				Editor.redo();
			}
			keyEvent.stopPropagation();
			keyEvent.preventDefault();
			return;
		}
		// Undo
		if (keyEvent.key === "z" && keyEvent.metaKey) {
			if (Editor.editable) {
				Editor.undo();
			}
			keyEvent.stopPropagation();
			keyEvent.preventDefault();
			return;
		}
	});
	const layout = layoutSolver(Editor.layoutConstraints);
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
			<Toolbar />
			<Gutter vertical onDrag={(d) => Editor.resizeInspector(d)} />
			<Inspector />
			<Gutter vertical onDrag={(d) => Editor.resizeExplorer(d)} />
			<Explorer />
			<Preview />
			<Gutter horizontal onDrag={(d) => Editor.resizeTimeline(d)} />
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
