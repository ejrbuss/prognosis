import { assertSchema, SchemaType } from "./schema.js";
import { Observable } from "./observable.js";

const ConfigSchema = {
	title: String,
	gameCanvas: {
		width: Number,
		height: Number,
		antiAliasing: Boolean,
	},
} as const;

export type Config = SchemaType<typeof ConfigSchema>;

const ProjectClass = class Project {
	configUpdates: Observable<Config> = new Observable();

	get config(): Config {
		return this.configUpdates.value as any;
	}

	async reload() {
		const config = await (await fetch("/prognosis.json")).json();
		assertSchema(ConfigSchema, config);
		this.configUpdates.update(config);
	}
};

export const Project = new ProjectClass();
