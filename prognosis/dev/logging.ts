import { inspect } from "util";

const LoggingClass = class Logging {
	private rootConsoleLog: typeof console.log;

	constructor() {
		this.rootConsoleLog = console.log;
		this.format = "{time} - {message}";
	}

	set format(format: string) {
		console.log = (...args) => {
			const message = args
				.map((arg) => (typeof arg === "string" ? arg : inspect(arg)))
				.join(" ");
			const now = new Date();
			let out = format;
			out = out.replace("{time}", now.toLocaleTimeString());
			out = out.replace("{date}", now.toLocaleDateString());
			const newlinePrefix = " ".repeat(out.indexOf("{message}"));
			out = out.replace(
				"{message}",
				message.replace(/\n/g, `\n${newlinePrefix}`)
			);
			this.rootConsoleLog(out);
		};
	}
};

export const Logging = new LoggingClass();
