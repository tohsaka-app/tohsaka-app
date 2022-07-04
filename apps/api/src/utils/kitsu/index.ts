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
import { request, gql } from "graphql-request";

import { getGithubFile } from "../github";

import { Anime as GraphqlAnime, Episode as GraphqlEpisode } from "./graphql";

export async function getAnimeContent(slug: string): Promise<AnimeContent> {
	return JSON.parse(
		await getGithubFile({
			owner: "tohsaka-app/tohsaka-app",
			pathname: `packages/anime/content/${slug}/episodes.json`,
			branch: "main"
		})
	);
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
			data.episodes.nodes!.map((node) => {
				const value = contents.find((cv) => cv.id === node!.id);
				return transformEpisode(node!, value?.content);
			})
		)
	};
}

export async function getAnime(slug: string): Promise<Anime | null> {
	const raw = (
		await request(
			"https://kitsu.io/api/graphql",
			gql`
				query getAnime($slug: String!) {
					findAnimeBySlug(slug: $slug) {
						slug
						titles {
							canonical
							romanized
							original
						}
						description
						subtype
						status
						ageRating
						startDate
						endDate
						bannerImage {
							original {
								url
							}
						}
						posterImage {
							original {
								url
							}
						}
						categories(first: 2000) {
							nodes {
								title
							}
						}
						streamingLinks(first: 10) {
							nodes {
								url
							}
						}
						episodes(first: 2000) {
							nodes {
								id
								titles {
									canonical
									romanized
									original
								}
								description
								number
								releasedAt
								thumbnail {
									original {
										url
									}
								}
							}
						}
					}
				}
			`,
			{
				slug
			}
		)
	).findAnimeBySlug;

	if (!raw) return null;
	return transformAnime(raw);
}
