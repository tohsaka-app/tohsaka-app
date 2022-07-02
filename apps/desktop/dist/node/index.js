"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const electron_1 = require("electron");
const electron_serve_1 = __importDefault(require("electron-serve"));
const torrent_1 = require("./lib/torrent");
const mime_1 = require("mime");
const loadURL = (0, electron_serve_1.default)({ directory: "dist/web" });
function kill(res, message) {
    res.write(message);
    res.end();
}
async function createServer() {
    return http_1.default
        .createServer(async (req, res) => {
        if (!req.url)
            return kill(res, "Bad request");
        console.log(req.url, req.headers.host);
        const url = new URL(req.url, `http://${req.headers.host}`);
        const hash = url.searchParams.get("hash");
        if (!hash)
            return kill(res, "Didn't receive a torrent hash");
        const torrent = await (0, torrent_1.getTorrent)(hash);
        const file = torrent.files[0];
        if (!file)
            return kill(res, "Torrent doesn't have any files");
        const range = req.headers.range || "bytes=0-";
        // eslint-disable-next-line no-mixed-operators
        const chunkSize = 10 ** 6 * 4; // 4MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, file.length - 1);
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${file.length}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": (0, mime_1.getType)(file.name) || ""
        };
        res.writeHead(206, headers);
        const videoStream = file.createReadStream({ start, end });
        videoStream.pipe(res);
    })
        .listen(17709);
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
