import { ClassUtil } from "./data/ClassUtil.js";
import { GameObject } from "./GameObjects.js";
import { Scene } from "./Scenes.js";
import { Any, Types } from "./Types.js";

class EventDetails {
	/** @type {GameObject | undefined} */ target = Any;
	/** @type {{ event: string }} */ properties = { event: String };
	/** @type {function} */ resolve = Function;

	/**
	 *
	 * @param {EventDetails} values
	 * @param {boolean} checked
	 */
	constructor(values, checked = true) {
		ClassUtil.dataClassConstructor(this, values, checked);
	}
}

export const Events = {};

Events.SceneStart = "SceneStart";
Events.SceneEnd = "SceneEnd";
Events.Create = "Create";
Events.Destroy = "Destroy";
Events.Update = "Update";
Events.Render = "Render";

export const EventQueue = {};

/**
 *
 * @param {Array} queue
 * @param {string} event
 * @param {Object} properties
 * @param {GameObject} target
 */
EventQueue.trigger = async function (queue, event, properties, target) {
	Types.check(Array, queue);
	Types.check(String, event);
	Types.check(Object, properties);
	if (target) {
		Types.check(GameObject, target);
	}
	return new Promise((resolve) =>
		queue.push(
			new EventDetails({
				target,
				properties: { event, ...properties },
				resolve,
			})
		)
	);
};

/**
 *
 * @param {EventDetails[]} queue
 * @param {Scene} scene
 */
EventQueue.process = function (queue, scene) {
	Types.check([EventDetails], queue);
	Types.check(Scene, scene);
	while (queue.length > 0) {
		let { target, resolve, properties } = queue.pop();
		let promises = [];
		if (target) {
			dispatchToTarget(target, properties, promises);
		} else {
			for (const layer of scene.layers) {
				dispatchToAll(layer.gameObjects, properties, promises);
			}
		}
		Promise.all(promises).then(resolve);
	}
};

/**
 *
 * @param {GameObject} target
 * @param {Object} properties
 * @param {Array} promises
 */
function dispatchToTarget(target, properties, promises) {
	for (let behaviour of target.behaviours) {
		let eventHandler = behaviour.eventHandlers[properties.event];
		if (eventHandler) {
			promises.push(eventHandler(properties, target));
		}
	}
	dispatchToAll(target.children, properties, promises);
}

/**
 *
 * @param {GameObject[]} targets
 * @param {Object} properties
 * @param {Array} promises
 */
function dispatchToAll(targets, properties, promises) {
	for (let target of targets) {
		dispatchToTarget(target, properties, promises);
	}
}
