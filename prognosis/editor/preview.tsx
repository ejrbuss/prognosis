export type PreviewProps = {};

export function Preview(props: PreviewProps) {
	return (
		<div className="preview">
			<div id="game-container">
				<canvas id="game-canvas"></canvas>
			</div>
		</div>
	);
}
