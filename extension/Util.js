function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.substring(1);
}

function valueAtObjectPath(objectPath, object) {
	for (const key of objectPath) {
		object = object[key];
	}
	return object;
}

module.exports = {
	capitalize,
	valueAtObjectPath,
};