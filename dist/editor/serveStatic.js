import { readdir, readFile, stat } from "fs/promises";
import { createServer } from "http";
import { extname, resolve } from "path";
const IndexNameRegexp = /^index\.\w+$/i;
const MessageByStatusCode = {
    200: "Ok",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    500: "Internal Server Error",
};
export const ContentTypeByExtension = {
    // text
    ".txt": "text/plain",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".md": "text/markdown",
    ".csv": "text/csv",
    // application
    ".json": "application/json",
    ".xml": "application/xml",
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    // image
    ".bmp": "image/bmp",
    ".gif": "image/gif",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    // audio
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mid": "audio/mid",
    ".midi": "audio/mid",
    // video
    ".mp4": "video/mp4",
    ".mpeg": "video/mpeg",
    // font
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
};
export function serveStatic(rootPath, port = 8080) {
    rootPath = resolve(rootPath);
    const server = createServer(async (request, response) => {
        try {
            const method = request.method;
            const relativePath = request.url ?? "";
            console.log(`[${method}] ${relativePath}`);
            if (method !== "GET") {
                return serveStatusCode(response, 405);
            }
            const path = resolve(rootPath, `./${relativePath}`);
            if (!path.startsWith(rootPath)) {
                return serveStatusCode(response, 403);
            }
            let pathStat;
            try {
                pathStat = await stat(path);
            }
            catch {
                return serveStatusCode(response, 404);
            }
            if (pathStat.isDirectory()) {
                const children = await readdir(path);
                const indexName = children.find((name) => IndexNameRegexp.test(name));
                if (indexName) {
                    return await serveFile(response, resolve(path, indexName));
                }
                return serveDirectory(response, relativePath, children);
            }
            else {
                return await serveFile(response, path);
            }
        }
        catch (error) {
            console.error(error);
            return serveStatusCode(response, 500);
        }
    });
    console.log(`Starting up static file server, serving ${rootPath}`);
    console.log(`Available at: http://localhost:${port}`);
    console.log();
    server.listen(port, "localhost");
    return server;
}
function serveStatusCode(response, statusCode) {
    const message = MessageByStatusCode[statusCode];
    response.writeHead(statusCode, message, { "Content-Type": "text/html" });
    response.end(simplePage(statusCode.toString(), message));
}
async function serveFile(response, path) {
    const statusCode = 200;
    const message = MessageByStatusCode[statusCode];
    const data = await readFile(path);
    const extension = extname(path);
    const contentType = ContentTypeByExtension[extension.toLowerCase()];
    if (!contentType) {
        throw new Error(`No known Content-Type: ${path}!`);
    }
    response.writeHead(statusCode, message, { "Content-type": contentType });
    response.end(data, "utf-8");
}
function serveDirectory(response, path, children) {
    const statusCode = 200;
    const message = MessageByStatusCode[statusCode];
    const childLinks = children.map((name) => `<a href="${resolve(path, name)}">${name}</a>`);
    response.writeHead(statusCode, message, { "Content-Type": "text/html" });
    response.end(simplePage(path, childLinks.join("<br />")));
}
function simplePage(title, content) {
    return `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
			<title>${title}</title>
			<style>
				a {
					text-decoration: none;
					color: dodgerblue;
				}
				a:hover {
					text-decoration: underline;
				}
				body {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 100vw;
					height: 100vh;
					font-family: "Tahoma";
				}
				#main {
					display: flex;
					align-items: center;
					justify-content: start;
				}
				#title {
					padding: 1rem;
					padding-right: 1.5rem;
					font-size: 2rem;
				}
				#content {
					padding: 1rem;
					padding-right: 1.5rem;
					border-left: 1px solid lightgrey;
				}
			</style>
		</head>
		<body>
			<div id="main">
				<div id="title">${title}</div>
				<div id="content">${content}</div>
			</div>
		</body>
	</html>`;
}
//# sourceMappingURL=serveStatic.js.map