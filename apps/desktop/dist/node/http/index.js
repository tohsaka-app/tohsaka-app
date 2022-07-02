"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startHttp = void 0;
const http_1 = require("http");
const mime_1 = require("mime");
const cleanup_1 = require("../lib/cleanup");
const torrent_1 = require("../lib/torrent");
function kill(res, message) {
    res.write(message);
    res.end();
}
async function startHttp() {
    const server = (0, http_1.createServer)(async (req, res) => {
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
    }).listen(17709);
    (0, cleanup_1.useCleanup)(() => server.close());
}
exports.startHttp = startHttp;
