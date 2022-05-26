import { conformsToSchema } from "./schema.js";
import { Observable } from "./observable.js";
const ProjectConfigSchema = {
    title: String,
    gameCanvas: {
        width: Number,
        height: Number,
        antiAliasing: Boolean,
    },
};
export const ProjectConfig = new (class extends Observable {
    async reload() {
        const project = await (await fetch("/project.json")).json();
        if (conformsToSchema(ProjectConfigSchema, project)) {
            this.update(project);
        }
    }
})();
//# sourceMappingURL=project-config.js.map