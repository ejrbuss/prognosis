export const Signals: Record<string, Signal> = {};

export class Signal {
	handlerMethodName: string;

	constructor(public name: string) {
		this.handlerMethodName = `on${name}`;
		Signals[name] = this;
	}
}

new Signal("Create");
new Signal("Destroy");
new Signal("Update");
new Signal("Render");
new Signal("SceneStart");
new Signal("ScenePause");
new Signal("SceneResume");
new Signal("SceneStop");
