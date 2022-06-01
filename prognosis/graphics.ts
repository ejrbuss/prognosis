import { Project } from "./project.js";

const GraphicsClass = class Graphics {
	canvas: HTMLCanvasElement;
	context: CanvasRenderingContext2D;

	constructor() {
		window.addEventListener("resize", this.resize.bind(this));
		this.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
		const context = this.canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to created CanvasRenderingContext2D for canvas!");
		}
		this.context = context;

		Project.configUpdates.subscribe((config) => {
			context.translate(
				config.gameCanvas.width / 2,
				config.gameCanvas.height / 2
			);
			this.canvas.width = config.gameCanvas.width;
			this.canvas.height = config.gameCanvas.height;
			this.context.imageSmoothingEnabled = config.gameCanvas.antiAliasing;
			this.canvas.style.imageRendering = config.gameCanvas.antiAliasing
				? "auto"
				: "pixelated";
			this.resize();
		});
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	resize() {
		let scaledWidth =
			(window.innerHeight / this.canvas.height) * this.canvas.width;
		let scaledHeight = window.innerHeight;
		if (scaledWidth > window.innerWidth) {
			scaledHeight =
				(window.innerWidth / this.canvas.width) * this.canvas.height;
			scaledWidth = window.innerWidth;
		}
		this.canvas.style.width = scaledWidth + "px";
		this.canvas.style.height = scaledHeight + "px";
	}
};

export const Graphics = new GraphicsClass();
