type AbstractSchema =
	| BooleanConstructor
	| NumberConstructor
	| StringConstructor
	| ObjectConstructor
	| ArrayConstructor
	| AbstractSchema[]
	| { [Property: string]: AbstractSchema };

export type SchemaType<Schema extends AbstractSchema> =
	Schema extends BooleanConstructor
		? boolean
		: Schema extends NumberConstructor
		? number
		: Schema extends StringConstructor
		? string
		: Schema extends ObjectConstructor
		? object
		: Schema extends ArrayConstructor
		? any[]
		: Schema extends AbstractSchema[]
		? SchemaType<Schema[number]>[]
		: Schema extends Record<string, AbstractSchema>
		? { [K in keyof Schema]: SchemaType<Schema[K]> }
		: never;

class SchemaError extends Error {
	constructor(
		readonly path: string[],
		readonly expected: AbstractSchema,
		readonly actual: unknown
	) {
		super(
			`Schema expected ${(expected as any).name} at .${path.join(
				"."
			)} but found "${actual}"!`
		);
	}
}

export function schemaErrors<Schema extends AbstractSchema>(
	schema: Schema,
	value: unknown,
	path: string[] = []
): SchemaError[] {
	if (schema === Boolean) {
		if (typeof value !== "boolean") {
			return [new SchemaError([...path], schema, value)];
		}
		return [];
	}
	if (schema === Number) {
		if (typeof value !== "number") {
			return [new SchemaError([...path], schema, value)];
		}
		return [];
	}
	if (schema === String) {
		if (typeof value !== "string") {
			return [new SchemaError([...path], schema, value)];
		}
		return [];
	}
	if (schema === Object) {
		if (!(value instanceof Object)) {
			return [new SchemaError([...path], schema, value)];
		}
		return [];
	}
	if (schema === Array) {
		if (!(value instanceof Array)) {
			return [new SchemaError([...path], schema, value)];
		}
		return [];
	}
	if (schema instanceof Array) {
		if (!(value instanceof Array)) {
			return [new SchemaError([...path], Array, value)];
		}
		const itemSchema = schema[0];
		return value.flatMap((item, index) => {
			path.push(index.toString());
			const errors = schemaErrors(itemSchema, item);
			path.pop();
			return errors;
		});
	}
	if (!(value instanceof Object)) {
		return [new SchemaError([...path], schema, value)];
	}
	return Object.keys(schema).flatMap((key) => {
		path.push(key);
		const errors = schemaErrors(
			(schema as any)[key],
			(value as any)[key],
			path
		);
		path.pop();
		return errors;
	});
}

export function checkSchema<Schema extends AbstractSchema>(
	schema: Schema,
	value: unknown
): value is SchemaType<Schema> {
	return schemaErrors(schema, value).length === 0;
}

export function assertSchema<Schema extends AbstractSchema>(
	schema: Schema,
	value: unknown
): asserts value is SchemaType<Schema> {
	const firstError = schemaErrors(schema, value).pop();
	if (firstError) {
		throw firstError;
	}
}
