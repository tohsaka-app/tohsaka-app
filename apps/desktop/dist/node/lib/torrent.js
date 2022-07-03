"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTorrentFile = exports.getTorrent = exports.client = void 0;
// eslint-disable-next-line import/no-named-as-default
const webtorrent_1 = __importDefault(require("webtorrent"));
// eslint-disable-next-line import/no-named-as-default
const magnet_uri_1 = __importDefault(require("magnet-uri"));
exports.client = new webtorrent_1.default();
async function getTorrent(hash) {
    const uri = magnet_uri_1.default.encode({
        xt: `urn:btih:${hash.toLowerCase()}`,
        tr: [
            "http://nyaa.tracker.wf:7777/announce",
            "udp://tracker.coppersurfer.tk:6969/announce",
            "udp://tracker.opentrackr.org:1337/announce",
            "udp://9.rarbg.to:2710/announce",
            "udp://9.rarbg.me:2710/announce",
            "udp://tracker.leechers-paradise.org:6969/announce",
            "udp://tracker.internetwarriors.net:1337/announce",
            "udp://tracker.cyberia.is:6969/announce",
            "udp://exodus.desync.com:6969/announce",
            "udp://tracker3.itzmx.com:6961/announce",
            "udp://tracker.torrent.eu.org:451/announce",
            "udp://tracker.tiny-vps.com:6969/announce",
            "udp://retracker.lanta-net.ru:2710/announce",
            "http://open.acgnxtracker.com:80/announce",
            "wss://tracker.openwebtorrent.com"
        ]
    });
    return (exports.client.get(uri) ||
        (await new Promise((resolve) => {
            exports.client.add(uri, resolve);
        })));
}
exports.getTorrent = getTorrent;
async function getTorrentFile(hash) {
    const torrent = await getTorrent(hash);
    return new Promise((resolve) => {
        if (torrent.ready)
            return resolve(torrent.files[0]);
        torrent.on("ready", () => {
            resolve(torrent.files[0]);
        });
    });
}
exports.getTorrentFile = getTorrentFile;
