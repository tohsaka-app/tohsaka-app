import { NextApiRequest, NextApiResponse } from "next";
import { getGithubFile } from "../../../../utils/github";
import { getAnime } from "../../../../utils/kitsu";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { slug } = req.query as { slug: string };
	res.json(await getAnime(slug));
};
