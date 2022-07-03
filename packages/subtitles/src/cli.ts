import fs from "fs/promises";

import { client } from "@tohsaka/torrent";

import { generate } from "./generate";
import { deserializeFile, serializeFile } from "./serializer";

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
			await fs.writeFile(filename, serializeFile(subtitles));
		})
	);

	client.torrents.forEach((torrent) => torrent.destroy());
	client.destroy();
}

export async function readFile() {
	const hashes = process.argv.slice(2);

	await Promise.all(
		hashes.map(async (hash) => {
			hash = hash.toLowerCase();
			const filename = `./content/${hash}`;

			if (!(await fs.stat(filename).catch(() => false))) {
				console.log(`file "${hash}" doesn't exist`);
				return;
			}

			const subtitles = deserializeFile(await fs.readFile(filename));
			console.log(subtitles);
		})
	);

	client.torrents.forEach((torrent) => torrent.destroy());
	client.destroy();
}
