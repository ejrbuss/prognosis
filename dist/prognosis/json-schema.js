export function conformsToSchema(schema, value) {
    if (schema === Boolean) {
        return typeof value === "boolean";
    }
    if (schema === Number) {
        return typeof value === "number";
    }
    if (schema === String) {
        return typeof value === "string";
    }
    if (Array.isArray(schema)) {
        const itemSchema = schema[0];
        if (!Array.isArray(value)) {
            return false;
        }
        return value.every((item) => conformsToSchema(itemSchema, item));
    }
    if (typeof schema === "object") {
        if (typeof value !== "object" || value === null) {
            return false;
        }
        return Object.keys(schema).every((key) => conformsToSchema(schema[key], value[key]));
    }
    return false;
}
//# sourceMappingURL=json-schema.js.map