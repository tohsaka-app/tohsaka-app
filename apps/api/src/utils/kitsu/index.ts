import { Anime } from "@tohsaka/types";
import { request, gql } from "graphql-request";
import fetch from "isomorphic-fetch";
import { createClient } from "@urql/core";

import { Anime as GraphqlAnime } from "./graphql";

const client = createClient({
	url: "https://kitsu.io/api/graphql"
});

const AnimeGraphqlObject = gql`
	{
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
`;

export async function getAnime(slug: string): Promise<GraphqlAnime | null> {
	const { data } = await client
		.query(
			gql`
	query getAnime($slug: String!) {
		findAnimeBySlug(slug: $slug) ${AnimeGraphqlObject}
	}
`,
			{
				slug
			}
		)
		.toPromise();

	return data.findAnimeBySlug || null;
}

export async function searchAnimeByTitle(
	title: string,
	first: number = 10
): Promise<Array<GraphqlAnime>> {
	const { data } = await client
		.query(
			gql`
	query searchAnimeByTitle($title: String!, $first: Int!) {
		searchAnimeByTitle(title: $title, first: $first) {
			nodes ${AnimeGraphqlObject}
		}
	}
`,
			{
				title,
				first
			}
		)
		.toPromise();

	return data.searchAnimeByTitle.nodes;
}
