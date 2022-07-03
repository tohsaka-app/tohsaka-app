import { PassThrough } from "stream";

import { getTorrentFile } from "@tohsaka/torrent";
import { parse } from "subtitle";
import ffmpeg from "fluent-ffmpeg";

import { serialize } from "./serializer";

export async function generate(hash: string): Promise<Array<string>> {
	const file = await getTorrentFile(hash);
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
