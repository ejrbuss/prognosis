import { Schema } from "./data/schema.js";
import { Node } from "./nodes/node.js";

const ProjectSchema = Schema.object({
	title: Schema.string,
	initialScene: Schema.string,
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
