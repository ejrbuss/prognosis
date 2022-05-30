import { assertSchema, SchemaType } from "./schema.js";
import { Observable } from "./observable.js";
import { Scene, Scenes } from "./scene.js";
import { Component, Entity } from "./core.js";

const SceneSchema = {
	name: String,
};

const ComponentSchema = {
	name: String,
};

const EntitySchema = {
	name: String,
	scene: String,
	components: [ComponentSchema],
};

const ConfigSchema = {
	title: String,
	startScene: String,
	gameCanvas: {
		width: Number,
		height: Number,
		antiAliasing: Boolean,
	},
	scenes: [SceneSchema],
	entities: [EntitySchema],
};

export type Config = SchemaType<typeof ConfigSchema>;

const ProjectClass = class Project {
	configUpdates: Observable<Config> = new Observable();

	get config(): Config {
		return this.configUpdates.value;
	}

	async reload() {
		const config = await (await fetch("/prognosis.json")).json();
		assertSchema(ConfigSchema, config);
		this.configUpdates.update(config);
		this.reloadScenes();
		this.reloadEntities();
	}

	reloadScenes() {
		for (const scene of this.config.scenes) {
			new Scene(scene.name);
		}
		const startScene = Scenes[this.config.startScene];
		if (startScene === undefined) {
			throw new Error(
				`Starting scene "${this.config.startScene}" is not defined in prognosis.json!`
			);
		}
		// DEBUG
		class TestComponent extends Component {
			updated = false;
			start() {
				console.log("Test component started!");
			}
			update(entity: Entity) {
				if (!this.updated) {
					this.updated = true;
					console.log("Test component updated!", entity);
				}
			}
		}
		const e = new Entity("Test");
		e.add(new TestComponent());
		startScene.spawn(e);
	}

	reloadEntities() {
		for (const entity of this.config.entities) {
			const scene = Scenes[entity.scene];
			if (scene === undefined) {
				throw new Error(
					`Entity "${entity.name}" scene "${entity.scene}" is not defined in prognosis.json`
				);
			}
			scene.spawn(new Entity(entity.name));
		}
	}
};

export const Project = new ProjectClass();
