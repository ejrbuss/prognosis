import { Color } from "./color.js";
import { Graphics } from "./graphics.js";
import { Keyboard } from "./keyboard.js";
import { Mouse } from "./mouse.js";
import { Observable } from "./observable.js";
import { Scene } from "./scene.js";
import { Time } from "./time.js";
import { Tween } from "./tween.js";
const RuntimeClass = class Runtime {
    running = true;
    currentScene = new Scene();
    sceneTransition;
    updateEvents = new Observable();
    renderEvents = new Observable();
    start() {
        this.scheduleNextUpdate();
    }
    update() {
        // Update
        Time.update();
        Mouse.update();
        Keyboard.update();
        this.updateEvents.update();
        // Render
        Graphics.clear();
        this.renderEvents.update();
        if (!this.sceneTransition && Keyboard.Space) {
            this.sceneTransition = new Tween({
                duration: 2,
                step: (t) => {
                    Graphics.context.fillStyle = new Color(1 - t).rgba();
                    Graphics.context.fillRect(0, 0, Graphics.canvas.width, Graphics.canvas.height);
                },
                onEnd: () => {
                    this.sceneTransition = undefined;
                },
            });
        }
        // Loop
        this.scheduleNextUpdate();
    }
    scheduleNextUpdate() {
        if (this.running) {
            requestAnimationFrame(this.update.bind(this));
        }
    }
};
export const Runtime = new RuntimeClass();
//# sourceMappingURL=runtime.js.map