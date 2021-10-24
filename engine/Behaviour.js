import { ClassUtil } from "./data/ClassUtil.js";
import { Types } from "./Types.js";
import { Util } from "./Util.js";

/** @type {{ [name: String]: Behaviour }} */
export const Behaviours = {};

export class Behaviour {
	/** @type {String} */ name = String;
	/** @type {Object} */ properties = Object;
	/** @type {{ [name: String]: function}} */ eventHandlers = {
		[String]: Function,
	};

	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
		ClassUtil.defineNamedInstance(this, Behaviours);
	}
}

/**
 *
 * @param {any} json
 * @returns {Behaviour}
 */
Behaviour.load = async function (json) {
	Types.check(String, json);
	let name = Util.basename(json, ".js");
	let script = await Util.importFromRoot(json);
	let properties = script.Properties;
	let eventHandlers = {};
	for (let exportedName in script) {
		if (exportedName.startsWith("on")) {
			let event = exportedName.substring(2);
			let eventHandler = script[exportedName];
			eventHandlers[event] = eventHandler;
		}
	}
	return new Behaviour({ name, properties, eventHandlers });
};
