import { Tool } from "../nodes/game-node.js";
import { Editor } from "./editor.js";
import { Icon } from "./icon.js";

export function Toolbar() {
	return (
		<div className="toolbar">
			<Icon
				button
				large
				selected={Editor.selectedTool === Tool.Translate}
				onClick={() => Editor.selectTool(Tool.Translate)}
				title="Translate"
				icon="move-outline"
			/>
			<Icon
				button
				large
				selected={Editor.selectedTool === Tool.Scale}
				onClick={() => Editor.selectTool(Tool.Scale)}
				title="Scale"
				icon="resize-outline"
			/>
			<Icon
				button
				large
				selected={Editor.selectedTool === Tool.Rotate}
				onClick={() => Editor.selectTool(Tool.Rotate)}
				title="Rotate"
				icon="refresh-outline"
			/>
			<div className="spacer" />
			<Icon
				button
				large
				selected={Editor.lockToGrid}
				onClick={() => Editor.toggleLockToGrid()}
				title="Lock to Grid"
				icon="lock-closed-outline"
			/>
			<Icon
				button
				large
				selected={Editor.showGrid}
				onClick={() => Editor.toggleShowGrid()}
				title="Show Grid"
				icon="grid-outline"
			/>
			<input
				className="grid-size"
				type="number"
				min={0}
				value={Editor.gridSize}
				onChange={(event) => Editor.resizeGrid(event.target.valueAsNumber)}
			/>
			<span className="unit">px</span>
			<div className="spacer" />
			<Icon
				button
				large
				disabled={!Editor.debug}
				onClick={() => Editor.play()}
				title="Play"
				icon="play-outline"
			/>
			<Icon
				button
				large
				disabled={Editor.editable || Editor.debug}
				onClick={() => Editor.stop()}
				title="Stop"
				icon="stop-outline"
			/>
			<Icon
				button
				large
				disabled={Editor.editable}
				onClick={() => Editor.reset()}
				title="Reset"
				icon="play-skip-back-outline"
			/>
		</div>
	);
}
