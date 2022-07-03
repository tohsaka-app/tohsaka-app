import { PassThrough } from "stream";

import { getTorrentFile } from "@tohsaka/torrent";
import { parse } from "subtitle";
import ffmpeg from "fluent-ffmpeg";

import { format } from "./format";

import { Subtitle } from ".";

export async function generate(hash: string): Promise<Array<string>> {
	const file = await getTorrentFile(hash);
	const subtitles: Array<string> = [];

	return new Promise((resolve) => {
		ffmpeg()
			.input(file.createReadStream() as any)
			.outputOptions("-map 0:s:0")
			.output(
				new PassThrough()
					.pipe(parse())
					.on("data", (chunk) => {
						subtitles.push(format(chunk));
					})
					.on("end", () => {
						resolve(subtitles);
					})
			)
			.outputFormat("srt")
			.run();
	});
}
