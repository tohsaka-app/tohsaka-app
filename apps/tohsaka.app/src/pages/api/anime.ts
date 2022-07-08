import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const response = await fetch("https://api.tohsaka.app/anime/search?title=&n=14");
	if (!response.ok) res.status(400).json([]);

	res.status(200).json(await response.json());
}
