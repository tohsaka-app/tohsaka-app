import { JSDOM } from "jsdom";

import { getShowById, Show } from "../../../utils/subsplease";

import type { NextApiRequest, NextApiResponse } from "next";

export async function getShow(slug: string): Promise<Show> {
	const response = await fetch(`https://subsplease.org/shows/${slug}/`);
	const {
		window: { document }
	} = new JSDOM(await response.text());

	const sid = document.querySelector("table[sid]")?.getAttribute("sid") || null;
	if (!sid) throw new ReferenceError(`Couldn't find sid from document: ${slug}`);

	return getShowById(Number.parseInt(sid), slug.toLowerCase());
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { slug } = req.query as { slug: string };
	res.json(await getShow(slug));
};
