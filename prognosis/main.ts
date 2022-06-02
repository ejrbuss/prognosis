import "./math.js";
import { Project } from "./project.js";
import { Runtime } from "./runtime.js";
import { Component, ComponentsConstructors, Entities, Entity } from "./core.js";
import "./keyboard.js";
import "./mouse.js";

// Need a better solution
import "./components/surface.js";

async function importScript(relativePath: string) {
	const dynamicModule = await import(relativePath);
	for (const exportedValue of Object.values(dynamicModule)) {
		if (
			typeof exportedValue === "function" &&
			exportedValue.prototype instanceof Component
		) {
			new (exportedValue as any)();
		}
	}
}

await importScript("./components/surface.js");

for (const entityConfig of Project.entities) {
	const entity = new Entity(entityConfig.name);
	for (const componentConfig of entityConfig.components) {
		const componentConstructor = ComponentsConstructors[componentConfig.name];
		if (componentConstructor === undefined) {
			throw new Error(
				`Entity "${entity.name}" has unknown component "${componentConfig.name}!"`
			);
		}
		entity.addComponent(new componentConstructor());
	}
}

for (const entityConfig of Project.entities) {
	if (entityConfig.parent !== undefined) {
		const entity = Entities[entityConfig.name];
		const parent = Entities[entityConfig.parent];
		if (parent === undefined) {
			throw new Error(
				`Entity "${entity.name}" has unknown parent "${entityConfig.parent}"!`
			);
		}
		// Do not use adopt or add because we are not running yet
		entity.parent = parent;
		parent.children.push(entity);
	}
}

const root = Entities[Project.root];
if (root === undefined) {
	throw new Error(`No Entity "${Project.root}" to use as project root!`);
}

if (document.title === undefined) {
	document.title = Project.title;
}

Runtime.root = root;
Runtime.start();

await import("../project/playground.js");
