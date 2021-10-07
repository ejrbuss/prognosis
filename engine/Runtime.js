import { Graphics } from "./Graphics.js";
import { Project } from "./Project.js";
import { Util } from "./Util.js";
import { Scenes } from "./Scenes.js";
import { Input } from "./Input.js";
import { Events } from "./Events.js";
import { Behaviours } from "./Behaviours.js";
import { GameObjects } from "./GameObjects.js";
import { Layers } from "./Layers.js";
import { Physics } from "./Physics.js";
import { Sounds } from "./Sounds.js";
import { Tweens } from "./Tweens.js";
import { Types } from "./Types.js";
import { Tests } from "./Tests.js";
import { Images } from "./Images.js";

const showBrowserError = (error) => {
	const stackTrace = error.stack.replace(
		/\(http:\/\/localhost:\d+\/(.*js:\d+:\d+)\)/g,
		`(<a href="vscode://file/${Runtime.cwd}/$1">$1</a>)`
	);
	const errorDiv = document.getElementById("error");
	errorDiv.innerHTML = `
		<h1>Error</h1>
		<pre><code>${stackTrace}</code></pre>
	`;
	errorDiv.style.visibility = "visible";
	const gameCanvas = document.getElementById("game-canvas");
	gameCanvas.hidden = true;
};

const nodeMain = async () => {
	Runtime.debugMode = true;
	Runtime.cwd = process.cwd();
	await Project._initialize();
	await Tests.run();
};

const browserMain = async () => {
	try {
		await fetch("/debug/api/test");
		Runtime.debugMode = true;
		Runtime.cwd = await Util.fetchText("/debug/api/cwd");
		window.Prognosis = {
			Behaviours,
			Events,
			GameObjects,
			Graphics,
			Input,
			Layers,
			Physics,
			Project,
			Runtime,
			Scenes,
			Sounds,
			Tests,
			Tweens,
			Types,
		};
	} catch (error) {
		console.log(error);
		Runtime.releaseMode = true;
	}
	try {
		await Input._initialize();
		await Project._initialize();
		await Graphics._initialize();
		await Images._initialize();
		await Project._load();
		document.title = Project.title;
		Scenes.currentScene = Project.initialScene;
		Runtime.now = Date.now();
		gameLoop();
	} catch (error) {
		console.error(error);
		if (Runtime.debugMode) {
			showBrowserError(error);
		}
	}
};

const gameLoop = () => {
	const scene = Scenes.currentScene;
	const newNow = Date.now();
	const delta = newNow - Runtime.now;
	Runtime.now = newNow;
	const input = Input.currentInput;
	Events._processEventQueue();
	// TODO should probably be a custom loop ala render, so that
	// gameobjects not in the current scene are not updated
	Events.cause(Events.Update, { delta, input });
	// Physics._simulate(scene);
	Graphics._render(scene);
	requestAnimationFrame(gameLoop);
};

export const Runtime = {
	browser: undefined,
	node: undefined,
	releaseMode: undefined,
	debugMode: undefined,
	cwd: undefined,
	now: undefined,
};

if (typeof process !== "undefined") {
	Runtime.node = true;
	nodeMain();
} else {
	Runtime.browser = true;
	window.onload = browserMain;
}
