import http from 'http';
import path from 'path';
import fs from 'fs/promises';

const Host = 'localhost';
const Port = 8080;
const RootPath = process.cwd();

const ExtensionToContentType = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.png': 'image/png',
	'.jpg': 'image/jpg',
	'.wav': 'audio/wav',
};

const server = http.createServer(async (request, response) => {

	console.log(request.url);

	if (request.url.startsWith('/debug/api/')) {
		switch (request.url) {
			case '/debug/api/test':
				response.writeHead(200);
				response.end();
				return;
			case '/debug/api/cwd':
				response.writeHead(200);
				response.end(process.cwd());
				return;
			default:
				response.writeHead(404);
				response.end('Bad Request');
				return;
		}
	}

	let filePath = path.resolve(RootPath + request.url);
	if (!filePath.startsWith(RootPath)) {
		response.writeHead(404);
		response.end('Bad Request');
		return;
	}
	try {
		let fileStat = await fs.lstat(filePath);
		if (!fileStat.isFile()) {
			// Try to find index
			filePath = path.join(filePath, 'index.html');
			fileStat = await fs.lstat(filePath);
		}
		if (!fileStat.isFile()) {
			response.writeHead(404);
			response.end('Bad Request');
			return;
		}
		const extension = path.extname(filePath);
		const contentType = ExtensionToContentType[extension] ?? 'text';
		const data = await fs.readFile(filePath);
		response.writeHead(200, { "Content-Type": contentType });
		response.end(data, 'utf8');
	} catch (error) {
		response.writeHead(404);
		response.end(error.stack);
	}
});

server.listen(Port, Host, () =>
	console.log(`Development server started on http://${Host}:${Port}`)
);