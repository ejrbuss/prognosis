import { GameObjects } from "./GameObjects.js";
import { Loader } from "./Loader.js";
import { Types } from "./Types.js";

const All = new Set();

const JsonType = {
	name: String,
	inWorldSpace: Boolean,
	gameObjects: [Types.String],
};

const DefType = {
	name: String,
	inWorldSpace: Boolean,
	gameObjects: [Types.GameObject],
};

const create = (layerDef) => {
	Types.check(DefType, layerDef);
	All.add(layerDef);
	return layerDef;
};

export const Layers = {
	All,
	create,
};

Types.define(Types.Layer, (v) => All.has(v));

Loader.define(Types.Layer, (json) => {
	Types.check(JsonType, json);
	const { name } = json;
	if (name in Layers) {
		throw new Error(`Duplicate layer name: ${name}!`);
	}
	const layerDef = { ...json };
	const gameObjects = [];
	for (const name of json.gameObjects) {
		const gameObject = GameObjects[name];
		if (!gameObject) {
			throw new Error(`Unknown gameObject: ${name}!`);
		}
		gameObjects.push(gameObject);
	}
	layerDef.gameObjects = gameObjects;
	const layer = create(layerDef);
	Layers[name] = layer;
	return layer;
});
