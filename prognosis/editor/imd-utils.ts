export function classNames(
	...classNames: (undefined | string | Record<string, boolean | undefined>)[]
) {
	const processedClassNames = [];
	for (const className of classNames) {
		switch (typeof className) {
			case "string": {
				processedClassNames.push(className);
				break;
			}
			case "object": {
				const classObject = className;
				for (const className in classObject) {
					if (classObject[className]) {
						processedClassNames.push(className);
					}
				}
				break;
			}
		}
	}
	return processedClassNames.join(" ");
}
