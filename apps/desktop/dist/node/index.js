"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable require-atomic-updates */
const path_1 = __importDefault(require("path"));
const stream_1 = require("stream");
const electron_1 = require("electron");
const electron_serve_1 = __importDefault(require("electron-serve"));
const mime_1 = require("mime");
const koa_1 = __importDefault(require("koa"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const subtitle_1 = require("subtitle");
const torrent_1 = require("./lib/torrent");
const loadURL = (0, electron_serve_1.default)({ directory: "dist/web" });
async function createServer() {
    const app = new koa_1.default({});
    app.use(async (ctx) => {
        const pathname = ctx.path.slice(1);
        if (pathname === "info") {
            ctx.response.status = 200;
            ctx.response.body = {
                speed: {
                    upload: torrent_1.client.uploadSpeed,
                    download: torrent_1.client.downloadSpeed
                }
            };
            return;
        }
        const [hash, ext] = pathname.split(".");
        if (!hash)
            return ctx.throw(400, "Insufficient request");
        console.log(ext, hash, torrent_1.client.progress, torrent_1.client.ratio);
        const file = await (0, torrent_1.getTorrentFile)(hash);
        if (!file)
            return ctx.throw(400, "Bad torrent");
        ctx.respond = false;
        if (ext === "json") {
            ctx.status = 200;
            const subtitles = [];
            (0, fluent_ffmpeg_1.default)()
                .on("start", console.log)
                .input(file.createReadStream())
                .outputOptions("-map 0:s:0")
                .output(new stream_1.PassThrough()
                .pipe((0, subtitle_1.parse)())
                .on("data", (chunk) => {
                const position = chunk.data.text.match(/\{\\an8\}/) ? "top" : "bottom";
                const text = chunk.data.text.replace(/<[^>]+>|\{\\an8\}/g, "");
                subtitles.push({
                    ...chunk,
                    data: {
                        ...chunk.data,
                        position,
                        text
                    }
                });
                console.log(subtitles.length);
            })
                .on("end", () => {
                ctx.res.write(JSON.stringify({
                    file: {
                        name: file.name
                    },
                    subtitles: subtitles.map((subtitle, idx) => ({ id: idx, ...subtitle }))
                }));
                ctx.res.end();
            }))
                .outputFormat("srt")
                .run();
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
            "Content-Type": (0, mime_1.getType)(file.name) || ""
        });
        ctx.status = 206;
        const videoStream = file.createReadStream({ start, end });
        videoStream.pipe(ctx.res);
    });
    app.listen(17709);
    return app;
}
async function createWindow() {
    const window = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            preload: path_1.default.join(__dirname, "preload.js")
        }
    });
    await loadURL(window);
    return window;
}
const _window = null;
async function getWindow(create = true) {
    if (_window)
        return _window;
    if (create)
        return createWindow();
    return null;
}
const _server = null;
async function getServer(create = true) {
    if (_server)
        return _server;
    if (create)
        return createServer();
    return null;
}
if (!electron_1.app.requestSingleInstanceLock()) {
    electron_1.app.quit();
}
else {
    electron_1.app.on("second-instance", async () => {
        const window = await getWindow();
        if (!window)
            return;
        if (window.isMinimized())
            window.restore();
        window.focus();
    });
    electron_1.app.on("ready", async () => {
        await createServer();
        await createWindow();
        electron_1.app.on("activate", async () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                await createWindow();
        });
    });
    electron_1.app.on("window-all-closed", () => {
        if (process.platform !== "darwin")
            electron_1.app.quit();
    });
}
