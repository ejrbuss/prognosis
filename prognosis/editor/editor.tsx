import { Console } from "./console.js";
import { Explorer } from "./explorer.js";
import { HorizontalGutter, VerticalGutter } from "./gutter.js";
import { Inspector } from "./inspector.js";
import { Preview } from "./preview.js";
import { Toolbar } from "./toolbar.js";

const ToolbarHeight = 64;
const GutterSize = 5;
const MinSize = 200;

export function Editor() {
	// TODO usePeristentState
	const [state, setState] = React.useState({
		maxWidth: window.innerWidth,
		maxHeight: window.innerHeight,
		desiredInspectorWidth: 300,
		desiredExplorerWidth: 300,
		desiredConsoleHeight: 300,
	});

	React.useEffect(() => {
		const listener = () =>
			setState({
				...state,
				maxWidth: window.innerWidth,
				maxHeight: window.innerHeight,
			});
		window.addEventListener("resize", listener);
		return window.removeEventListener("resize", listener);
	});

	const previewWidth = Math.max(
		MinSize,
		state.maxWidth -
			(state.desiredInspectorWidth +
				state.desiredExplorerWidth +
				2 * GutterSize)
	);
	const desiredWidth = state.desiredInspectorWidth + state.desiredExplorerWidth;
	const inspectorWidth = Math.max(
		MinSize,
		(state.maxWidth - (previewWidth + 2 * GutterSize)) *
			(state.desiredInspectorWidth / desiredWidth)
	);
	const explorerWidth = Math.max(
		MinSize,
		state.maxWidth - (previewWidth + inspectorWidth + 2 * GutterSize)
	);
	const previewHeight = Math.max(
		MinSize,
		state.maxHeight - (state.desiredConsoleHeight + GutterSize + ToolbarHeight)
	);
	const consoleHeight = Math.max(
		MinSize,
		state.maxHeight - (previewHeight + GutterSize + ToolbarHeight)
	);
	return (
		<div
			className="editor"
			style={{
				overflow: "hidden",
				display: "grid",
				width: "100vw",
				height: "100vw",
				gridTemplateColumns: [
					`${previewWidth}px`,
					`${GutterSize}px`,
					`${inspectorWidth}px`,
					`${GutterSize}px`,
					`${explorerWidth}px`,
				].join(" "),
				gridTemplateRows: [
					`${ToolbarHeight}px`,
					`${previewHeight}px`,
					`${GutterSize}px`,
					`${consoleHeight}px`,
				].join(" "),
			}}
		>
			<Toolbar />
			<VerticalGutter />
			<Inspector />
			<VerticalGutter />
			<Explorer />
			<Preview />
			<HorizontalGutter />
			<Console />
		</div>
	);
}
