import { NodeTypeSourceLocation } from "../nodes/node.js";
import { EditorApi } from "./editorapi.js";
import { EditorState } from "./editorstate.js";
import { Empty } from "./empty.js";
import { useInterval, useRerender } from "./hooks.js";
import { Icon } from "./icon.js";

export type InspectorProps = {
	editorState: EditorState;
};

export function Inspector({ editorState }: InspectorProps) {
	useInterval(100);
	const rerender = useRerender();
	const node = editorState.selectedNode;
	const inspector = editorState.inspector;
	return (
		<div className="inspector" style={{ gridRow: "span 4" }}>
			<h1>INSPSECTOR</h1>
			{node !== undefined && inspector !== undefined ? (
				<React.Fragment>
					<div className="row">
						<Icon
							className="node-icon"
							large
							button
							icon={node.icon}
							onClick={() =>
								EditorApi.openFileUrl(
									NodeTypeSourceLocation[node.constructor.name]
								)
							}
						/>
						<input
							className="node-name"
							value={node.name}
							onChange={(event) => {
								node.name = event.target.value;
								rerender();
							}}
						/>
					</div>
					{inspector.components.map((Component, index) => (
						<Component readOnly={editorState.readOnly} key={index} />
					))}
				</React.Fragment>
			) : (
				<Empty icon="eye-outline" text="Select a Node from the explorer" />
			)}
		</div>
	);
}
