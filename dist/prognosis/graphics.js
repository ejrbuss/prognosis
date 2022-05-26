import { Project } from "./project.js";
const GraphicsClass = class Graphics {
    canvas;
    context;
    constructor() {
        window.addEventListener("resize", this.resize.bind(this));
        this.canvas = document.getElementById("main-canvas");
        const context = this.canvas.getContext("2d");
        if (!context) {
            throw new Error("Failed to created CanvasRenderingContext2D for canvas!");
        }
        this.context = context;
        Project.subscribe((project) => {
            this.canvas.width = project.gameCanvas.width;
            this.canvas.height = project.gameCanvas.height;
            this.canvas.style.imageRendering = project.gameCanvas.antiAliasing
                ? "auto"
                : "pixelated";
            this.resize();
        });
    }
    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    resize() {
        let scaledWidth = (window.innerHeight / this.canvas.height) * this.canvas.width;
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
//# sourceMappingURL=graphics.js.map