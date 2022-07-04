import { route, method } from "18h";
import { z } from "zod";

import { getAnime } from "../../utils/kitsu";

export default route<{ slug: string }>({
	get: method({
		schema: {
			request: z.null(),
			response: z.any()
		},
		async handler(ctx) {
			const anime = await getAnime(ctx.params.slug);
			if (!anime)
				return {
					status: 404,
					body: null
				};

			return {
				status: 200,
				body: anime
			};
		}
	})
});
