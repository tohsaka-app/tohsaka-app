import { route, method } from "18h";
import { z } from "zod";

import { searchAnimeByTitle } from "../../utils/anime";

export default route({
	get: method({
		schema: {
			request: z.null(),
			response: z.any()
		},
		async handler(ctx) {
			const { title, n } = ctx.query;
			if (typeof title !== "string" || (n && typeof n !== "string")) return ctx.throw(400);

			return {
				status: 200,
				body: await searchAnimeByTitle(title, n ? Number.parseInt(n, 10) : 10)
			};
		}
	})
});
