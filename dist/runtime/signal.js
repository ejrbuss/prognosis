export const Signals = {};
export class Signal {
    name;
    handlerMethodName;
    constructor(name) {
        this.name = name;
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
//# sourceMappingURL=signal.js.map