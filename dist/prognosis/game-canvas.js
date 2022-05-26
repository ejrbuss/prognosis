import { ProjectConfig } from "./project-config.js";
export const Graphics = new (class Graphics {
    canvas;
    context;
    constructor() {
        ProjectConfig.subscribe(this.onProjectConfigChange.bind(this));
        window.addEventListener("resize", this.resize.bind(this));
        this.canvas = document.getElementById("main-canvas");
        const maybeContext = this.canvas.getContext("2d");
        if (!maybeContext) {
            throw new Error("Failed to created CanvasRenderingContext2D for canvas!");
        }
        this.context = maybeContext;
    }
    onProjectConfigChange(projectConfig) {
        this.canvas.width = projectConfig.gameCanvas.width;
        this.canvas.height = projectConfig.gameCanvas.height;
        this.canvas.style.imageRendering = projectConfig.gameCanvas.antiAliasing
            ? "auto"
            : "pixelated";
        this.resize();
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
})();
//# sourceMappingURL=game-canvas.js.map