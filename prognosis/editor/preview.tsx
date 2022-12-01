import { jsx } from "./imd.js";

export function Preview() {
	return (
		<div className="preview">
			<h1>Preview</h1>
			<div id="game-container">
				<canvas tabIndex={1} id="game-canvas"></canvas>
			</div>
		</div>
	);
}
