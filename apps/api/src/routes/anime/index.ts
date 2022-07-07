import { route, method } from "18h";
import { z } from "zod";

import { getAvailableAnime } from "../../utils/anime";

export default route({
	get: method({
		schema: {
			request: z.null(),
			response: z.any()
		},
		async handler() {
			return {
				status: 200,
				body: await getAvailableAnime()
			};
		}
	})
});
