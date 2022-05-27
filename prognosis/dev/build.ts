import fs from "fs/promises";
import path from "path";
import "./logging.js";

const ConfigPath = path.join(process.cwd(), "prognosis.json");
const DistPath = path.join(process.cwd(), "dist");
const DistConfigPath = path.join(DistPath, "prognosis.json");
const DistIndexPath = path.join(DistPath, "index.html");

export async function build() {
	const projectConfigsource = await fs.readFile(ConfigPath, "utf8");
	const projectConfig = JSON.parse(projectConfigsource);
	await fs.writeFile(DistConfigPath, projectConfigsource);
	const sources = ["prognosis/main.js"];
	await fs.writeFile(
		DistIndexPath,
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
	console.log(`Project rebuilt.`);
}

if (import.meta.url.endsWith(process.argv[1])) {
	build();
}
