import { Project } from "./project.js";

const GraphicsClass = class Graphics {
	canvas!: HTMLCanvasElement;
	container!: HTMLElement;
	context!: CanvasRenderingContext2D;

	start() {
		this.canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
		this.container = document.getElementById("game-container") as HTMLElement;
		this.container.addEventListener("resize", this.resize.bind(this));
		const resizeObserver = new ResizeObserver(this.resize.bind(this));
		resizeObserver.observe(this.container);
		const context = this.canvas.getContext("2d");
		if (!context) {
			throw new Error("Failed to created CanvasRenderingContext2D for canvas!");
		}
		this.context = context;
		this.canvas.width = Project.graphics.width;
		this.canvas.height = Project.graphics.height;
		this.context.imageSmoothingEnabled = Project.graphics.antiAliasing;
		this.canvas.style.imageRendering = Project.graphics.antiAliasing
			? "auto"
			: "pixelated";
		this.resize();
	}

	resize() {
		const maxWidth = this.container.clientWidth;
		const maxHeight = this.container.clientHeight;
		let scaledWidth = (maxHeight / this.canvas.height) * this.canvas.width;
		let scaledHeight = maxHeight;
		if (scaledWidth > maxWidth) {
			scaledHeight = (maxWidth / this.canvas.width) * this.canvas.height;
			scaledWidth = maxWidth;
		}
		this.canvas.style.width = scaledWidth + "px";
		this.canvas.style.height = scaledHeight + "px";
	}
};

export const Graphics = new GraphicsClass();
