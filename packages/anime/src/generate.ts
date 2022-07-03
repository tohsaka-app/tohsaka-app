import fs from "fs/promises";

import Kitsu from "kitsu";

import { serialize, serializeEpisode } from "./serializer";

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
	let idx = 0;
	let count = Infinity;

	while (!(idx >= count / 20)) {
		const { data, meta } = await kitsu.get("anime", {
			params: {
				page: {
					limit: 20,
					offset: idx * 20
				},
				fields: {
					anime: "slug"
				}
			}
		});

		await generateFiles(data.map((value: any) => value.slug));

		count = meta.count;
		idx++;

		console.log(idx * 20, count, `${(((idx * 20) / count) * 100).toFixed(2)}% done`);
	}
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
			console.log(`created new file "${slug}"`);

			// eslint-disable-next-line @typescript-eslint/no-empty-function
			await fs.mkdir(dirname, { recursive: true }).catch(() => {});

			await fs.writeFile(`${dirname}/kitsu.json`, JSON.stringify(show, null, 2));
			await fs.writeFile(`${dirname}/episodes.json`, JSON.stringify(episodes, null, 2));
		})
	);
}
