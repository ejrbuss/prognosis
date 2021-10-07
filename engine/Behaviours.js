import { Loader } from "./Loader.js";
import { Types } from "./Types.js";
import { Util } from "./Util.js";

export const Behaviours = {};

export class Behaviour {
	static load(path) {
		Types.check(String, path);
		const name = Util.basename(path, ".js");
		const script = await Util.importFromRoot(path);
		const properties = script.Properties;
		const eventHandlers = {};
		Types.check(Object, properties);
		for (const exportedName in script) {
			if (exportedName.startsWith("on")) {
				const event = exportedName.substring(2);
				const eventHandler = script[exportedName];
				Types.check(String, event);
				Types.check(Function, eventHandler);
				eventHandlers[event] = eventHandler;
			}
		}
		return new Behaviour({ name, properties, eventHandlers });
	}

	constructor({ name, properties, eventHandlers }) {
		Types.check(String, name);
		Types.check(Object, properties);
		Types.check(Object, eventHandlers);
		if (name in Behaviours) {
			throw new Error(`Duplicate behaviour name: ${name}!`);
		}
		this.name = name;
		this.properties = properties;
		this.eventHandlers = eventHandlers;
		Behaviours[name] = name;
	}
}

const All = new Set();

function create(behaviour) {
	Types.check(
		{
			name: Types.String,
			properties: Types.Object,
			eventHandler: Types.Object,
		},
		behaviour
	);
	const { name } = behaviour;
	if (name in Behaviours) {
		throw new Error(`Duplicate behaviour name: ${name}!`);
	}
	All.add(behaviour);
	return behaviour;
}

async function load(path) {
	Types.check(Types.String, path);
	const name = Util.basename(path, ".js");
	const script = await Util.importFromRoot(path);
	const properties = script.Properties;
	const eventHandlers = {};
	Types.check(Object, properties);
	for (const exportedName in script) {
		if (exportedName.startsWith("on")) {
			const event = exportedName.substring(2);
			const eventHandler = script[exportedName];
			Types.check(Types.Event, event);
			Types.check(Types.Function, eventHandler);
			eventHandlers[event] = eventHandler;
		}
	}
	const behaviour = Behaviours.create({ name, properties, eventHandlers });
	Behaviours[name] = behaviour;
	return behaviour;
}

export const Behaviours = {
	DefType,
	All,
	create,
};

Types.define(Types.Behaviour, (v) => All.has(v));
Loader.define(Types.Behaviour, load);
