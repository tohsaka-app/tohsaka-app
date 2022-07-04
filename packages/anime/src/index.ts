export type Title = Record<"en" | "jp", string>;
export type Resolution = 480 | 720 | 1080;

export const Kind = ["ona", "ova", "tv", "movie", "special"] as const;
export type Kind = typeof Kind[number];

export const Status = ["current", "finished", "tba", "unreleased", "upcoming"] as const;
export type Status = typeof Kind[number];

export const Rating = ["g", "pg", "r", "r18"] as const;
export type Rating = typeof Rating[number];

export interface Episode {
	title: Partial<Title>;
	synopsis?: string;
	season: number;
	number: number;
	thumbUrl?: string;
	releasedAt?: string;
	content: Partial<Record<Resolution, string>>;
}

export interface Show {
	slug: string;
	title: Title;
	synopsis: string;

	releasedAt?: string;
	finishedAt?: string;

	kind: Kind;
	status: Status;
	rating: Rating;

	posterUrl?: string;
	coverUrl?: string;
	categories: Array<string>;
	externals: Array<string>;
	relations: Record<string, string>;
}
