import { Schema, SchemaType } from "./schema.js";

const ComponentSchema = Schema.object({
	name: Schema.string,
});

const EntitySchema = Schema.object({
	name: Schema.string,
	parent: Schema.optional(Schema.string),
	components: Schema.array(ComponentSchema),
});

const ProjectSchema = Schema.object({
	title: Schema.string,
	graphics: Schema.object({
		width: Schema.number,
		height: Schema.number,
		antiAliasing: Schema.boolean,
	}),
	root: Schema.string,
	entities: Schema.array(EntitySchema),
});

export type Project = SchemaType<typeof ProjectSchema>;

const projectJson = await (await fetch("/project.json")).json();
export const Project = ProjectSchema.assert(projectJson);
if (document.title === undefined) {
	document.title = Project.title;
}
