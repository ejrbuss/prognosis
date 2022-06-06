import { Node } from "../nodes/node.js";
import { Empty } from "./empty.js";
import { Icon } from "./icon.js";

export type InspectorProps = {
	selectedNode?: Node;
};

export function Inspector({ selectedNode }: InspectorProps) {
	return (
		<div className="inspector" style={{ gridRow: "span 4" }}>
			<h1>INSPSECTOR</h1>
			{selectedNode ? (
				<React.Fragment>
					<div className="row">
						<Icon className="node-icon" large icon={selectedNode.icon} />
						<input className="node-name" defaultValue={selectedNode.name} />
					</div>
					<h2>Properties</h2>
					<div className="row">
						<div className="prop-name">Type</div>
						<input
							readOnly
							className="prop-value with-icon"
							value={selectedNode.constructor.name}
						/>
						<Icon className="input-icon" large icon="document-text-outline" />
					</div>
				</React.Fragment>
			) : (
				<Empty icon="eye-outline" text="Select a Node from the explorer" />
			)}
		</div>
	);
}
