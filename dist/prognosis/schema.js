export function checkSchema(schema, value) {
    if (schema === Boolean) {
        return typeof value === "boolean";
    }
    if (schema === Number) {
        return typeof value === "number";
    }
    if (schema === String) {
        return typeof value === "string";
    }
    if (schema instanceof Array) {
        if (value instanceof Array) {
            for (const itemSchema of schema) {
                for (const itemValue of value) {
                    if (!checkSchema(itemSchema, itemValue)) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }
    if (value instanceof Object) {
        for (const key in schema) {
            if (!checkSchema(schema[key], value[key])) {
                return false;
            }
        }
        return true;
    }
    return false;
}
export function assertSchema(schema, value) {
    if (schema === Boolean) {
        if (typeof value !== "boolean") {
            throw new Error();
        }
        return;
    }
    if (schema === Number) {
        if (typeof value !== "number") {
            throw new Error();
        }
        return;
    }
    if (schema === String) {
        if (typeof value !== "string") {
            throw new Error();
        }
        return;
    }
    if (schema instanceof Array) {
        if (value instanceof Array) {
            for (const itemSchema of schema) {
                for (const itemValue of value) {
                    if (!checkSchema(itemSchema, itemValue)) {
                        throw new Error();
                    }
                }
            }
            return;
        }
        throw new Error();
    }
    if (value instanceof Object) {
        for (const key in schema) {
            if (!checkSchema(schema[key], value[key])) {
                throw new Error();
            }
        }
        return;
    }
    throw new Error();
}
/*
const Transform = Component({
    x: Number,
    y: Number.
});


const PlayerControl = Behaviour({

    dependencies: [Transform],

    update() {
        const t: ComponentToType<Transform> = { x: 0, y: 0 };
        ...
    }

});

*/
//# sourceMappingURL=schema.js.map