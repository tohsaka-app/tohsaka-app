/* eslint-disable import/no-named-as-default */
import fs from "fs/promises";

import { si } from "nyaapi";
import { searchAnime } from "@tohsaka/api-client";
import prompts from "prompts";
import chalk from "chalk";
import Spinner from "spinnies";
import link from "terminal-link";
import { client, getTorrent } from "@tohsaka/torrent";
// eslint-disable-next-line import/named
import { decode as decodeMagnet } from "magnet-uri";
import { AnimeContent } from "@tohsaka/types";

const NAME_REGEX = /\w] (?<name>.+) \(\d+-\d+\) \((?<resolution>\d+)p\)/;
const dirname = `./content`;

const spins = new Spinner();

void (async () => {
	await fs.mkdir(dirname).catch(() => {
		/** don't error on fail to create */
	});

	spins.add("load-torrents", { text: "Loading available torrents..." });

	let results = (
		await si
			.searchAllByUser("subsplease", "batch", {
				category: "1_2",
				filter: 2
			})
			.catch((reason) => {
				console.error(reason);
				spins.fail("load-torrents");
				process.exit(-1);
			})
	).sort((a, b) => {
		if (Number.parseInt(a.seeders, 10) > Number.parseInt(b.seeders, 10)) return -1;
		return 1;
	});

	spins.succeed("load-torrents");
	console.log(chalk.gray(`A total of ${results.length} torrents available.`));

	const { selectTorrents } = await prompts({
		name: "selectTorrents",
		type: "multiselect",
		message: "Which torrents do you want to add?",
		choices: results.map((node) => ({
			title: node.name,
			selected: true
		}))
	});

	results = results.filter((_, idx) => {
		return selectTorrents.includes(idx);
	});

	for (const node of results) {
		const match = node.name.match(NAME_REGEX);
		if (!match) continue;

		const { name, resolution } = match.groups as { name: string; resolution: string };

		console.log("");
		spins.add(`load-anime-${name}`, { text: `Querying for "${name}"...` });

		const animes = await searchAnime(name).catch(() => {
			spins.fail(`load-anime-${name}`, {});
			return null;
		});

		if (!animes) continue;
		spins.succeed(`load-anime-${name}`, {});

		let animeIdx = 0;
		if (animes.length === 1) {
			const anime = animes[animeIdx];
			const { confirmAnime } = await prompts({
				name: "confirmAnime",
				type: "confirm",
				message: `Is "${chalk.yellow(
					link(anime.titles.canonical, `https://kitsu.io/anime/${anime.slug}`)
				)}" the correct anime?`,
				initial: true
			});

			if (!confirmAnime) continue;
		} else {
			const { selectedAnime } = await prompts({
				name: "selectedAnime",
				type: "select",
				message: `Choose the correct anime for "${chalk.yellow(node.name)}"`,
				choices: [
					...animes.map((anime) => ({
						title: link(
							`${anime.titles.canonical} (${anime.type})`,
							`https://kitsu.io/anime/${anime.slug}`
						),
						description: anime.description || void 0
					})),
					{
						title: chalk.red("No match"),
						description: "None of these match.",
						value: null
					}
				]
			});

			if (selectedAnime === null) continue;
			animeIdx = selectedAnime;
		}

		const anime = animes[animeIdx];
		const filename = `${dirname}/${anime.slug.toLowerCase()}.json`;

		const { episodes: diskEpisodes } = JSON.parse(
			await fs.readFile(filename, "utf-8").catch(() => JSON.stringify({ episodes: {} }))
		) as AnimeContent;

		const { infoHash } = decodeMagnet(node.magnet);

		if (!infoHash) return console.log(chalk.yellow(`Couldn't find info hash for this torrent!`));
		spins.add(`load-torrent-${name}`, { text: `Obtaining torrent files...` });

		const torrent = await getTorrent(infoHash);
		spins.succeed(`load-torrent-${name}`, {});

		const episodeFileMap: Record<number, number> = Object.fromEntries(
			anime.episodes.map((episode, episodeIdx) => {
				const diskEpisode = diskEpisodes.find((cv) => cv.id === episode.id);
				if (diskEpisode) episode.content = diskEpisode.content;

				console.log(` Episode ${episode.number} — ${chalk.gray(torrent.files[episodeIdx].name)}`);
				return [episodeIdx, episodeIdx];
			})
		);

		const { correctEpisodeOrder } = await prompts({
			name: "correctEpisodeOrder",
			type: "confirm",
			message: "Is the correct episode order?",
			initial: true
		});

		if (!correctEpisodeOrder) {
			for (const episodeIdx of Object.keys(episodeFileMap)) {
				const episode = anime.episodes[Number.parseInt(episodeIdx, 10)];

				const { episodeFileIdx } = await prompts({
					name: "episodeFileIdx",
					type: "select",
					message: `Choose the ${link(
						`${episode.number}th episode`,
						`https://kitsu.io/anime/${anime.slug}/episodes/${episode.number}`
					)}."`,
					choices: torrent.files.map((file) => ({
						title: file.name
					}))
				});

				episodeFileMap[Number.parseInt(episodeIdx, 10)] = episodeFileIdx;
			}
		}

		spins.add(`save-anime-${name}`, { text: `Saving content files...` });

		for (const [episodeIdx, episodeFileIdx] of Object.entries(episodeFileMap)) {
			const episode = anime.episodes[Number.parseInt(episodeIdx, 10)];

			const content = new Set([
				`${infoHash}/${episodeFileIdx}`,
				...(episode.content[resolution] ?? [])
			]);
			episode.content[resolution] = [...content.values()];
		}

		const content: AnimeContent = {
			episodes: anime.episodes.map((episode) => ({
				id: episode.id,
				content: episode.content
			}))
		};

		await fs.writeFile(filename, JSON.stringify(content, null, 2));

		spins.succeed(`save-anime-${name}`, {});
		torrent.destroy({ destroyStore: true });
	}

	client.destroy();
})();
