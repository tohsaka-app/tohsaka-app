import { Episode, Show } from ".";

export function serializeEpisode(data: any): Episode {
	return {
		id: data.id,
		title: {
			en: data.titles.en,
			jp: data.titles.en_jp
		},
		synopsis: data.synopsis || void 0,
		season: data.seasonNumber || 1,
		number: data.number,
		thumbUrl: data.thumbnail?.original,
		releasedAt: data.airdate ? new Date(data.airdate).toISOString() : void 0,
		content: {}
	};
}

export function serialize(data: any): Show {
	return {
		slug: data.slug.toLowerCase(),
		synopsis: data.synopsis,
		title: {
			en: data.titles.en,
			jp: data.titles.en_jp
		},

		releasedAt: data.startDate ? new Date(data.startDate).toISOString() : void 0,
		finishedAt: data.endDate ? new Date(data.endDate).toISOString() : void 0,

		kind: data.subtype.toLowerCase(),
		status: data.status.toLowerCase(),
		rating: data.ageRating?.toLowerCase() || "g",
		posterUrl: data.posterImage?.original,
		coverUrl: data.coverImage?.original,
		categories: data.categories.data.map((value: any) => value.title.toLowerCase()).sort(),
		externals: data.streamingLinks.data.map((value: any) => value.url).sort(),
		relations: {
			kitsu: data.id,
			...Object.fromEntries(
				data.mappings.data
					.sort((a: any, b: any) => {
						if (a.externalSite > b.externalSite) return 1;
						return -1;
					})
					.map((value: any) => [value.externalSite, value.externalId])
			)
		}
	};
}
