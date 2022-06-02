export function inspect(object: any, maxDepth: number = 3): string {
	if (typeof object === "undefined") {
		return "undefined";
	}
	if (typeof object === "function") {
		return `f ${object.name} { ... }`;
	}
	if (typeof object !== "object" || object === null) {
		console.error(object, JSON.stringify(object));
		return JSON.stringify(object);
	}
	if (object instanceof Error) {
		return object.stack ?? object.message;
	}
	if (object instanceof Array) {
		return `(${object.length}) [${object
			.map((item) => inspect(item, maxDepth - 1))
			.join(", ")}]`;
	}
	const constructorName =
		object.constructor.name === "Object" ? "" : object.constructor.name + " ";
	const objectKeys: string[] = Object.keys(object);
	if (objectKeys.length === 0) {
		return `${constructorName}{}`;
	}
	if (objectKeys.length > 12 || maxDepth <= 0) {
		return `${constructorName}{ ... }`;
	}
	const objectParts: string[] = [];
	objectParts.push(constructorName);
	objectParts.push("{");
	for (const property of objectKeys) {
		objectParts.push("\n  ");
		objectParts.push(property);
		objectParts.push(": ");
		objectParts.push(
			inspect(object[property], maxDepth - 1).replace(/\n/g, "\n  ")
		);
		objectParts.push(",");
	}
	objectParts.push("\n}");
	return objectParts.join("");
}
