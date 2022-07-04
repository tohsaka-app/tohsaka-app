import { PassThrough } from "stream";

import { client, getTorrent, getTorrentFile } from "@tohsaka/torrent";
import { parse } from "subtitle";
import ffmpeg from "fluent-ffmpeg";
import {getAnime} from "@tohsaka/api-client"
import { serialize } from "./serializer";

export async function generate(hash: string): Promise<Array<string>> {
	console.log(await getAnime("hunter-x-hunter-2011"))
	console.log(hash);
	const torrent = await getTorrent(hash);
	console.log(torrent.files.map((file, idx) => `${file.name} - ${idx}`).sort());

	const file = await getTorrentFile(hash);
	console.log(file.name);
	const subtitles: Array<string> = [];

	return new Promise((resolve) => {
		ffmpeg()
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.input(file.createReadStream() as any)
			.outputOptions("-map 0:s:0")
			.output(
				new PassThrough()
					.pipe(parse())
					.on("data", (chunk) => {
						subtitles.push(serialize(chunk));
					})
					.on("end", () => {
						resolve(subtitles);
					})
			)
			.outputFormat("srt")
			.run();
	});
}
