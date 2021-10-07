import { Loader } from "./Loader.js";
import { Scenes } from "./Scenes.js";
import { Types } from "./Types.js";

const Event = "Event";
const SceneStart = "SceneStart";
const SceneEnd = "SceneEnd";
const Create = "Create";
const Destroy = "Destroy";
const Update = "Update";
const Render = "Render";

const All = new Set([
	Event,
	SceneStart,
	SceneEnd,
	Create,
	Destroy,
	Update,
	Render,
]);

const EventQueue = [];

const create = (event) => {
	Types.check(String, event);
	All.add(event);
	return event;
};

const cause = async (event, properties = {}, target = undefined) => {
	return new Promise((resolve) => {
		EventQueue.push({
			event,
			properties: { event, ...properties },
			target,
			resolve,
		});
	});
};

const _processEventQueue = () => {
	while (EventQueue.length) {
		const { event, properties, target, resolve } = EventQueue.pop();
		const promises = [];
		if (target) {
			promises.push(...dispatchToTarget(event, properties, target));
		} else {
			const { layers } = Scenes.currentScene;
			for (const { gameObjects } of layers) {
				promises.push(...dispatchToAll(event, properties, gameObjects));
			}
		}
		Promise.all(promises).then(resolve);
	}
};

const dispatchToTarget = (event, properties, gameObject) => {
	const promises = [];
	const { children, behaviours } = gameObject;
	for (const { eventHandlers } of behaviours) {
		const eventHandler = eventHandlers[event] ?? eventHandlers.Event;
		if (eventHandler) {
			promises.push(eventHandler(properties, gameObject));
		}
	}
	promises.push(...dispatchToAll(event, properties, children));
	return promises;
};

const dispatchToAll = (event, properties, gameObjects) => {
	const promises = [];
	for (const gameObject of gameObjects) {
		promises.push(...dispatchToTarget(event, properties, gameObject));
	}
	return promises;
};

export const Events = {
	All,
	Event,
	SceneStart,
	SceneEnd,
	Create,
	Destroy,
	Update,
	Render,
	create,
	cause,
	_processEventQueue,
};

Types.define(Types.Event, (v) => All.has(v));

Loader.define(Types.Event, (json) => {
	Types.check(Types.String, json);
	if (json in Events) {
		throw new Error(`Duplicate event: ${json}!`);
	}
	const event = create(json);
	Events[event] = event;
	return event;
});
