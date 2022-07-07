import { route, method } from "18h";
import { z } from "zod";

import { getAnimeSubtitles } from "../../../utils/anime";

export default route<{ slug: string }>({
	get: method({
		schema: {
			request: z.null(),
			response: z.any()
		},
		async handler(ctx) {
			const anime = await getAnimeSubtitles(ctx.params.slug);
			if (!anime) return ctx.throw(404);

			return {
				status: 200,
				body: anime
			};
		}
	})
});
