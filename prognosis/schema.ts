export type SchemaType<SchemaType> = SchemaType extends Schema<infer Type>
	? Type
	: never;

export class SchemaError extends Error {
	constructor(
		readonly path: string[],
		readonly expected: string,
		readonly actual: unknown
	) {
		super(`Expected ${expected} at .${path.join(".")} but found: ${actual}`);
	}
}

export class Schema<Type> {
	static any: Schema<any> = new Schema("any", () => undefined);

	static undefined: Schema<undefined> = new Schema(
		"undefined",
		(value, path) => {
			if (value !== this.undefined) {
				return new SchemaError(path, "undefined", value);
			}
		}
	);

	static null: Schema<null> = new Schema("null", (value, path) => {
		if (value !== null) {
			return new SchemaError(path, "null", value);
		}
	});

	static boolean: Schema<boolean> = new Schema("boolean", (value, path) => {
		if (typeof value !== "boolean") {
			return new SchemaError(path, "boolean", value);
		}
	});

	static number: Schema<number> = new Schema("number", (value, path) => {
		if (typeof value !== "number") {
			return new SchemaError(path, "number", value);
		}
	});

	static string: Schema<string> = new Schema("string", (value, path) => {
		if (typeof value !== "string") {
			return new SchemaError(path, "string", value);
		}
	});

	static array<Type>(itemSchema: Schema<Type>): Schema<Type[]> {
		return new Schema(`${itemSchema.description}[]`, (value, path) => {
			if (!(value instanceof Array)) {
				return new SchemaError(path, "array", value);
			}
			return value.find((item, index) =>
				itemSchema.errorFunction(item, [...path, index.toString()])
			);
		});
	}

	static object<Type>(propertySchemas: {
		[Property in keyof Type]: Schema<Type[Property]>;
	}): Schema<Type> {
		const descriptionParts = [];
		descriptionParts.push("{");
		for (const property in propertySchemas) {
			descriptionParts.push(
				`\t"${property}": ${propertySchemas[property].description},`
			);
		}
		descriptionParts.push("}");
		return new Schema(`${descriptionParts.join("\n")}`, (value, path) => {
			if (!(value instanceof Object)) {
				return new SchemaError(path, "object", value);
			}
			for (const property in propertySchemas) {
				const propertyError = propertySchemas[property].errorFunction(
					(value as any)[property],
					[...path, property]
				);
				if (propertyError !== undefined) {
					return propertyError;
				}
			}
		});
	}

	static record<Type>(itemSchema: Schema<Type>): Schema<Record<string, Type>> {
		return new Schema(
			`Record<string, ${itemSchema.description}>`,
			(value, path) => {
				if (!(value instanceof Object)) {
					return new SchemaError(path, "object", value);
				}
				for (const property in value) {
					const propertyError = itemSchema.errorFunction(
						(value as any)[property],
						[...path, property]
					);
					if (propertyError !== undefined) {
						return propertyError;
					}
				}
			}
		);
	}

	static either<Type1, Type2>(
		schema1: Schema<Type1>,
		schema2: Schema<Type2>
	): Schema<Type1 | Type2> {
		return new Schema(
			`(${schema1.description} | ${schema2.description})`,
			(value, path) => {
				const error1 = schema1.errorFunction(value, path);
				const error2 = schema2.errorFunction(value, path);
				if (error1 !== undefined && error2 !== undefined) {
					return new SchemaError(
						path,
						`${schema1.description} or ${schema2.description}`,
						value
					);
				}
			}
		);
	}

	static optional<Type>(schema: Schema<Type>): Schema<Type | undefined> {
		return this.either(schema, Schema.undefined);
	}

	constructor(
		readonly description: string,
		readonly errorFunction: (
			value: unknown,
			path: string[]
		) => SchemaError | undefined
	) {}

	validate(value: unknown): Type | undefined {
		return this.errorFunction(value, []) === undefined
			? (value as Type)
			: undefined;
	}

	assert(value: unknown): Type {
		const error = this.errorFunction(value, []);
		if (error !== undefined) {
			throw error;
		}
		return value as Type;
	}
}
