import { NextApiRequest, NextApiResponse } from "next";

import { getAnime } from "../../../../utils/kitsu";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { slug } = req.query as { slug: string };
	res.json(await getAnime(slug));
};
