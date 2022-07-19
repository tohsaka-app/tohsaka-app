/* eslint-disable require-atomic-updates */
import path from "path";
import { PassThrough } from "stream";

import { app, BrowserWindow } from "electron";
import serve from "electron-serve";
import { getType } from "mime";
import Koa from "koa";
import ffmpeg from "fluent-ffmpeg";
import { parse } from "subtitle";
import { client, getTorrentFile } from "@tohsaka/torrent";
import { parse as parseSubtitleChunk, Subtitle } from "@tohsaka/subtitles";

const loadURL = serve({ directory: "dist/web" });

async function createServer(): Promise<Koa> {
	const app = new Koa({});

	app.use(async (ctx) => {
		const pathname = ctx.path.slice(1);

		if (pathname === "info") {
			ctx.response.status = 200;
			ctx.response.body = {
				speed: {
					upload: client.uploadSpeed,
					download: client.downloadSpeed
				}
			};

			return;
		}

		const [hash, ext] = pathname.split(".");

		if (!hash) return ctx.throw(400, "Insufficient request");
		console.log(ext, hash);

		const [fileHash, fileIdx] = hash.split("/");

		const file = await getTorrentFile(fileHash, Number.parseInt(fileIdx, 10));
		if (!file) return ctx.throw(400, "Bad torrent");

		ctx.respond = false;

		if (ext === "json") {
			ctx.status = 200;

			const subtitles: Array<Subtitle> = [];

			ffmpeg()
				.on("start", console.log)
				.input(file.createReadStream() as any)
				.outputOptions("-map 0:s:0")
				.output(
					new PassThrough()
						.pipe(parse())
						.on("data", (chunk) => {
							subtitles.push(parseSubtitleChunk(chunk));
							console.log(subtitles.length);
						})
						.on("end", () => {
							ctx.res.write(
								JSON.stringify({
									file: {
										name: file.name
									},
									subtitles: subtitles.map((subtitle, idx) => ({ id: idx, ...subtitle }))
								})
							);
							ctx.res.end();
						})
				)
				.outputFormat("srt")
				.run();

			ctx.res.write(JSON.stringify({ subtitles }));
			ctx.res.end();
			return;
		}

		const range = ctx.get("range") || "bytes=0-";

		// eslint-disable-next-line no-mixed-operators
		const chunkSize = 10 ** 6 * 4; // 4MB
		const start = Number(range.replace(/\D/g, ""));
		const end = Math.min(start + chunkSize, file.length - 1);

		ctx.set({
			"Content-Range": `bytes ${start}-${end}/${file.length}`,
			"Accept-Ranges": "bytes",
			"Content-Length": (end - start + 1).toString(),
			"Content-Type": getType(file.name) || ""
		});

		ctx.status = 206;

		const videoStream = file.createReadStream({ start, end });
		videoStream.pipe(ctx.res, {});
	});

	app.listen(17709);
	return app;
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

const _server: Koa | null = null;
async function getServer(create: boolean = true): Promise<Koa | null> {
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
