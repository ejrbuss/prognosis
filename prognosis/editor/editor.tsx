import { Store } from "../data/store.js";
import { Gutter } from "./gutter.js";
import { jsx, Component } from "./imd.js";
import { Preview } from "./preview.js";

const GutterSize = 1;
const ToolbarHeight = 48;
const ToolBarMinWidth = 400;
const InspectorMinWidth = 225;
const ExplorerMinWidth = 300;
const PreviewMinHeight = 200;
const TimelineMinHeight = 200;
const DefaultWidthHeight = 300;

export class Editor extends Component {
	store = new Store("prognosis.editor.store", {
		desiredInspectorWidth: DefaultWidthHeight,
		desiredExplorerWidth: DefaultWidthHeight,
		desiredTimelineHeight: DefaultWidthHeight,
	});
	gridTemplateColumns!: string;
	gridTemplateRows!: string;

	get desiredInspectorWidth(): number {
		return this.store.value.desiredInspectorWidth;
	}

	get desiredExplorerWidth(): number {
		return this.store.value.desiredExplorerWidth;
	}

	get desiredTimelineHeight(): number {
		return this.store.value.desiredTimelineHeight;
	}

	set desiredInspectorWidth(width: number) {
		this.store.value.desiredInspectorWidth = Math.max(InspectorMinWidth, width);
		this.store.save();
		this.resize();
	}

	set desiredExplorerWidth(width: number) {
		this.store.value.desiredExplorerWidth = Math.max(ExplorerMinWidth, width);
		this.store.save();
		this.resize();
	}

	set desiredTimelineHeight(height: number) {
		this.store.value.desiredTimelineHeight = Math.max(
			TimelineMinHeight,
			height
		);
		this.store.save();
		this.resize();
	}

	resize = () => {
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;
		const desiredInspectorAndExplorerWidth =
			this.desiredInspectorWidth + this.desiredExplorerWidth;
		const toolbarWidth = Math.max(
			ToolBarMinWidth,
			maxWidth - (desiredInspectorAndExplorerWidth + 2 * GutterSize)
		);
		const inspectorWidth = Math.max(
			InspectorMinWidth,
			(maxWidth - (toolbarWidth + 2 * GutterSize)) *
				(this.desiredInspectorWidth / desiredInspectorAndExplorerWidth)
		);
		const explorerWidth = Math.max(
			ExplorerMinWidth,
			maxWidth - (toolbarWidth + inspectorWidth + 2 * GutterSize)
		);
		const previewHeight = Math.max(
			PreviewMinHeight,
			maxHeight - (this.desiredTimelineHeight + GutterSize + ToolbarHeight)
		);
		const timelineHeight = Math.max(
			TimelineMinHeight,
			maxHeight - (previewHeight - +GutterSize + ToolbarHeight)
		);
		this.gridTemplateColumns = [
			`${toolbarWidth}px`,
			`${GutterSize}px`,
			`${inspectorWidth}px`,
			`${GutterSize}px`,
			`${explorerWidth}px`,
		].join(" ");
		this.gridTemplateRows = [
			`${ToolbarHeight}px`,
			`${previewHeight}px`,
			`${GutterSize}px`,
			`${timelineHeight}px`,
		].join(" ");
	};

	override componentWillMount(): void {
		this.resize();
		window.addEventListener("resize", this.resize);
	}

	override componentWillUnmount(): void {
		window.removeEventListener("resize", this.resize);
	}

	override render() {
		return (
			<div
				className="editor"
				style={{
					gridTemplateColumns: this.gridTemplateColumns,
					gridTemplateRows: this.gridTemplateRows,
				}}
			>
				<Toolbar />
				<Gutter vertical onDrag={(d) => (this.desiredInspectorWidth -= d)} />
				<Inspector />
				<Gutter vertical onDrag={(d) => (this.desiredExplorerWidth -= d)} />
				<Explorer />
				<Preview />
				<Gutter horizontal onDrag={(d) => (this.desiredTimelineHeight -= d)} />
				<Timeline />
			</div>
		);
	}
}

function Toolbar() {
	return (
		<div className="toolbar">
			<h1>Toolbar</h1>
		</div>
	);
}

function Inspector() {
	return (
		<div className="inspector">
			<h1>Inspector</h1>
		</div>
	);
}

function Explorer() {
	return (
		<div className="explorer">
			<h1>Explorer</h1>
		</div>
	);
}

function Timeline() {
	return (
		<div className="timeline">
			<h1>Timeline</h1>
		</div>
	);
}
