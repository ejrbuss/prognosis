import { classNames } from "./classnames.js";
import { EditorState } from "./editorstate.js";
import { Icon } from "./icon.js";

export enum Tool {
	Translation = "Translation",
	Scale = "Scale",
	Rotation = "Rotation",
}

export type ToolbarProps = {
	editorState: EditorState;
};

export function Toolbar({ editorState }: ToolbarProps) {
	const [tool, setTool] = React.useState(Tool.Translation);
	const [lockGrid, setLockGrid] = React.useState(false);
	return (
		<div className="toolbar">
			<Icon
				button
				large
				selected={tool === Tool.Translation}
				onClick={() => setTool(Tool.Translation)}
				title="Translation Tool"
				icon="move-outline"
			/>
			<Icon
				button
				large
				selected={tool === Tool.Scale}
				onClick={() => setTool(Tool.Scale)}
				title="Scale Tool"
				icon="resize-outline"
			/>
			<Icon
				button
				large
				selected={tool === Tool.Rotation}
				onClick={() => setTool(Tool.Rotation)}
				title="Rotation Tool"
				icon="refresh-outline"
			/>
			<div className="spacer" />
			<Icon
				button
				large
				selected={lockGrid}
				onClick={() => setLockGrid(!lockGrid)}
				title="Lock to Grid"
				icon="lock-closed-outline"
			/>
			<Icon
				button
				large
				selected={editorState.showGrid}
				onClick={() => editorState.toggleGrid()}
				title="Show Grid"
				icon="grid-outline"
			/>
			<input
				className="grid-size"
				type="number"
				min={0}
				value={editorState.gridSize}
				onChange={(event) => editorState.resizeGrid(event.target.valueAsNumber)}
			/>
			<span className="unit">px</span>
			<div className="spacer" />
			<Icon
				button
				large
				disabled={editorState.running}
				onClick={() => editorState.play()}
				title="Play"
				icon="play-outline"
			/>
			<Icon
				button
				large
				disabled={!editorState.running}
				onClick={() => editorState.stop()}
				title="Stop"
				icon="stop-outline"
			/>
			<Icon
				button
				large
				disabled={!editorState.readOnly}
				onClick={() => editorState.resetScene()}
				title="Reset"
				icon="play-skip-back-outline"
			/>
		</div>
	);
}
