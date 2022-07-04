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
			const { title } = ctx.query;
			if (typeof title !== "string") return ctx.throw(400);

			return {
				status: 200,
				body: await searchAnimeByTitle(title)
			};
		}
	})
});
