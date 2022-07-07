import { z } from "zod";

import { Date } from "./date";
import { Episode } from "./episode";
import { Titles } from "./titles";

export const AnimeType = z.preprocess((value) => {
	if (typeof value === "string") return value.toUpperCase();
}, z.enum(["ONA", "OVA", "TV", "MOVIE", "SPECIAL"] as const));
export type AnimeType = z.infer<typeof AnimeType>;

export const AnimeStatus = z.preprocess((value) => {
	if (typeof value === "string") return value.toUpperCase();
}, z.enum(["CURRENT", "FINISHED", "TBA", "UNRELEASED", "UPCOMING"] as const));
export type AnimeStatus = z.infer<typeof AnimeStatus>;

export const AnimeRating = z.preprocess((value) => {
	if (typeof value === "string") return value.toUpperCase();
}, z.enum(["G", "PG", "R", "R18"] as const));
export type AnimeRating = z.infer<typeof AnimeRating>;

export const Anime = z.object({
	slug: z.string().transform((value) => value.toLowerCase()),
	titles: Titles,
	description: z.string().nullable(),
	type: AnimeType,
	status: AnimeStatus,
	rating: AnimeRating,
	released_at: Date.nullable(),
	finished_at: Date.nullable(),
	banner_url: z.string().url().nullable(),
	categories: z.array(z.string()),
	official_releases: z.array(z.string()),
	episodes: z.array(Episode)
});

export type Anime = z.infer<typeof Anime>;

export const AnimeArray = z.array(Anime);
export type AnimeArray = z.infer<typeof AnimeArray>;
