import { Runtime } from "../runtime.js";
import { classNames } from "./classnames.js";
import { Icon } from "./icon.js";

export enum Tool {
	TranslationTool = "TranslationTool",
	ScaleTool = "ScaleTool",
	RotationTool = "RotationTool",
}

export type ToolbarProps = {};

export function Toolbar(props: ToolbarProps) {
	const [tool, setTool] = React.useState(Tool.TranslationTool);
	const [lockGrid, setLockGrid] = React.useState(false);
	const [showGrid, setShowGrid] = React.useState(false);
	const [playing, setPlaying] = React.useState(false);
	const play = () => {
		Runtime.running = true;
		Runtime.debug = false;
		setPlaying(true);
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
				selected={tool === Tool.TranslationTool}
				onClick={() => setTool(Tool.TranslationTool)}
				title="Translation Tool"
				icon="move-outline"
			/>
			<Icon
				button
				large
				selected={tool === Tool.ScaleTool}
				onClick={() => setTool(Tool.ScaleTool)}
				title="Scale Tool"
				icon="resize-outline"
			/>
			<Icon
				button
				large
				selected={tool === Tool.RotationTool}
				onClick={() => setTool(Tool.RotationTool)}
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
				disabled={playing}
				onClick={play}
				title="Play"
				icon="play-outline"
			/>
			<Icon
				button
				large
				disabled={!playing}
				onClick={stop}
				title="Stop"
				icon="stop-outline"
			/>
			<Icon
				button
				large
				disabled={true}
				title="Reset"
				icon="play-skip-back-outline"
			/>
		</div>
	);
}

Toolbar.height = 48;
Toolbar.minWidth = 416;
