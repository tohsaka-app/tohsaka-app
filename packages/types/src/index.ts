export interface Titles {
	canonical: string;
	romanized: string | null;
	original: string | null;
}

export const AnimeType = ["ONA", "OVA", "TV", "MOVIE", "SPECIAL"] as const;
export type AnimeType = typeof AnimeType[number];

export const AnimeStatus = ["CURRENT", "FINISHED", "TBA", "UNRELEASED", "UPCOMING"] as const;
export type AnimeStatus = typeof AnimeStatus[number];

export const AnimeRating = ["G", "PG", "R", "R18"] as const;
export type AnimeRating = typeof AnimeRating[number];

export interface EpisodeContent {
	[k: string]: Array<string>;
}

export interface AnimeContent {
	episodes: Array<{
		/** The episode primary identifier */
		id: string;

		/** An object containing content references */
		content: EpisodeContent;
	}>;
}

export interface Episode {
	/** The primary identifier */
	id: string;

	/** The titles for this media in various locales */
	titles: Titles;

	/** A brief summary or description */
	description: string | null;

	/** The sequence number */
	number: number;

	/** The thumbnail image url */
	thumbnail_url: string | null;

	/** The date this episode aired */
	released_at: string | null;

	content: EpisodeContent;
}

export interface Anime {
	/** A URL-friendly identifier */
	slug: string;

	/** The titles for this media in various locales */
	titles: Titles;

	/** A brief (mostly spoiler free) summary or description of the media */
	description: string | null;

	/** The content type */
	type: AnimeType;

	/** The current releasing status */
	status: AnimeStatus;

	/** The recommended minimum age group */
	rating: AnimeRating;

	/** The day that this first released */
	released_at: string | null;

	/** The day that the final episode released */
	finished_at: string | null;

	/** The banner image url */
	banner_url: string | null;

	/** The poster image url */
	poster_url: string | null;

	/** A list of categories */
	categories: Array<string>;

	/** A list of official ways to watch this anime */
	official_releases: Array<string>;

	/** A list of available episodes */
	episodes: Array<Episode>;
}
