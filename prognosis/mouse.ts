import { Graphics } from "./graphics.js";
import { Runtime } from "./runtime.js";

const MouseClass = class Mouse {
	events: MouseEvent[] = [];
	isDown: boolean = false;
	x: number = 0;
	y: number = 0;
	dx: number = 0;
	dy: number = 0;

	start() {
		const pushEvent = (event: MouseEvent) => this.events.push(event);
		Graphics.canvas.addEventListener("mousemove", pushEvent);
		Graphics.canvas.addEventListener("mousedown", pushEvent);
		Graphics.canvas.addEventListener("mouseup", pushEvent);
	}

	update() {
		let newX = this.x;
		let newY = this.y;
		for (const event of this.events) {
			switch (event.type) {
				case "mousemove":
					newX = event.clientX;
					newY = event.clientY;
					break;
				case "mousedown":
					this.isDown = true;
					break;
				case "mouseup":
					this.isDown = false;
					break;
			}
		}
		this.events = [];
		this.dx = newX - this.x;
		this.dy = newY - this.y;
		this.x = newX;
		this.y = newY;
	}
};

export const Mouse = new MouseClass();
