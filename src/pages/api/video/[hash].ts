import { getType } from "mime";
// @ts-expect-error: not properly typed.
import WebTorrent from "webtorrent-hybrid";
import { Instance, Torrent } from "webtorrent";
import MagnetUri from "magnet-uri";

import type { NextApiRequest, NextApiResponse } from "next";

const client: Instance = new WebTorrent();

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { hash } = req.query as { hash: string };

	const uri = MagnetUri.encode({
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

	const torrent =
		client.get(uri) ||
		(await new Promise<Torrent>((resolve) => {
			client.add(uri, resolve);
		}));

	const file = torrent.files[0];
	if (!file) return res.status(404).end();

	const range = req.headers.range || "bytes=0-";

	const chunkSize = 10 ** 6; // 1MB
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
};
