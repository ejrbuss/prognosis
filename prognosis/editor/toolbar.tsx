import { EditorState, RuntimeState, Tool } from "./editorState.js";
import { Icon } from "./icon.js";

export function Toolbar() {
	return (
		<div className="toolbar">
			<Icon
				button
				large
				selected={EditorState.selectedTool === Tool.Translate}
				onClick={() => EditorState.selectTool(Tool.Translate)}
				title="Translate"
				icon="move-outline"
			/>
			<Icon
				button
				large
				selected={EditorState.selectedTool === Tool.Scale}
				onClick={() => EditorState.selectTool(Tool.Scale)}
				title="Scale"
				icon="resize-outline"
			/>
			<Icon
				button
				large
				selected={EditorState.selectedTool === Tool.Rotate}
				onClick={() => EditorState.selectTool(Tool.Rotate)}
				title="Rotate"
				icon="refresh-outline"
			/>
			<div className="spacer" />
			<Icon
				button
				large
				selected={EditorState.lockGrid}
				onClick={() => EditorState.toggleLockGrid()}
				title="Lock to Grid"
				icon="lock-closed-outline"
			/>
			<Icon
				button
				large
				selected={EditorState.showGrid}
				onClick={() => EditorState.toggleShowGrid()}
				title="Show Grid"
				icon="grid-outline"
			/>
			<input
				className="grid-size"
				type="number"
				min={0}
				value={EditorState.gridSize}
				onChange={(event) => EditorState.resizeGrid(event.target.valueAsNumber)}
			/>
			<span className="unit">px</span>
			<div className="spacer" />
			<Icon
				button
				large
				disabled={
					EditorState.runtimeState !== RuntimeState.Editable &&
					EditorState.runtimeState !== RuntimeState.Paused
				}
				onClick={() => EditorState.play()}
				title="Play"
				icon="play-outline"
			/>
			<Icon
				button
				large
				disabled={EditorState.runtimeState !== RuntimeState.Running}
				onClick={() => EditorState.stop()}
				title="Stop"
				icon="stop-outline"
			/>
			<Icon
				button
				large
				disabled={
					EditorState.runtimeState !== RuntimeState.Running &&
					EditorState.runtimeState !== RuntimeState.Paused
				}
				onClick={() => EditorState.reset()}
				title="Reset"
				icon="play-skip-back-outline"
			/>
		</div>
	);
}
