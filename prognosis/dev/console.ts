import { inspect } from "./inspect.js";

export class Console {
	$consoleOutput = document.getElementById("console-output") as HTMLElement;
	$consoleInput = document.getElementById("console-input") as HTMLInputElement;

	constructor() {
		const rootConsoleLog = console.log;
		console.log = (...args) => {
			rootConsoleLog(...args);
			const message = args
				.map((arg) => (typeof arg === "string" ? arg : inspect(arg)))
				.join(" ");
			this.$consoleOutput.innerText += message + "\n";
		};
		this.$consoleInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				try {
					console.log(eval(this.$consoleInput.value));
				} catch (error) {
					console.log(error);
				}
				this.$consoleInput.value = "";
			}
		});
	}
}
