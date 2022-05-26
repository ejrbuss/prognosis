import fs from "fs/promises";
import child_process from "child_process";
import path from "path";
import { Logging } from "./logging.js";
Logging.format = "{message}";
const DistPath = path.join(process.cwd(), "dist");
const ServePath = path.join(DistPath, "prognosis", "serve.js");
const BuildPath = path.join(DistPath, "prognosis", "build.js");
const NonAsciiText = /[^ \n\t\d\w`~!@#$%^&*()-_=+\[\{\}\]\|\\;:'",<.>/?]/g;
export function spawn(source, command) {
    const child = child_process.spawn(command, { shell: true });
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
        // Remove escape characters
        chunk = chunk.replace(NonAsciiText, "");
        const lines = chunk.split("\n").filter((line) => line.length);
        for (const line of lines) {
            console.log(`[${source}] ${line}`);
        }
    });
}
const IgnoredFiles = new Set([
    path.join("dist", "index.html"),
    path.join("dist", "project.json"),
    path.join("dist", "tsconfig.tsbuildinfo"),
]);
const IgnoredExtensions = new Set([".js.map"]);
export async function watch() {
    spawn("tsc", "tsc --watch");
    spawn("serve", `node ${ServePath}`);
    spawn("build", `node ${BuildPath}`);
    let deferredBuild;
    for await (const change of fs.watch(process.cwd(), { recursive: true })) {
        if (IgnoredFiles.has(change.filename) ||
            IgnoredExtensions.has(path.extname(change.filename))) {
            continue;
        }
        if (change.filename === "project.json" ||
            change.filename.startsWith("dist") ||
            change.filename.startsWith("assets")) {
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
//# sourceMappingURL=watch.js.map