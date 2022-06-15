import { Camera } from "../data/camera.js";
import { Color } from "../data/color.js";
import { Point } from "../data/point.js";
import {
	BooleanVariable,
	EnumVariable,
	Node,
	NumberVariable,
	StringVariable,
	Variable,
} from "../nodes/node.js";
import { EditorApi } from "./editorApi.js";
import { Editor } from "./editor.js";
import { Empty } from "./empty.js";
import { useInterval, useRerender } from "./reactUtil.js";
import { Icon } from "./icon.js";
import { SpriteResource } from "../resources/spriteResource.js";

type InspectorState = {
	node: Node | undefined;
	nodeComponents: React.FunctionComponent<{}>[];
	typeComponents: React.FunctionComponent<{}>[];
};

const NodeVariableNames = ["x", "y", "z", "priority"];

export function Inspector() {
	useInterval(100);
	const [state, setState] = React.useState({
		node: undefined,
		nodeComponents: [],
		typeComponents: [],
	} as InspectorState);

	// Sync with editorState
	if (state.node !== Editor.selectedNode) {
		const newState: InspectorState = {
			node: Editor.selectedNode,
			nodeComponents: [],
			typeComponents: [],
		};
		if (newState.node !== undefined) {
			const node = newState.node;
			const metadata = Node.metadataFor(node);
			for (const name in metadata.variables) {
				const variable = metadata.variables[name];
				let InspectComponent!: VariableInspector<any>;
				if (variable instanceof EnumVariable) {
					InspectComponent = InspectEnum(variable);
				} else {
					InspectComponent = VariableInspectorFor.get(
						variable
					) as VariableInspector<any>;
				}
				if (InspectComponent === undefined) {
					continue;
				}
				const Component = () => {
					const focusValue = React.useRef(undefined as any);
					const value = (node as any)[name];
					const setValue = (newValue: any) => {
						(node as any)[name] = newValue;
						rerender();
					};
					const rerender = useRerender();
					return (
						<div
							onFocus={() => (focusValue.current = value)}
							onBlur={() => {
								const undoValue = focusValue.current;
								Editor.undoable({
									action: () => {
										setValue(value);
										Editor.saveSceneChanges();
									},
									undoAction: () => {
										setValue(undoValue);
										Editor.saveSceneChanges();
									},
								});
							}}
						>
							<InspectComponent name={name} value={value} setValue={setValue} />
						</div>
					);
				};
				if (NodeVariableNames.includes(name)) {
					newState.nodeComponents.push(Component);
				} else {
					newState.typeComponents.push(Component);
				}
			}
		}
		setState(newState);
	}
	const node = state.node;
	if (node !== undefined) {
		return (
			<div className="inspector" style={{ gridRow: "span 4" }}>
				<h1>INSPSECTOR</h1>
				<React.Fragment>
					<NodeTitle node={node} />
					<h2>Node Varaibles</h2>
					{state.nodeComponents.map((Component, index) => (
						<Component key={index} />
					))}
					<h2>{node.constructor.name} Variables</h2>
					{state.typeComponents.map((Component, index) => (
						<Component key={index} />
					))}
				</React.Fragment>
			</div>
		);
	} else {
		return (
			<div className="inspector" style={{ gridRow: "span 4" }}>
				<h1>INSPSECTOR</h1>
				<Empty icon="eye-outline" text="Select a Node from the explorer" />
			</div>
		);
	}
}

type NodeTitleProps = {
	node: Node;
};

function NodeTitle({ node }: NodeTitleProps) {
	const focusValue = React.useRef(node.name);
	const [nodeName, setNodeName] = React.useState("");
	const [focus, setFocus] = React.useState(false);
	const metadata = Node.metadataFor(node);
	return (
		<div className="row">
			<Icon
				className="node-icon"
				large
				button
				icon={metadata.icon}
				onClick={() => EditorApi.openFileUrl(metadata.modulePath)}
			/>
			<input
				className="node-name"
				value={focus ? nodeName : node.name}
				onChange={(event) => {
					node.name = event.target.value;
					setNodeName(event.target.value);
				}}
				onFocus={() => {
					setNodeName(node.name);
					focusValue.current = node.name;
					setFocus(true);
				}}
				onBlur={() => {
					const undoNodeName = focusValue.current;
					Editor.undoable({
						action: () => {
							node.name = nodeName;
							Editor.saveSceneChanges();
						},
						undoAction: () => {
							node.name = undoNodeName;
							Editor.saveSceneChanges();
						},
					});
					setFocus(false);
				}}
			/>
		</div>
	);
}

type VariableInspectorProps<Type> = {
	name: string;
	value: Type;
	setValue: (value: Type) => void;
};

type VariableInspector<Type> = React.FunctionComponent<
	VariableInspectorProps<Type>
>;

function InspectBoolean({
	name,
	value,
	setValue,
}: VariableInspectorProps<boolean>) {
	return (
		<div className="property">
			<div className="property-name">{name}</div>
			<div className="property-value">
				<Icon
					button
					medium
					icon="ellipse"
					className="checkbox"
					disabled={!Editor.editable}
					selected={value}
					onClick={() => setValue(!value)}
				/>
			</div>
		</div>
	);
}

function InspectNumber({
	name,
	value,
	setValue,
}: VariableInspectorProps<number>) {
	const valueRef = React.useRef(value.toString());
	const [focused, setFocused] = React.useState(false);
	return (
		<div className="property">
			<div className="property-name">{name}</div>
			<div className="property-value">
				<input
					type="number"
					disabled={!Editor.editable}
					value={focused ? valueRef.current : value}
					onChange={(event) => {
						valueRef.current = event.target.value;
						try {
							setValue(event.target.valueAsNumber);
						} catch {}
					}}
					onFocus={() => {
						valueRef.current = value.toString();
						setFocused(true);
					}}
					onBlur={() => setFocused(false)}
				/>
			</div>
		</div>
	);
}

function InspectString({
	name,
	value,
	setValue,
}: VariableInspectorProps<string>) {
	return (
		<div className="property">
			<div className="property-name">{name}</div>
			<div className="property-value">
				<input
					type="text"
					disabled={!Editor.editable}
					value={value}
					onChange={(event) => setValue(event.target.value)}
				/>
			</div>
		</div>
	);
}

function InspectEnum<Enum>(variable: EnumVariable<Enum>) {
	return function ({ name, value, setValue }: VariableInspectorProps<Enum>) {
		return (
			<div className="property">
				<div className="property-name">{name}</div>
				<div className="property-value">
					<select
						disabled={!Editor.editable}
						value={variable.keyOf(value)}
						onChange={(event) => setValue(variable.valueOf(event.target.value))}
					>
						{variable.keys.map((key, index) => (
							<option key={index} value={key}>
								{key}
							</option>
						))}
					</select>
				</div>
			</div>
		);
	};
}

function InspectColor({
	name,
	value,
	setValue,
}: VariableInspectorProps<Color>) {
	const colorRef = React.useRef<HTMLInputElement>(null);
	return (
		<React.Fragment>
			<div className="property">
				<div className="property-name">{name}</div>
				<div className="property-value">
					<div className="color-patch">
						<div
							className="color"
							tabIndex={0}
							style={{ backgroundColor: value.hex }}
							onClick={() => {
								if (colorRef.current !== null) {
									colorRef.current.click();
								}
							}}
						/>
						<input
							className="hidden"
							type="color"
							ref={colorRef}
							disabled={!Editor.editable}
							value={value.hex.substring(0, 7)}
							onChange={(event) => {
								const hex = parseInt(event.target.value.substring(1), 0x10);
								setValue(new Color((hex << 0x8) + (value.value & 0xff)));
							}}
						/>
					</div>
				</div>
			</div>
			<div className="property">
				<div className="property-name">{name}.alpha</div>
				<div className="property-value">
					<input
						type="range"
						min={0}
						max={1}
						step={1 / 255}
						disabled={!Editor.editable}
						value={value.alpha}
						onChange={(event) =>
							setValue(value.with({ alpha: event.target.valueAsNumber }))
						}
					/>
				</div>
			</div>
		</React.Fragment>
	);
}

function InspectPoint({
	name,
	value,
	setValue,
}: VariableInspectorProps<Point>) {
	return (
		<React.Fragment>
			<InspectNumber
				name={`${name}.x`}
				value={value.x}
				setValue={(x) => setValue(value.with({ x }))}
			/>
			<InspectNumber
				name={`${name}.y`}
				value={value.y}
				setValue={(y) => setValue(value.with({ y }))}
			/>
		</React.Fragment>
	);
}

function InspectCamera({
	name,
	value,
	setValue,
}: VariableInspectorProps<Camera>) {
	return (
		<React.Fragment>
			<InspectNumber
				name={`${name}.x`}
				value={value.x}
				setValue={(x) => setValue(value.with({ x }))}
			/>
			<InspectNumber
				name={`${name}.y`}
				value={value.y}
				setValue={(y) => setValue(value.with({ y }))}
			/>
			<InspectNumber
				name={`${name}.rotation`}
				value={value.rotation}
				setValue={(rotation) => setValue(value.with({ rotation }))}
			/>
			<InspectNumber
				name={`${name}.zoom`}
				value={value.zoom}
				setValue={(zoom) => setValue(value.with({ zoom }))}
			/>
		</React.Fragment>
	);
}

function InspectSpriteResource({
	name,
	value,
	setValue,
}: VariableInspectorProps<SpriteResource>) {
	return (
		<div className="property">
			<div className="property-name">{name}</div>
			<div className="property-value">
				<input
					type="file"
					disabled={!Editor.editable}
					onChange={async (event) => {
						const files = event.target.files;
						if (files !== null && files.length > 0) {
							const url = await EditorApi.getFileUrl(files[0]);
							const spriteResource = await SpriteResource.load(url);
							setValue(spriteResource);
						}
					}}
				/>
			</div>
		</div>
	);
}
const VariableInspectorFor = new Map<Variable<any>, VariableInspector<any>>([
	[BooleanVariable, InspectBoolean],
	[NumberVariable, InspectNumber],
	[StringVariable, InspectString],
	[Point, InspectPoint],
	[Color, InspectColor],
	[Camera, InspectCamera],
	[SpriteResource, InspectSpriteResource],
]);
