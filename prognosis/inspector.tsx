import { Camera } from "./data/camera.js";
import { Color } from "./data/color.js";
import { Easing } from "./easing.js";
import { Point } from "./data/point.js";
import { JsonData } from "./data/store.js";
import { Schema } from "./data/schema.js";
import { Runtime } from "./runtime.js";

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
			const [checked, setChecked] = React.useState(property.get());
			const [focus, setFocus] = React.useState(false);
			return (
				<div className="property">
					<div className="property-name">{property.name}</div>
					<div className="property-value">
						<input
							type="checkbox"
							readOnly={readOnly}
							checked={focus && !readOnly ? checked : property.get()}
							onChange={() => {
								const newChecked = !checked;
								property.set(newChecked);
								setChecked(newChecked);
							}}
							onFocus={() => setFocus(true)}
							onBlur={() => setFocus(false)}
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
							readOnly={readOnly}
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

	inspectString(property: Property<string>) {}

	inspectColor(property: Property<Color>) {}

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
	) {}

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
