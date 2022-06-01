import "./math.js";
import { Project } from "./project.js";
import { Runtime } from "./runtime.js";
import { Scenes } from "./scene.js";
import "./keyboard.js";
import "./mouse.js";

await Project.reload();
Runtime.scene = Scenes[Project.config.startScene];
Runtime.start();

await import("../project/playground.js");
