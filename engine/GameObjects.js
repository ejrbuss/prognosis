import { Behaviours } from "./Behaviours.js";
import { Events } from "./Events.js";
import { Loader } from "./Loader.js";
import { Types } from "./Types.js";
import { Util } from "./Util.js";

const All = new Set();

const GameObjectsByTag = {};

const JsonType = {
	name: Types.String,
	visible: Types.Boolean,
	position: Types.Point3D,
	scale: Types.Point2D,
	tags: [Types.String],
	children: [Types.String],
	behaviours: [Types.String],
};

const DefType = {
	visible: Types.Boolean,
	position: Types.Point3D,
	rotation: Types.Number,
	scale: Types.Point2D,
	tags: [Types.String],
	children: [Types.GameObject],
	behaviours: [Types.Behaviour],
};

const create = (gameObjectDef) => {
	Types.check(DefType, gameObjectDef);
	const { tags } = gameObjectDef;
	for (const tag of tags) {
		findByTag(tag).push(gameObjectDef);
	}
	All.add(gameObjectDef);
	Events.cause(Events.Create, {}, gameObjectDef);
	return gameObjectDef;
};

const destroy = async (gameObject) => {
	await Events.cause(Events.Destroy, {}, gameObject);
	const { tags } = gameObject;
	for (const tag of tags) {
		const tagGroup = findByTag(tag);
		tagGroup.splice(tagGroup.indexOf(gameObject), 1);
	}
	All.delete(gameObject);
};

const findByTag = (tag) => {
	return (GameObjectsByTag[tag] = GameObjectsByTag[tag] ?? []);
};

export const GameObjects = {
	All,
	create,
	destroy,
	findByTag,
};

Types.define(Types.GameObject, (v) => All.has(v));

Loader.define(Types.GameObject, async (json) => {
	Types.check(JsonType, json);
	const gameObjectDef = { ...json };
	const { name } = json;
	if (name in GameObjects) {
		throw new Error(`Duplicate GameObject name: ${name}!`);
	}
	const behaviours = [];
	for (const name of json.behaviours) {
		const behaviour = Behaviours[name];
		if (!behaviour) {
			throw new Error(`Unknown behaviour: ${name}!`);
		}
		behaviours.push(behaviour);
	}
	gameObjectDef.behaviours = behaviours;
	for (const { properties } of behaviours) {
		for (const property in properties) {
			try {
				const type = properties[property];
				const value = await Loader.load(type, gameObjectDef[property]);
				gameObjectDef[property] = value;
			} catch (cause) {
				throw Util.errorWithCause(
					`Failed to load property ${property} for gameObject: ${name}!`,
					cause
				);
			}
		}
	}
	const gameObject = GameObjects.create(gameObjectDef);
	GameObjects[name] = gameObject;
	return gameObject;
});
