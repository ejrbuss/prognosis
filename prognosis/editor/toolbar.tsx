import { Runtime } from "../runtime.js";
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
	const [showGrid, setShowGrid] = React.useState(false);
	const [playing, setPlaying] = React.useState(false);
	const play = () => {
		Runtime.running = true;
		Runtime.debug = false;
		setPlaying(true);
		editorState.makeReadonly();
	};
	const stop = () => {
		Runtime.running = false;
		Runtime.debug = true;
		setPlaying(false);
	};
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
				selected={showGrid}
				className={classNames({ selected: showGrid })}
				onClick={() => setShowGrid(!showGrid)}
				title="Show Grid"
				icon="grid-outline"
			/>
			<input className="grid-size" type="number" min={0} />
			<span className="unit">px</span>
			<div className="spacer" />
			<Icon
				button
				large
				disabled={editorState.scene === undefined || playing}
				onClick={play}
				title="Play"
				icon="play-outline"
			/>
			<Icon
				button
				large
				disabled={editorState.scene === undefined || !playing}
				onClick={stop}
				title="Stop"
				icon="stop-outline"
			/>
			<Icon
				button
				large
				disabled={editorState.scene === undefined || !editorState.readOnly}
				onClick={() => editorState.resetScene()}
				title="Reset"
				icon="play-skip-back-outline"
			/>
		</div>
	);
}
