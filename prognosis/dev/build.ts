import { Stats } from "fs";
import fs from "fs/promises";
import path from "path";
import "./logging.js";

const ConfigPath = path.join(process.cwd(), "prognosis.json");
const AssetsPath = path.join(process.cwd(), "assets");
const DistPath = path.join(process.cwd(), "dist");

export async function build() {
	const projectConfigsource = await fs.readFile(ConfigPath, "utf8");
	const projectConfig = JSON.parse(projectConfigsource);
	await fs.writeFile(toDistPath(ConfigPath), projectConfigsource);
	console.log(`Copied ${ConfigPath}.`);
	await copyAssets();
	await writeIndex(projectConfig);
	console.log(`Project rebuilt.`);
}

function toDistPath(path: string): string {
	return path.replace(process.cwd(), DistPath);
}

async function copyAssets() {
	async function walk(
		dirPath: string,
		pathAndStats: [string, Stats][] = []
	): Promise<[string, Stats][]> {
		for (const name of await fs.readdir(dirPath)) {
			if (name.endsWith(".DS_Store")) {
				continue;
			}
			const subPath = path.join(dirPath, name);
			const subStats = await fs.stat(subPath);
			pathAndStats.push([subPath, subStats]);
			if (subStats.isDirectory()) {
				await walk(subPath, pathAndStats);
			}
		}
		return pathAndStats;
	}

	await fs.mkdir(toDistPath(AssetsPath), { recursive: true });
	const assets = await walk(AssetsPath);
	const dirs = assets.filter(([_, stat]) => stat.isDirectory());
	const files = assets.filter(([_, stat]) => stat.isFile());
	await Promise.all(
		dirs.map(([dirPath]) => fs.mkdir(toDistPath(dirPath), { recursive: true }))
	);
	await Promise.all(
		files.map(async ([filePath, stats]) => {
			if (await hasChanged(filePath, stats)) {
				await fs.copyFile(filePath, toDistPath(filePath));
				console.log(`Copied asset ${filePath}.`);
			}
		})
	);
}

async function writeIndex(projectConfig: any) {
	const sources = ["prognosis/main.js"];
	const indexPath = path.join(DistPath, "index.html");
	await fs.writeFile(
		indexPath,
		`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>${projectConfig.title}</title>
			<link rel="icon" href="./favicon.ico" type="image/x-icon">
			<style>
				body {
					background: black;
				}

				#main-canvas {
					margin: 0;
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
				}
			</style>
		</head>
		<body>
			<canvas id="main-canvas"></canvas>
			${sources.map((source) => `<script type="module" src="${source}"></script>`)}
		</body>
		</html>`
	);
	console.log(`Wrote ${indexPath}.`);
}

async function hasChanged(path: string, stats: Stats): Promise<boolean> {
	try {
		const distPath = toDistPath(path);
		const distStats = await fs.stat(distPath);
		return stats.mtimeMs > distStats.mtimeMs;
	} catch {
		return true;
	}
}

if (import.meta.url.endsWith(process.argv[1])) {
	build();
}
