import { Project } from "./project.js";
import { Runtime } from "./runtime.js";
import "./tween.js";

await Project.reload();
Runtime.start();
