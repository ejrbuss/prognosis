import { Signals } from "./signal.js";
export const Entities = {};
export class Entity {
    components;
    children;
    constructor(name) {
        this.components = new Map();
        this.children = [];
        if (name) {
            Entities[name] = this;
        }
    }
    copy() {
        const clone = new Entity();
        this.components.forEach((component, componentClass) => {
            clone.addComponent(Object.assign(new componentClass(), component));
        });
        this.children.forEach((child) => {
            clone.children.push(child.copy());
        });
        return clone;
    }
    createChild(prototype) {
        const child = prototype.copy();
        this.children.push(child);
        child.broadcast(Signals.Create);
        return child;
    }
    destoryChild(child) {
        const index = this.children.indexOf(child);
        if (index === -1) {
            throw new Error("Cannot destroy non child entity!");
        }
        child.broadcast(Signals.Destroy);
        this.children.splice(index, 1);
    }
    destroyChildren() {
        this.children.forEach((child) => child.broadcast(Signals.Destroy));
        this.children = [];
    }
    hasComponent(componentClass) {
        return this.components.has(componentClass);
    }
    getComponent(componentClass) {
        const component = this.components.get(componentClass);
        if (!component) {
            const name = componentClass.name;
            throw new Error(`Entity does not have component: ${name}!`);
        }
        return component;
    }
    tryToGetComponent(componentClass) {
        return this.components.get(componentClass);
    }
    addComponent(component) {
        component.entity = this;
        const componentClass = component.constructor;
        if (this.components.has(componentClass)) {
            const name = componentClass.name;
            throw new Error(`Cannot add duplicate component to entity: ${name}!`);
        }
        this.components.set(componentClass, component);
    }
    send(signal, ...args) {
        this.components.forEach((component) => {
            const handler = component[signal.handlerMethodName];
            if (handler) {
                handler(...args);
            }
        });
    }
    broadcast(signal, ...args) {
        this.send(signal, ...args);
        this.children.forEach((child) => child.broadcast(signal, ...args));
    }
}
//# sourceMappingURL=entity.js.map