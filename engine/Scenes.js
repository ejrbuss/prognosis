import { Events } from "./Events.js";
import { Layers } from "./Layers.js";
import { Loader } from "./Loader.js";
import { Types } from "./Types.js";
import { Util } from "./Util.js";

const All = new Set();

const JsonType = {
	name: Types.String,
	camera: Types.Transform,
	layers: [Types.String],
};

const DefType = {
	name: Types.String,
	camera: Types.Transform,
	layers: [Types.Layer],
};

const create = (sceneDef) => {
	Types.check(DefType, sceneDef);
	All.add(sceneDef);
	return sceneDef;
};

const changeTo = async (nextScene) => {
	await Events.cause(Events.SceneEnd, {
		currentScene: Scenes.currentScene,
		nextScene,
	});
	const previousScene = Scenes.currentScene;
	Scenes.currentScene = nextScene;
	await Events.cause(Events.SceneStart, {
		currentScene: Scenes.currentScene,
		previousScene,
	});
};

export const Scenes = {
	currentScene: undefined,
	All,
	create,
	changeTo,
};

Types.define(Types.Scene, (v) => All.has(v));

Loader.define(Types.Scene, (json) => {
	Types.check(JsonType, json);
	const { name } = json;
	if (name in Scenes) {
		throw new Error(`Duplicate scene name: ${name}!`);
	}
	const sceneDef = { ...json };
	const layers = [];
	for (const name of json.layers) {
		const layer = Layers[name];
		if (!layer) {
			throw new Error(`Unknown layer: ${name}!`);
		}
		layers.push(layer);
	}
	sceneDef.layers = layers;
	const scene = Scenes.create(sceneDef);
	Scenes[name] = scene;
	return scene;
});
