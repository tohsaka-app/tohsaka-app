import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const response = await fetch("https://subsplease.org/api/?f=latest&tz=UTC");
	const json = await response.json();

	res.json(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Object.values(json).map((value: any) => ({
			show: value.show,
			episode: value.episode,
			slug: `${value.page}/${value.episode}`,
			released_at: new Date(value.release_date).toISOString()
		}))
	);
};
