/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
	Anime,
	AnimeContent,
	AnimeRating,
	AnimeStatus,
	AnimeType,
	Episode,
	EpisodeContent
} from "@tohsaka/types";

import { getGithubFile } from "./github";
import { Anime as GraphqlAnime, Episode as GraphqlEpisode } from "./kitsu/graphql";
import * as kitsu from "./kitsu";
import { isFalsy } from "./isFalsy";

export async function getAnimeContent(slug: string): Promise<AnimeContent> {
	const value = await getGithubFile({
		owner: "tohsaka-app/tohsaka-app",
		pathname: `packages/anime/content/${slug}/episodes.json`,
		branch: "main"
	});

	return value ? JSON.parse(value) : [];
}

export async function transformEpisode(
	data: GraphqlEpisode,
	content: EpisodeContent = {}
): Promise<Episode> {
	return {
		id: data.id,
		titles: {
			canonical: data.titles.canonical,
			romanized: data.titles.romanized || null,
			original: data.titles.original || null
		},
		description: data.description?.en || null,
		number: data.number,
		released_at: data.releasedAt ? new Date(data.releasedAt).toISOString() : null,
		thumbnail_url: data.thumbnail?.original?.url || null,
		content
	};
}

export async function transformAnime(data: GraphqlAnime): Promise<Anime> {
	const slug = data.slug.toLowerCase();
	const contents = await getAnimeContent(slug);

	return {
		slug,
		titles: {
			canonical: data.titles.canonical,
			romanized: data.titles.romanized || null,
			original: data.titles.original || null
		},
		description: data.description?.en || null,
		type: data.subtype?.toUpperCase() as AnimeType,
		status: (data.status?.toUpperCase() as AnimeStatus) || "FINISHED",
		rating: (data.ageRating?.toUpperCase() as AnimeRating) || "G",
		released_at: data.startDate ? new Date(data.startDate).toISOString() : null,
		finished_at: data.endDate ? new Date(data.endDate).toISOString() : null,
		banner_url: data.bannerImage?.original?.url || null,
		poster_url: data.posterImage?.original?.url || null,
		categories: data.categories.nodes!.map((node) => node!.title.en),
		official_releases: data.streamingLinks.nodes!.map((node) => node!.url),
		episodes: await Promise.all(
			data.episodes.nodes!.filter(isFalsy).map((node) => {
				const value = contents.find((cv) => cv.id === node!.id);
				if (!node) console.log(data);
				return transformEpisode(node!, value?.content);
			})
		)
	};
}

export async function getAnime(slug: string): Promise<Anime | null> {
	const raw = await kitsu.getAnime(slug);

	if (!raw) return null;
	return transformAnime(raw);
}

export async function searchAnimeByTitle(title: string, first: number = 10): Promise<Array<Anime>> {
	const raw = await kitsu.searchAnimeByTitle(title, first);
	return Promise.all(raw.map((node) => transformAnime(node)));
}