// eslint-disable-next-line import/no-named-as-default
import WebTorrent, { Instance, Torrent, TorrentFile } from "webtorrent";
// eslint-disable-next-line import/no-named-as-default
import MagnetUri from "magnet-uri";

export const client: Instance = new WebTorrent();

export async function getTorrent(hash: string): Promise<Torrent> {
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

	return (
		client.get(uri) ||
		(await new Promise<Torrent>((resolve) => {
			client.add(uri, resolve);
		}))
	);
}

export async function getTorrentFile(hash: string, idx: number = 0) {
	const torrent = await getTorrent(hash);
	return new Promise<TorrentFile>((resolve) => {
		if (torrent.ready) return resolve(torrent.files[idx]);

		torrent.on("ready", () => {
			resolve(torrent.files[idx]);
		});
	});
}
