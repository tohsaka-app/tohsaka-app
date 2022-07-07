import { PassThrough } from "stream";

import { getTorrentFile } from "@tohsaka/torrent";
import { parse } from "subtitle";
import ffmpeg from "fluent-ffmpeg";
import Spinnies from "spinnies";
import chalk from "chalk";
import ms from "ms";

import { serialize } from "./serializer";

export async function generate(
	hash: string,
	fileIdx: number,
	animeSlug: string,
	episodeId: string,
	spins: Spinnies
): Promise<Array<string>> {
	const file = await getTorrentFile(hash, fileIdx);
	const subtitles: Array<string> = [];

	console.log(file.name);
	const startTime = performance.now();

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
						spins.update(`anime-${animeSlug}-${episodeId}`, {
							text: `Episode: ${chalk.yellow(episodeId)} — ${(file.progress * 100).toFixed(
								2
							)}% — ${ms(performance.now() - startTime, { long: true })}`
						});
					})
					.on("end", () => {
						resolve(subtitles);
					})
			)
			.outputFormat("srt")
			.run();
	});
}
