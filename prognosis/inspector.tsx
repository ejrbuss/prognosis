import { Camera } from "./data/camera.js";
import { Color } from "./data/color.js";
import { Easing } from "./easing.js";
import { Point } from "./data/point.js";
import { JsonData } from "./data/store.js";
import { Schema } from "./data/schema.js";
import { Runtime } from "./runtime.js";
import { useRerender } from "./editor/hooks.js";
import { Icon } from "./editor/icon.js";
import { classNames } from "./editor/classnames.js";
import { Fragment } from "react";

class Property<Type> {
	constructor(
		readonly name: string,
		readonly get: () => Type,
		readonly set: (value: Type) => any
	) {}
}

export type Properties<Type> = {
	[Prop in keyof Type]: Property<Type[Prop]>;
};

export function propertiesOf<Type>(target: Type): Properties<Type> {
	return new Proxy(target as any, {
		get(target, name) {
			return new Property(
				name as string,
				() => target[name],
				(value: any) => (target[name] = value)
			);
		},
	}) as Properties<Type>;
}

interface Storeable {
	toJson(): JsonData;
	fromJson(json: JsonData): void;
}

const PointSchema = Schema.object({
	x: Schema.number,
	y: Schema.number,
});

export class Inspector {
	readonly storeables: Record<string, Storeable> = {};
	readonly components: React.FunctionComponent<{ readOnly: boolean }>[] = [];

	toJson(): JsonData {
		const properties: Record<string, JsonData> = {};
		for (const property in this.storeables) {
			properties[property] = this.storeables[property].toJson();
		}
		return properties;
	}

	fromJson(json: JsonData) {
		const properties = Schema.record(Schema.any).assert(json);
		for (const property in this.storeables) {
			if (property in properties) {
				this.storeables[property].fromJson(properties[property]);
			}
		}
	}

	header(text: string) {
		this.components.push(() => <h2>{text}</h2>);
	}

	inspectBoolean(property: Property<boolean>) {
		this.storeables[property.name] = {
			toJson: () => property.get(),
			fromJson: (json) => property.set(Schema.boolean.assert(json)),
		};
		this.components.push(({ readOnly }) => {
			const rerender = useRerender();
			const checked = property.get();
			return (
				<div className="property">
					<div className="property-name">{property.name}</div>
					<div className="property-value">
						<Icon
							button
							medium
							icon="ellipse"
							className={classNames("checkbox", { checked })}
							onClick={() => {
								property.set(!property.get());
								rerender();
							}}
						/>
					</div>
				</div>
			);
		});
	}

	inspectNumber(property: Property<number>) {
		this.storeables[property.name] = {
			toJson: () => property.get(),
			fromJson: (json) => property.set(Schema.number.assert(json)),
		};
		this.components.push(({ readOnly }) => {
			const [value, setValue] = React.useState(property.get().toString());
			const [focus, setFocus] = React.useState(false);
			return (
				<div className="property">
					<div className="property-name">{property.name}</div>
					<div className="property-value">
						<input
							type="number"
							disabled={readOnly}
							value={focus && !readOnly ? value : property.get()}
							onChange={(event) => {
								property.set(event.target.valueAsNumber);
								setValue(event.target.value);
							}}
							onFocus={() => setFocus(true)}
							onBlur={() => setFocus(false)}
						/>
					</div>
				</div>
			);
		});
	}

	inspectString(property: Property<string>) {
		this.storeables[property.name] = {
			toJson: () => property.get(),
			fromJson: (json) => property.set(Schema.string.assert(json)),
		};
		this.components.push(({ readOnly }) => {
			const rerender = useRerender();
			return (
				<div className="property">
					<div className="property-name">{property.name}</div>
					<div className="property-value">
						<input
							type="text"
							disabled={readOnly}
							value={property.get()}
							onChange={(event) => {
								property.set(event.target.value);
								rerender();
							}}
						/>
					</div>
				</div>
			);
		});
	}

	inspectColor(property: Property<Color>) {
		this.storeables[property.name] = {
			toJson: () => property.get().value,
			fromJson: (json) => property.set(new Color(Schema.number.assert(json))),
		};
		this.components.push(({ readOnly }) => {
			const colorRef = React.useRef<HTMLInputElement>(null);
			const rerender = useRerender();
			return (
				<React.Fragment>
					<div className="property">
						<div className="property-name">{property.name}</div>
						<div className="property-value">
							<div className="color-patch">
								<div
									className="color"
									tabIndex={0}
									style={{ backgroundColor: property.get().hex }}
									onClick={() => {
										if (colorRef.current !== null) {
											colorRef.current.click();
										}
									}}
								/>
								<input
									hidden
									ref={colorRef}
									type="color"
									value={property.get().hex.substring(0, 7)}
									disabled={readOnly}
									onChange={(event) => {
										const hex = parseInt(event.target.value.substring(1), 0x10);
										property.set(
											Color.rgba(
												((hex >> 0x10) & 0xff) / 255,
												((hex >> 0x8) & 0xff) / 255,
												(hex & 0xff) / 255,
												property.get().alpha
											)
										);
										rerender();
									}}
								/>
							</div>
						</div>
					</div>
					<div className="property">
						<div className="property-name">{property.name}.alpha</div>
						<div className="property-value">
							<input
								type="range"
								min={0}
								max={1}
								step={1 / 255}
								disabled={readOnly}
								value={property.get().alpha.toString()}
								onChange={(event) => {
									property.set(
										property.get().with({ alpha: event.target.valueAsNumber })
									);
									rerender();
								}}
							/>
						</div>
					</div>
				</React.Fragment>
			);
		});
	}

	inspectPoint(property: Property<Point>) {
		this.inspectNumber({
			name: `${property.name}.x`,
			get: () => property.get().x,
			set: (x) => property.set(property.get().with({ x })),
		});
		this.inspectNumber({
			name: `${property.name}.y`,
			get: () => property.get().y,
			set: (y) => property.set(property.get().with({ y })),
		});
	}

	inspectEnum<Enum>(
		property: Property<Enum>,
		enumValues: Record<string, Enum>
	) {
		const keys = Object.keys(enumValues);
		const values = Object.values(enumValues);
		const keyOf = (value: Enum) => keys[values.indexOf(value)];
		const valueOf = (key: string) => values[keys.indexOf(key)];
		this.storeables[property.name] = {
			toJson: () => keyOf(property.get()),
			fromJson: (json) => property.set(valueOf(Schema.string.assert(json))),
		};
		this.components.push(({ readOnly }) => {
			const rerender = useRerender();
			return (
				<div className="property">
					<div className="property-name">{property.name}</div>
					<div className="property-value">
						<select
							disabled={readOnly}
							value={keyOf(property.get())}
							onChange={(event) => {
								property.set(valueOf(event.target.value));
								rerender();
							}}
						>
							{keys.map((key, i) => (
								<option key={i} value={key}>
									{key}
								</option>
							))}
						</select>
					</div>
				</div>
			);
		});
	}

	inspectEasing(property: Property<Easing>) {
		this.inspectEnum(property, Easing);
	}

	inspectCamera(property: Property<Camera>) {
		this.inspectPoint({
			name: `${property.name}.position`,
			get: () => property.get().position,
			set: (position) => (property.get().position = position),
		});
		this.inspectNumber({
			name: `${property.name}.zoom`,
			get: () => property.get().zoom,
			set: (zoom) => (property.get().zoom = zoom),
		});
		this.inspectNumber({
			name: `${property.name}.rotation`,
			get: () => property.get().rotation,
			set: (rotation) => (property.get().rotation = rotation),
		});
	}
}
