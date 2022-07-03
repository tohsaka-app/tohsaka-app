import fs from "fs/promises";
import { brotliCompressSync } from "zlib";

import { client } from "@tohsaka/torrent";

import { generate } from "./generate";

export async function generateFiles() {
	const hashes = process.argv.slice(2);

	await Promise.all(
		hashes.map(async (hash) => {
			hash = hash.toLowerCase();
			const filename = `./content/${hash}`;

			if (await fs.stat(filename).catch(() => false)) {
				console.log(`file "${hash}" already exists`);
				return;
			}

			const subtitles = await generate(hash);
			console.log(`created new file "${hash}" with ${subtitles.length} entries`);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			await fs.mkdir("content").catch(() => {});

			await fs.writeFile(filename, brotliCompressSync(subtitles.join("\n\u0000")));
		})
	);

	client.torrents.forEach((torrent) => torrent.destroy());
	client.destroy();
}
