import fs from "fs/promises";
import path from "path";

import { client } from "@tohsaka/torrent";
import { AnimeContent } from "@tohsaka/types";
import Spinner from "spinnies";
import chalk from "chalk";

import { generate } from "./generate";
import { deserializeFile, serializeFile } from "./serializer";

const ANIME_CONTENT_DIRECTORY = path.resolve(__dirname, "../../anime/content");

const spins = new Spinner();

export async function generateFiles() {
	const slugs = (await fs.readdir(ANIME_CONTENT_DIRECTORY)).map(
		(filename) => path.parse(filename).name
	);

	for (const slug of slugs) {
		const filepath = path.resolve(ANIME_CONTENT_DIRECTORY, `${slug}.json`);
		const content = await AnimeContent.parseAsync(JSON.parse(await fs.readFile(filepath, "utf-8")));

		let episodeIdx = 0;
		spins.add(`anime-${slug}`, {
			text: `Anime: ${chalk.yellow(slug)} (${episodeIdx}/${content.episodes.length})`
		});

		for (const episode of content.episodes) {
			episodeIdx += 1;

			spins.update(`anime-${slug}`, {
				text: `Anime: ${chalk.yellow(slug)} (${episodeIdx}/${content.episodes.length})`
			});

			spins.add(`anime-${slug}-${episode.id}`, {
				text: `Episode: "${chalk.yellow(episode.id)}"...`
			});

			/** Sort to get the lowest quality content first in the array */
			const resolutions = Object.keys(episode.content).sort();
			const resolution = resolutions[0];

			if (!resolution) {
				console.log(
					chalk.red(`Anime episode "${slug}/${episode.id}" doesn't contain any content.`)
				);
				spins.fail(`anime-${slug}-${episode.id}`);
				continue;
			}

			const hashes = episode.content[resolution];
			if (hashes.length === 0) {
				console.log(
					chalk.red(
						`Anime episode "${slug}/${episode.id}" doesn't contain any content for "${resolution}"`
					)
				);
				spins.fail(`anime-${slug}-${episode.id}`);
				continue;
			}

			const [hash, fileIdx] = hashes[0].split("/");
			const filename = `./content/subtitles/${hash}/${fileIdx}`;

			if (await fs.stat(filename).catch(() => false)) {
				console.log(`file "${hash}/${fileIdx}" already exists`);
				spins.succeed(`anime-${slug}-${episode.id}`);
				continue;
			}

			const subtitles = await generate(hash, Number.parseInt(fileIdx, 10), slug, episode.id, spins);
			console.log(`created new file "${hash}" with ${subtitles.length} entries`);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			await fs.mkdir(path.dirname(filename), { recursive: true }).catch(() => {});
			await fs.writeFile(filename, serializeFile(subtitles));
			spins.succeed(`anime-${slug}-${episode.id}`);
		}

		spins.succeed(`anime-${slug}`);
	}

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

			const subtitles = deserializeFile(await fs.readFile(filename, "utf-8"));
			console.log(subtitles);
		})
	);

	client.torrents.forEach((torrent) => torrent.destroy());
	client.destroy();
}
