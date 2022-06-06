export function classNames(
	...classNames: (undefined | string | Record<string, boolean | undefined>)[]
) {
	const processedClassNames = [];
	for (const className of classNames) {
		if (typeof className === "undefined") {
		} else if (typeof className === "string") {
			processedClassNames.push(className);
		} else {
			const classObject = className;
			for (const className in classObject) {
				if (classObject[className]) {
					processedClassNames.push(className);
				}
			}
		}
	}
	return processedClassNames.join(" ");
}
