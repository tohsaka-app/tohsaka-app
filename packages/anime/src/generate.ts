/* eslint-disable import/no-named-as-default */
import prompts from "prompts";
import chalk from "chalk";
import { getTorrent } from "@tohsaka/torrent";
import { getAnime } from "@tohsaka/api-client";

function log(message: string, exit?: number) {
	console.log(message);
	if (exit) process.exit(exit);
}

void (async () => {
	const [slug, resolution, hash] = process.argv.slice(2);

	const anime = await getAnime(slug);
	if (!anime) return log(chalk.red(`Anime "${slug}" doesn't exist.`), -1);

	const { correct_anime, correct_resolution } = await prompts([
		{
			name: "correct_anime",
			type: "confirm",
			message: `Is "${chalk.yellow(anime.titles.canonical)}" the correct show?`
		},
		{
			name: "correct_resolution",
			type: "confirm",
			message: `Is "${chalk.yellow(resolution)}" the correct resolution?`
		}
	]);

	if (!correct_anime || !correct_resolution) return;
	const torrent = await getTorrent(hash);

	await prompts({
		name: "correct_torrent",
		type: "confirm",
		message: `Is "${chalk.yellow(torrent.name)}" the correct torrent?`
	});
})();
