import { assertSchema, SchemaType } from "./schema.js";
import { Observable } from "./observable.js";

const ProjectSchema = {
	title: String,
	gameCanvas: {
		width: Number,
		height: Number,
		antiAliasing: Boolean,
	},
};

const ProjectClass = class Project extends Observable<
	SchemaType<typeof ProjectSchema>
> {
	async reload() {
		const project = await (await fetch("/project.json")).json();
		assertSchema(ProjectSchema, project);
		this.update(project);
	}
};

export const Project = new ProjectClass();
