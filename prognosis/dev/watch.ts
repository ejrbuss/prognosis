import fs from "fs/promises";
import child_process from "child_process";
import path from "path";
import { Logging } from "./logging.js";

Logging.format = "{message}";

const DistPath = path.join(process.cwd(), "dist");
const ServePath = path.join(DistPath, "prognosis", "dev", "serve.js");
const BuildPath = path.join(DistPath, "prognosis", "dev", "build.js");
const NonAsciiText = /[^ \n\t\d\w`~!@#$%^&*()-_=+\[\{\}\]\|\\;:'",<.>/?]/g;

export function spawn(source: string, command: string) {
	const child = child_process.spawn(command, { shell: true });
	child.stdout.setEncoding("utf8");
	child.stdout.on("data", (chunk: string) => {
		// Remove escape characters
		chunk = chunk.replace(NonAsciiText, "");
		const lines = chunk.split("\n").filter((line) => line.length);
		for (const line of lines) {
			console.log(`[${source}] ${line}`);
		}
	});
}

const IgnoredExtensions = new Set([".js.map", ".DS_Store"]);

export async function watch() {
	spawn("tsc", "tsc --watch");
	spawn("serve", `node ${ServePath}`);
	spawn("build", `node ${BuildPath}`);
	let deferredBuild: NodeJS.Timeout | undefined;
	for await (const change of fs.watch(process.cwd(), { recursive: true })) {
		if (IgnoredExtensions.has(path.extname(change.filename))) {
			continue;
		}
		if (
			change.filename === "project.json" ||
			change.filename.startsWith("prognosis") ||
			change.filename.startsWith("project") ||
			change.filename.startsWith("resources")
		) {
			if (!deferredBuild) {
				deferredBuild = setTimeout(() => {
					spawn("build", `node ${BuildPath}`);
					deferredBuild = undefined;
				}, 100);
			}
		}
	}
}

if (import.meta.url.endsWith(process.argv[1])) {
	watch();
}
