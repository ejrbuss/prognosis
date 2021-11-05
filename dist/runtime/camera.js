import { Vector } from "./vector.js";
import { Task } from "./task.js";
import { Runtime } from "./runtime.js";
import { lerp, random } from "../common/common.js";
export class Camera {
    position;
    scale;
    rotation;
    constructor(position = new Vector(0), scale = new Vector(1), rotation = 0) {
        this.position = position;
        this.scale = scale;
        this.rotation = rotation;
    }
    panTo(destination, durationMs, easing) {
        const initial = this.position;
        const task = new Task(() => {
            if (task.elapsedMs >= durationMs) {
                this.position = destination;
                task.done = true;
            }
            else {
                this.position = Vector.lerp(initial, destination, easing(task.elapsedMs / durationMs));
            }
        });
        Runtime.schedule(task);
        return task;
    }
    scaleTo(scale, durationMs, easing) {
        const initial = this.scale;
        const task = new Task(() => {
            if (task.elapsedMs >= durationMs) {
                this.scale = scale;
                task.done = true;
            }
            else {
                this.scale = Vector.lerp(initial, scale, easing(task.elapsedMs / durationMs));
            }
        });
        Runtime.schedule(task);
        return task;
    }
    rotateTo(rotation, durationMs, easing) {
        const initial = this.rotation;
        const task = new Task(() => {
            if (task.elapsedMs >= durationMs) {
                this.rotation = rotation;
                task.done = true;
            }
            else {
                this.rotation = lerp(initial, rotation, easing(task.elapsedMs / durationMs));
            }
        });
        Runtime.schedule(task);
        return task;
    }
    shake(intensity, durationMs) {
        const initial = this.position;
        const task = new Task(() => {
            if (task.elapsedMs >= durationMs) {
                this.position = initial;
                task.done = true;
            }
            else {
                this.position = Vector.add(initial, new Vector((random() - 0.5) * intensity.x * this.scale.x, (random() - 0.5) * intensity.y * this.scale.y));
            }
        });
        Runtime.schedule(task);
        return task;
    }
}
//# sourceMappingURL=camera.js.map