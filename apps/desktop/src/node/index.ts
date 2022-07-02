import path from "path";
import http from "http";

import { app, BrowserWindow } from "electron";
import serve from "electron-serve";

import { getTorrent } from "./lib/torrent";
import { getType } from "mime";

const loadURL = serve({ directory: "dist/web" });

function kill(res: http.ServerResponse, message: string) {
	res.write(message);
	res.end();
}

async function createServer(): Promise<http.Server> {
	return http
		.createServer(async (req, res) => {
			if (!req.url) return kill(res, "Bad request");
			console.log(req.url, req.headers.host);
			const url = new URL(req.url, `http://${req.headers.host}`);

			const hash = url.searchParams.get("hash");
			if (!hash) return kill(res, "Didn't receive a torrent hash");

			const torrent = await getTorrent(hash);

			const file = torrent.files[0];
			if (!file) return kill(res, "Torrent doesn't have any files");

			const range = req.headers.range || "bytes=0-";

			// eslint-disable-next-line no-mixed-operators
			const chunkSize = 10 ** 6 * 4; // 4MB
			const start = Number(range.replace(/\D/g, ""));
			const end = Math.min(start + chunkSize, file.length - 1);

			const headers = {
				"Content-Range": `bytes ${start}-${end}/${file.length}`,
				"Accept-Ranges": "bytes",
				"Content-Length": end - start + 1,
				"Content-Type": getType(file.name) || ""
			};

			res.writeHead(206, headers);

			const videoStream = file.createReadStream({ start, end });
			videoStream.pipe(res);
		})
		.listen(17709);
}

async function createWindow(): Promise<BrowserWindow> {
	const window = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: false,
			preload: path.join(__dirname, "preload.js")
		}
	});

	await loadURL(window);
	return window;
}

const _window: BrowserWindow | null = null;
async function getWindow(create: boolean = true): Promise<BrowserWindow | null> {
	if (_window) return _window;
	if (create) return createWindow();
	return null;
}

const _server: http.Server | null = null;
async function getServer(create: boolean = true): Promise<http.Server | null> {
	if (_server) return _server;
	if (create) return createServer();
	return null;
}

if (!app.requestSingleInstanceLock()) {
	app.quit();
} else {
	app.on("second-instance", async () => {
		const window = await getWindow();
		if (!window) return;

		if (window.isMinimized()) window.restore();
		window.focus();
	});

	app.on("ready", async () => {
		await createServer();
		await createWindow();

		app.on("activate", async () => {
			if (BrowserWindow.getAllWindows().length === 0) await createWindow();
		});
	});

	app.on("window-all-closed", () => {
		if (process.platform !== "darwin") app.quit();
	});
}
