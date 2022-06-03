import fs from "fs/promises";
import "./logging.js";

export async function build() {
	await fs.mkdir("./dist/editor", { recursive: true });
	await generateModules();
	await copyAssets();
	await safeCopy("./project.json");
	await safeCopy("./prognosis/main.html", "./dist/index.html");
	await safeCopy("./prognosis/main.css");
	await safeCopy("./prognosis/editor/editor.html", "./dist/editor/index.html");
	await safeCopy("./prognosis/editor/editor.css");
	console.log(`Project rebuilt`);
}

type WalkResult = { files: string[]; directories: string[] };

async function generateModules() {
	const { files: projectFiles } = await walk("./project");
	const { files: builtinFiles } = await walk("./prognosis/nodes");
	const sourceFiles = [...projectFiles, ...builtinFiles].filter((file) =>
		file.endsWith(".ts")
	);
	const distFiles = sourceFiles.map((file) =>
		file.replace(/^\./, "").replace(/.ts$/, ".js")
	);
	await fs.writeFile("./dist/modules.json", JSON.stringify(distFiles, null, 4));
	console.log("Generated modules.json");
}

async function copyAssets() {
	await fs.mkdir(toDistPath("./assets"), { recursive: true });
	const { files, directories } = await walk("./assets");
	await Promise.all(directories.map((dir) => safeMkdir(toDistPath(dir))));
	await Promise.all(files.map((file) => safeCopy(file)));
}

async function walk(root: string): Promise<WalkResult> {
	const result: WalkResult = { files: [], directories: [] };
	const subWalks: Promise<WalkResult>[] = [];
	for (const name of await fs.readdir(root)) {
		if (name.endsWith(".DS_Store")) {
			continue;
		}
		const subPath = `${root}/${name}`;
		const subStats = await fs.stat(subPath);
		if (subStats.isDirectory()) {
			result.directories.push(subPath);
			subWalks.push(walk(subPath));
		} else {
			result.files.push(subPath);
		}
	}
	for (const subResult of await Promise.all(subWalks)) {
		result.files.push(...subResult.files);
		result.directories.push(...subResult.directories);
	}
	return result;
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
