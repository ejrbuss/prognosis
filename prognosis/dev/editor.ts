// import { Entity } from "../core.js";
// import { Runtime } from "../runtime.js";
// import { Store } from "../store.js";
// import { EditorConsole } from "./editor-console.js";
// import { EditorExplorer } from "./editor-explorer.js";
// import { EditorInspector } from "./editor-inspector.js";

// const MinSize = 200;

// type EditorState = {
// 	inspectorWidth: number;
// 	explorerWidth: number;
// 	consoleHeight: number;
// };

// class Editor {
// 	inspecting?: Entity;
// 	editorStore: Store<EditorState>;

// 	$editorGrid = document.getElementById("editor-grid") as HTMLElement;
// 	$preview = document.getElementById("preview") as HTMLElement;
// 	$inspector = document.getElementById("inspector") as HTMLElement;
// 	$inspectorGutter = document.getElementById("inspector-gutter") as HTMLElement;
// 	$explorer = document.getElementById("explorer") as HTMLElement;
// 	$explorerGutter = document.getElementById("explorer-gutter") as HTMLElement;
// 	$console = document.getElementById("console") as HTMLElement;
// 	$consoleGutter = document.getElementById("console-gutter") as HTMLElement;

// 	editorInspector = new EditorInspector();
// 	editorExplorer = new EditorExplorer();
// 	editorConsole = new EditorConsole();

// 	constructor() {
// 		this.editorStore = new Store("prognosis.editor", {
// 			inspectorWidth: this.$inspector.clientWidth,
// 			explorerWidth: this.$explorer.clientWidth,
// 			consoleHeight: this.$console.clientHeight,
// 		});
// 		this.editorStore.subscribe(this.resize.bind(this));
// 		const resizeObserver = new ResizeObserver(this.resize.bind(this));
// 		resizeObserver.observe(this.$editorGrid);

// 		// Trigger subscribers
// 		this.editorStore.update();

// 		// Setup Gutter Controls
// 		this.setupGutter(this.$inspectorGutter, "col-resize", (dx) =>
// 			this.editorStore.map((state) => ({
// 				...state,
// 				inspectorWidth: state.inspectorWidth - dx,
// 			}))
// 		);
// 		this.setupGutter(this.$explorerGutter, "col-resize", (dx) => {
// 			this.editorStore.map((state) => ({
// 				...state,
// 				explorerWidth: state.explorerWidth - dx,
// 			}));
// 		});
// 		this.setupGutter(this.$consoleGutter, "row-resize", (_dx, dy) => {
// 			this.editorStore.map((state) => ({
// 				...state,
// 				consoleHeight: state.consoleHeight - dy,
// 			}));
// 		});

// 		Runtime.rootUpdates.subscribe(this.update.bind(this));
// 	}

// 	get state(): EditorState {
// 		return this.editorStore.value;
// 	}

// 	set state(state: EditorState) {
// 		this.editorStore.value = state;
// 	}

// 	setupGutter(
// 		gutter: HTMLElement,
// 		cursor: string,
// 		resize: (dx: number, dy: number) => void
// 	) {
// 		let gutterSelected = false;
// 		gutter.addEventListener("mousedown", () => {
// 			gutterSelected = true;
// 			this.$editorGrid.style.cursor = cursor;
// 		});
// 		window.addEventListener("mouseup", () => {
// 			gutterSelected = false;
// 			this.$editorGrid.style.cursor = "";
// 		});
// 		window.addEventListener("mousemove", (event) => {
// 			if (gutterSelected) {
// 				if (event.buttons === 0) {
// 					gutterSelected = false;
// 					this.$editorGrid.style.cursor = "";
// 				} else {
// 					resize(event.movementX, event.movementY);
// 				}
// 			}
// 		});
// 	}

// 	resize() {
// 		const maxWidth = window.innerWidth;
// 		const maxHeight = window.innerHeight;
// 		let inspectorWidth = Math.max(MinSize, this.state.inspectorWidth);
// 		let explorerWidth = Math.max(MinSize, this.state.explorerWidth);
// 		let consoleHeight = Math.max(MinSize, this.state.consoleHeight);
// 		let previewWidth = Math.max(
// 			MinSize,
// 			maxWidth - inspectorWidth - explorerWidth - 10
// 		);
// 		const totalDesiredWidth = inspectorWidth + explorerWidth;
// 		inspectorWidth = Math.max(
// 			MinSize,
// 			((maxWidth - previewWidth) * inspectorWidth) / totalDesiredWidth
// 		);
// 		explorerWidth = Math.max(
// 			MinSize,
// 			((maxWidth - previewWidth) * explorerWidth) / totalDesiredWidth
// 		);
// 		let previewHeight = Math.max(MinSize, maxHeight - consoleHeight - 69);
// 		consoleHeight = Math.max(MinSize, maxHeight - previewHeight - 69);
// 		const templateCols = `${previewWidth}px 5px ${inspectorWidth}px 5px ${explorerWidth}px`;
// 		const templateRows = `64px ${previewHeight}px 5px ${consoleHeight}px`;
// 		this.$editorGrid.style.gridTemplateColumns = templateCols;
// 		this.$editorGrid.style.gridTemplateRows = templateRows;
// 	}

// 	update() {
// 		this.editorExplorer.update({ root: Runtime.root });
// 	}
// }

// new Editor();
