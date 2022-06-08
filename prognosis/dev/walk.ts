import { Stats } from "fs";
import fs from "fs/promises";

type FileStats = Stats & { path: string; name: string };

export async function* walk(root: string): AsyncGenerator<FileStats> {
	for (const name of await fs.readdir(root)) {
		if (name.endsWith(".DS_Store")) {
			continue;
		}
		const subPath = `${root}/${name}`;
		const subStats = (await fs.stat(subPath)) as FileStats;
		subStats.name = name;
		subStats.path = subPath;
		yield subStats;
		if (subStats.isDirectory()) {
			yield* walk(subPath);
		}
	}
}
