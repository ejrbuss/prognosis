import { Inspector as NodeInspector } from "../inspector.js";
import { Node } from "../nodes/node.js";
import { Empty } from "./empty.js";
import { useRerender } from "./hooks.js";
import { Icon } from "./icon.js";

export type InspectorProps = {
	readOnly: boolean;
	selectedNode?: Node;
	nodeInspector?: NodeInspector;
};

export function Inspector({
	readOnly,
	selectedNode,
	nodeInspector,
}: InspectorProps) {
	const rerender = useRerender();
	React.useEffect(() => {
		const interval = setInterval(rerender, 100);
		return () => clearInterval(interval);
	}, []);
	return (
		<div className="inspector" style={{ gridRow: "span 4" }}>
			<h1>INSPSECTOR</h1>
			{selectedNode && nodeInspector ? (
				<React.Fragment>
					<div className="row">
						<Icon className="node-icon" large button icon={selectedNode.icon} />
						<input className="node-name" value={selectedNode.name} />
					</div>
					{nodeInspector.components.map((Component, index) => (
						<Component readOnly={readOnly} key={index} />
					))}
				</React.Fragment>
			) : (
				<Empty icon="eye-outline" text="Select a Node from the explorer" />
			)}
		</div>
	);
}
