import fs from "fs/promises";
import "./logging.js";
import { walk } from "./walk.js";

export async function build() {
	await fs.mkdir("./dist/editor", { recursive: true });
	await generateModules();
	await copyResources();
	await copyStyles();
	await safeCopy("./project.json");
	await safeCopy("./prognosis/main.html", "./dist/index.html");
	await safeCopy("./prognosis/editor/editor.html", "./dist/editor/index.html");
	console.log(`Project rebuilt`);
}

async function generateModules() {
	const sourceFiles: string[] = [];
	for await (const fileStats of walk("./project")) {
		if (fileStats.name.endsWith(".ts")) {
			sourceFiles.push(fileStats.path);
		}
	}
	for await (const fileStats of walk("./prognosis/nodes")) {
		if (fileStats.path.endsWith(".ts")) {
			sourceFiles.push(fileStats.path);
		}
	}
	const distFiles = sourceFiles.map((file) =>
		file.replace(/^\./, "").replace(/\.ts$/, ".js")
	);
	await fs.writeFile("./dist/modules.json", JSON.stringify(distFiles, null, 4));
	console.log("Generated modules.json");
}

async function copyResources() {
	await fs.mkdir(toDistPath("./resources"), { recursive: true });
	for await (const fileStats of walk("./resources")) {
		if (fileStats.isDirectory()) {
			safeMkdir(toDistPath(fileStats.path));
		} else {
			safeCopy(fileStats.path);
		}
	}
}

async function copyStyles() {
	for await (const fileStats of walk("./prognosis")) {
		if (fileStats.name.endsWith(".css")) {
			safeCopy(fileStats.path);
		}
	}
}

async function safeMkdir(path: string) {
	return await fs.mkdir(path, { recursive: true });
}

function toDistPath(path: string): string {
	return path.replace(".", "./dist");
}

async function safeCopy(path: string, distPath?: string) {
	distPath = distPath ?? toDistPath(path);
	if (await hasChanged(path, distPath)) {
		await fs.copyFile(path, distPath);
		console.log(`Copied ${path}`);
	}
}

async function hasChanged(path: string, distPath?: string): Promise<boolean> {
	distPath = distPath ?? toDistPath(path);
	try {
		const stats = await fs.stat(path);
		const distStats = await fs.stat(distPath);
		return stats.mtimeMs > distStats.mtimeMs;
	} catch {
		return true;
	}
}

if (import.meta.url.endsWith(process.argv[1])) {
	build();
}
