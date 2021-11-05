import { Signals } from "./signal.js";
export const Layers = {};
export class Layer {
    name;
    inWorldSpace = true;
    children = [];
    constructor(name) {
        this.name = name;
        Layers[name] = this;
    }
    createChild(prototype) {
        const child = prototype.copy();
        this.children.push(child);
        child.broadcast(Signals.Create);
        return child;
    }
    destroyChild(child) {
        const index = this.children.indexOf(child);
        if (index === -1) {
            throw new Error("Cannot destroy non child entity!");
        }
        child.broadcast(Signals.Destroy);
        this.children.splice(index, 1);
    }
    destroyChildren() {
        this.broadcast(Signals.Destroy);
        this.children = [];
    }
    find(...componentClasses) {
        const filtered = [];
        function findDeep(entity) {
            if (componentClasses.every((componentClass) => entity.hasComponent(componentClass))) {
                filtered.push(entity);
            }
            entity.children.forEach(findDeep);
        }
        this.children.forEach(findDeep);
        return filtered;
    }
    async broadcast(signal, ...args) {
        await Promise.all(this.children.map((entity) => entity.broadcast(signal, ...args)));
    }
}
//# sourceMappingURL=layer.js.map