import { z } from "zod";

import { Date } from "./date";
import { Titles } from "./titles";

export const EpisodeContent = z.record(z.string(), z.array(z.string()));
export type EpisodeContent = z.infer<typeof EpisodeContent>;

export const Episode = z.object({
	id: z.string(),
	titles: Titles,
	description: z.string().nullable(),
	number: z.number(),
	thumbnail_url: z.string().url().nullable(),
	released_at: Date.nullable(),
	content: EpisodeContent
});

export type Episode = z.infer<typeof Episode>;
