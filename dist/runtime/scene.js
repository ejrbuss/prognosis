export const Scenes = {};
export class Scene {
    name;
    camera;
    children = [];
    constructor(name, camera) {
        this.name = name;
        this.camera = camera;
        Scenes[name] = this;
    }
    find(...componentClasses) {
        return this.children.flatMap((layer) => layer.find(...componentClasses));
    }
    async broadcast(signal, ...args) {
        await Promise.all(this.children.map((layer) => layer.broadcast(signal, ...args)));
    }
}
//# sourceMappingURL=scene.js.map