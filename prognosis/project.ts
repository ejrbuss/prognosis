import { Schema } from "./data/schema.js";

const ProjectSchema = Schema.object({
	title: Schema.string,
	root: Schema.string,
	graphics: Schema.object({
		width: Schema.number,
		height: Schema.number,
		antiAliasing: Schema.boolean,
	}),
});

const projectJson = await (await fetch("/project.json")).json();
export const Project = ProjectSchema.assert(projectJson);
if (document.title === undefined) {
	document.title = Project.title;
}
