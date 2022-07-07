import { route, method } from "18h";
import { z } from "zod";
import fetch from "node-fetch";

import { getAnimeMedia } from "../../../../utils/anime";

export default route<{ slug: string; kind: string }>({
	get: method({
		schema: {
			request: z.null(),
			response: z.any()
		},
		async handler(ctx) {
			const media_url = await getAnimeMedia(ctx.params.slug, ctx.params.kind);
			if (!media_url) return ctx.throw(404, "No image available");

			const response = await fetch(media_url);
			if (!response.body) return ctx.throw(404, "No image content available");

			response.body.pipe(ctx.res);

			ctx.respond = false;
			return {
				status: 200,
				body: null,
				headers: {
					"content-type": response.headers.get("content-type") as string,
					"content-length": response.headers.get("content-length") as string,
					"cache-control": "max-age=3600",
					foo: "bar"
				}
			};
		}
	})
});
