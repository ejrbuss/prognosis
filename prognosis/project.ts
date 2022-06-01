import { Schema, SchemaType } from "./schema.js";
import { Observable } from "./observable.js";
import { Scene, Scenes } from "./scene.js";
import { Entity } from "./core.js";

const SceneSchema = Schema.object({
	name: Schema.string,
});

const ComponentSchema = Schema.object({
	name: Schema.string,
});

const EntitySchema = Schema.object({
	name: Schema.string,
	scene: Schema.string,
	components: Schema.array(ComponentSchema),
});

const ConfigSchema = Schema.object({
	title: Schema.string,
	startScene: Schema.string,
	gameCanvas: Schema.object({
		width: Schema.number,
		height: Schema.number,
		antiAliasing: Schema.boolean,
	}),
	scenes: Schema.array(SceneSchema),
	entities: Schema.array(EntitySchema),
});

export type Config = SchemaType<typeof ConfigSchema>;

const ProjectClass = class Project {
	configUpdates: Observable<Config> = new Observable();

	get config(): Config {
		return this.configUpdates.value;
	}

	async reload() {
		const configJson = await (await fetch("/prognosis.json")).json();
		const config = ConfigSchema.assert(configJson);
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
