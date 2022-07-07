import { z } from "zod";

import { Episode } from "./episode";

export const AnimeContent = z.object({
	episodes: z.array(
		z.object({
			id: Episode.shape.id,
			content: Episode.shape.content
		})
	)
});

export type AnimeContent = z.infer<typeof AnimeContent>;
