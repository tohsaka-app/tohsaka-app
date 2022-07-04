/* eslint-disable import/no-named-as-default */
import { si } from "nyaapi";
import { searchAnime } from "@tohsaka/api-client";
import prompts from "prompts";
import chalk from "chalk";
import Spinner from "spinnies";
const NAME_REGEX = /\w] (?<name>.+) \(\d+-\d+\) \((?<resolution>\d+)p\)/;

const spins = new Spinner();

void (async () => {
	spins.add("load-torrents", { text: "Loading available torrents..." });

	const results = (
		await si
			.searchAllByUser("subsplease", "batch", {
				category: "1_2",
				filter: 2
			})
			.catch(() => {
				spins.fail("load-torrents");
				process.exit(-1);
			})
	)
		.sort((a, b) => {
			if (Number.parseInt(a.seeders, 10) > Number.parseInt(b.seeders, 10)) return -1;
			return 1;
		})
		.slice(0, 10);

	spins.succeed("load-torrents");
	console.log(chalk.gray(`A total of ${results.length} torrents available;`));

	for (const node of results) {
		const match = node.name.match(NAME_REGEX);
		if (!match)
			return console.log(`Skipping "${node.name}" since the name didn't match the proper format`);

		const { name, resolution } = match.groups as { name: string; resolution: string };

		spins.add(`load-anime-${name}`, { text: `Querying for "${name}"...` });

		const animes = await searchAnime(name);

		spins.succeed(`load-anime-${name}`, {});
		console.log(chalk.gray(`A total of ${animes.length} matched this title,`));

		await prompts({
			name: "select_anime",
			type: "select",
			message: `Choose the correct anime for "${node.name}"`,
			choices: animes.map((anime) => ({
				title: anime.titles.canonical,
				description: anime.description || void 0
			}))
		});
	}
})();
