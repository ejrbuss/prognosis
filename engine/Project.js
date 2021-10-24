import { Graphics } from "./Graphics.js";
import { Loader } from "./Loader.js";
import { Scenes } from "./Scenes.js";
import { Types } from "./Types.js";
import { Util } from "./Util.js";

export const Project = {};

/** @type {string} */
Project.author = null;
/** @type {string} */
Project.title = null;

let projectJson;

const BuiltinBehaviours = [
	"engine/behaviours/DrawImage.js",
	"engine/behaviours/DrawRectangle.js",
];

const ProjectType = {
	project: {
		author: Types.String,
		title: Types.String,
		initialScene: Types.String,
	},
	graphics: {
		width: Types.Number,
		height: Types.Number,
		antiAlias: Types.Boolean,
	},
	scenes: [
		{
			name: Types.String,
			camera: Types.Transform,
			layers: [Types.String],
		},
	],
	layers: [
		{
			name: Types.String,
			inWorldSpace: Types.Boolean,
			gameObjects: [Types.String],
		},
	],
	gameObjects: [
		{
			name: Types.String,
			visible: Types.Boolean,
			position: Types.Point3D,
			rotation: Types.Number,
			scale: Types.Point2D,
			tags: [Types.String],
			children: [Types.String],
			behaviours: [Types.String],
		},
	],
	events: [Types.String],
	behaviours: [Types.String],
	tests: [Types.String],
};

const _initialize = async () => {
	let phase;
	try {
		phase = "fetch prognosis.json";
		projectJson = await Util.fetchJson("/prognosis.json");
		phase = "type check prognosis.json";
		Types.check(ProjectType, projectJson);
		Project.title = projectJson.project.title;
		Graphics.width = projectJson.graphics.width;
		Graphics.height = projectJson.graphics.height;
		Graphics.antiAlias = projectJson.graphics.antiAlias;
	} catch (cause) {
		throw Util.errorWithCause(`Failed to ${phase}!`, cause);
	}
};

const _load = async () => {
	try {
		await Loader.loadAll(Types.Test, projectJson.tests);
		await Loader.loadAll(Types.Event, projectJson.events);
		await Loader.loadAll(Types.Behaviour, [
			...BuiltinBehaviours,
			...projectJson.behaviours,
		]);
		await Loader.loadAll(Types.GameObject, projectJson.gameObjects);
		await Loader.loadAll(Types.Layer, projectJson.layers);
		await Loader.loadAll(Types.Scene, projectJson.scenes);
		// I hate this
		Project.initialScene = Scenes[projectJson.project.initialScene];
	} catch (cause) {
		throw Util.errorWithCause(`Faild to load project!`, cause);
	}
};

export const Project = {
	title: undefined,
	initialScene: undefined,
	_initialize,
	_load,
};
