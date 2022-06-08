import http from "http";
import path from "path";
import fs from "fs/promises";
import { walk } from "./walk.js";
import "./logging.js";

const Host = "localhost";
const Port = 8080;
const RootPath = path.join(process.cwd(), "dist");

const ExtensionToContentType: Record<string, string> = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg",
	".wav": "audio/wav",
};

export function serve(): http.Server {
	const server = http.createServer(async (request, response) => {
		console.log(request.method, request.url);
		if (request.method === "GET") {
			fileServer(request, response);
		}
		if (request.method === "POST") {
			editorApi(request, response);
		}
	});
	server.listen(Port, Host, () =>
		console.log(`Development server started on http://${Host}:${Port}`)
	);
	return server;
}

async function fileServer(
	request: http.IncomingMessage,
	response: http.ServerResponse
) {
	let filePath = path.resolve(RootPath + request.url);
	if (!filePath.startsWith(RootPath)) {
		response.writeHead(404);
		response.end("Bad Request");
		return;
	}
	try {
		let fileStat = await fs.lstat(filePath);
		if (!fileStat.isFile()) {
			// Try to find index
			filePath = path.join(filePath, "index.html");
			fileStat = await fs.lstat(filePath);
		}
		if (!fileStat.isFile()) {
			response.writeHead(404);
			response.end("Bad Request");
			return;
		}
		const extension = path.extname(filePath);
		const contentType = ExtensionToContentType[extension] ?? "text";
		const data = await fs.readFile(filePath);
		response.writeHead(200, { "Content-Type": contentType });
		response.end(data, "utf-8");
	} catch (error) {
		response.writeHead(404);
		response.end((error as Error).stack);
	}
}

async function editorApi(
	request: http.IncomingMessage,
	response: http.ServerResponse
) {
	try {
		if (request.url === "/editor/api/getFileUrl") {
			const body = await jsonBody(request);
			const name = body.name;
			const size = body.size;
			for await (const fileStats of walk("./dist")) {
				if (fileStats.name === name) {
					console.log(fileStats.name, fileStats.size);
				}
				if (fileStats.name === name && fileStats.size === size) {
					response.writeHead(200);
					response.end(JSON.stringify(fileStats.path.replace("./dist", "")));
				}
			}
			throw new Error("No file found!");
		}
	} catch (error) {
		response.writeHead(500);
		response.end((error as Error).stack);
	}
}

async function jsonBody(request: http.IncomingMessage): Promise<any> {
	const buffers = [];
	for await (const chunk of request) {
		buffers.push(chunk);
	}
	return JSON.parse(Buffer.concat(buffers).toString());
}

if (import.meta.url.endsWith(process.argv[1])) {
	serve();
}
