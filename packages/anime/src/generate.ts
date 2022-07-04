import fs from "fs/promises";

import Kitsu from "kitsu";
import ms from "ms";

import { serialize, serializeEpisode } from "./serializer";

import { Episode, Show } from ".";

const kitsu = new Kitsu({});

export async function generate(slug: string) {
	const includes = ["categories", "mappings", "episodes", "streamingLinks"];
	const { data } = await kitsu.get("anime", {
		params: {
			filter: {
				slug
			},
			fields: {
				anime: [
					"slug",
					"synopsis",
					"titles",
					"startDate",
					"endDate",
					"ageRating",
					"subtype",
					"status",
					"posterImage",
					"coverImage",
					...includes
				].join(),
				categories: "title",
				mappings: ["externalSite", "externalId"].join(),
				episodes: ["synopsis", "titles", "seasonNumber", "number", "airdate", "thumbnail"].join(),
				streamingLinks: "url"
			},
			include: includes.join()
		}
	});

	return [serialize(data[0]), data[0].episodes.data.map(serializeEpisode)];
}

export async function generateAvailable() {
	const limit = 20;

	const { meta } = await kitsu.get("anime", {});

	const total = meta.count;
	console.log(`A rough total of ${total} available shows`);
	const startTs = performance.now();

	await Promise.all(
		new Array(Math.ceil(total / limit)).fill(1).map(async (_, idx) => {
			await new Promise((resolve) => setTimeout(resolve, idx * 100));

			const includes = ["categories", "mappings", "episodes", "streamingLinks"];
			const { data } = await kitsu.get("anime", {
				params: {
					page: {
						limit: limit,
						offset: idx * limit
					},
					sort: "slug",
					fields: {
						anime: [
							"slug",
							"synopsis",
							"titles",
							"startDate",
							"endDate",
							"ageRating",
							"subtype",
							"status",
							"posterImage",
							"coverImage",
							...includes
						].join(),
						categories: "title",
						mappings: ["externalSite", "externalId"].join(),
						episodes: [
							"synopsis",
							"titles",
							"seasonNumber",
							"number",
							"airdate",
							"thumbnail"
						].join(),
						streamingLinks: "url"
					},
					include: includes.join()
				}
			});

			await Promise.all(
				data.map(async (value: any) => {
					const episodes = await Promise.all(
						value.episodes.data.map(async (data: unknown) => {
							const episode = serializeEpisode(data);
							const key = `${episode.season}-${episode.number}`;
							const diskEpisodes: Array<Episode> = JSON.parse(
								await fs
									.readFile(`./content/${value.slug.toLowerCase()}/episodes.json`, "utf-8")
									.catch(() => "[]")
							);

							const matchedDiskEpisode = diskEpisodes.find((diskEpisode) => {
								const diskKey = `${diskEpisode.season}-${diskEpisode.number}`;
								console.log({ diskKey, key });
								return diskKey === key;
							});

							if (matchedDiskEpisode) episode.content = matchedDiskEpisode.content;
							return episode;
						})
					);

					await writeFiles(serialize(value), episodes, true);
				})
			);
		})
	).catch((reason) => {
		console.error(reason);
		process.exit(-1);
	});

	console.log(`finished in ${ms(performance.now() - startTs, { long: true })}`);
}

export async function writeFiles(show: Show, episodes: Array<Episode>, override?: boolean) {
	const slug = show.slug.toLowerCase();
	const dirname = `./content/${slug}`;

	const exists = await fs.stat(dirname).catch(() => false);
	if (exists && !override) return console.log(`file "${slug}" already exists`);

	console.log(`${exists ? "modifed" : "created new"} file "${slug}"`);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	await fs.mkdir(dirname, { recursive: true }).catch(() => {});

	await fs.writeFile(`${dirname}/kitsu.json`, JSON.stringify(show, null, 2));
	await fs.writeFile(`${dirname}/episodes.json`, JSON.stringify(episodes, null, 2));
}

export async function generateFiles(slugs: Array<string>) {
	await Promise.all(
		slugs.map(async (slug) => {
			slug = slug.toLowerCase();
			const dirname = `./content/${slug}`;

			if (await fs.stat(dirname).catch(() => false)) {
				console.log(`file "${slug}" already exists`);
				return;
			}

			const [show, episodes] = await generate(slug);
			await writeFiles(show, episodes);
		})
	);
}
