import { Camera } from "./data/camera.js";
import { Color } from "./data/color.js";
import { Point } from "./data/point.js";
import { Schema } from "./data/schema.js";
import { JsonData } from "./data/store.js";
import { EditorState } from "./editor/editorstate.js";
import { Icon } from "./editor/icon.js";
import { Node } from "./nodes/node.js";

export type PropertyComponent<Type> = React.FunctionComponent<{
	name: string;
	value: Type;
	setValue: (value: Type) => void;
	editorState: EditorState;
}>;

export class Property<Type> {
	constructor(
		readonly copy: (value: Type) => Type,
		readonly toJsonData: (value: Type) => JsonData,
		readonly fromJsonData: (jsonData: JsonData) => Type,
		readonly inspectorComponent: PropertyComponent<Type>
	) {}
}

const PrognosisProperties = Symbol("Prognosis.Properties");

type Properties = Record<string, Property<any>>;

export function propertiesOf(node: Node) {
	let properties = (node.constructor as any)[PrognosisProperties] as Properties;
	if (properties === undefined) {
		properties = {};
		(node.constructor as any)[PrognosisProperties] = properties;
	}
	return properties;
}

export function expose(property: Property<any>) {
	return function (target: Node, key: string) {
		const properties = propertiesOf(target);
		if (!(key in properties)) {
			properties[key] = property;
		}
	};
}

export const BooleanProperty = new Property<boolean>(
	(value) => value,
	(value) => value,
	(value) => Schema.boolean.assert(value),
	({ name, value, setValue, editorState }) => {
		return (
			<div className="property">
				<div className="property-name">{name}</div>
				<div className="property-value">
					<Icon
						button
						medium
						icon="ellipse"
						disabled={editorState.readOnly}
						selected={value}
						onClick={() => setValue(!value)}
					/>
				</div>
			</div>
		);
	}
);

export const NumberProperty = new Property<number>(
	(value) => value,
	(value) => value,
	(value) => Schema.number.assert(value),
	({ name, value, setValue, editorState }) => {
		return (
			<div className="property">
				<div className="property-name">{name}</div>
				<div className="property-value">
					<input
						type="number"
						disabled={editorState.readOnly}
						value={value}
						onChange={(event) => setValue(event.target.valueAsNumber)}
					/>
				</div>
			</div>
		);
	}
);

export const StringProperty = new Property<string>(
	(value) => value,
	(value) => value,
	(value) => Schema.string.assert(value),
	({ name, value, setValue, editorState }) => {
		return (
			<div className="property">
				<div className="property-name">{name}</div>
				<div className="property-value">
					<input
						type="text"
						disabled={editorState.readOnly}
						value={value}
						onChange={(event) => setValue(event.target.value)}
					/>
				</div>
			</div>
		);
	}
);

const EnumPropertyCache = new Map<any, Property<any>>();

export function EnumProperty<Enum>(
	enumValues: Record<string, Enum>
): Property<Enum> {
	const cachedProperty = EnumPropertyCache.get(enumValues);
	if (cachedProperty !== undefined) {
		return cachedProperty;
	}
	const keys = Object.keys(enumValues);
	const values = Object.values(enumValues);
	const keyOf = (value: Enum) => keys[values.indexOf(value)];
	const valueOf = (key: string) => values[keys.indexOf(key)];
	const property = new Property<Enum>(
		(value) => value,
		(value) => keyOf(value),
		(value) => valueOf(Schema.string.assert(value)),
		({ name, value, setValue, editorState }) => {
			return (
				<div className="property">
					<div className="property-name">{name}</div>
					<div className="property-value">
						<select
							disabled={editorState.readOnly}
							value={keyOf(value)}
							onChange={(event) => setValue(valueOf(event.target.value))}
						>
							{keys.map((key, index) => (
								<option key={index} value={key}>
									{key}
								</option>
							))}
						</select>
					</div>
				</div>
			);
		}
	);
	EnumPropertyCache.set(enumValues, property);
	return property;
}

export const ColorProperty = new Property<Color>(
	(value) => value,
	(value) => value.value,
	(value) => new Color(Schema.number.assert(value)),
	({ name, value, setValue, editorState }) => {
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
								disabled={editorState.readOnly}
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
							disabled={editorState.readOnly}
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
);

const PointSchema = Schema.object({ x: Schema.number, y: Schema.number });

export const PointProperty = new Property<Point>(
	(value) => value,
	(value) => ({ x: value.x, y: value.y }),
	(value) => Point.Origin.with(PointSchema.assert(value)),
	({ name, value, setValue, editorState }) => {
		return (
			<React.Fragment>
				<NumberProperty.inspectorComponent
					name={`${name}.x`}
					value={value.x}
					setValue={(x) => setValue(value.with({ x }))}
					editorState={editorState}
				/>
				<NumberProperty.inspectorComponent
					name={`${name}.y`}
					value={value.y}
					setValue={(y) => setValue(value.with({ y }))}
					editorState={editorState}
				/>
			</React.Fragment>
		);
	}
);

const CameraSchema = Schema.object({
	x: Schema.number,
	y: Schema.number,
	rotation: Schema.number,
	zoom: Schema.number,
});

export const CameraProperty = new Property<Camera>(
	(value) => value.with({}),
	(value) => ({
		x: value.x,
		y: value.y,
		rotation: value.rotation,
		zoom: value.zoom,
	}),
	(value) => new Camera().with(CameraSchema.assert(value)),
	({ name, value, setValue, editorState }) => {
		return (
			<React.Fragment>
				<NumberProperty.inspectorComponent
					name={`${name}.x`}
					value={value.x}
					setValue={(x) => setValue(value.with({ x }))}
					editorState={editorState}
				/>
				<NumberProperty.inspectorComponent
					name={`${name}.y`}
					value={value.y}
					setValue={(y) => setValue(value.with({ y }))}
					editorState={editorState}
				/>
				<NumberProperty.inspectorComponent
					name={`${name}.rotation`}
					value={value.rotation}
					setValue={(rotation) => setValue(value.with({ rotation }))}
					editorState={editorState}
				/>
				<NumberProperty.inspectorComponent
					name={`${name}.zoom`}
					value={value.zoom}
					setValue={(zoom) => setValue(value.with({ zoom }))}
					editorState={editorState}
				/>
			</React.Fragment>
		);
	}
);
