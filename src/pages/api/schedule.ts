import { getSchedule } from "../../utils/subsplease";

import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	res.json(await getSchedule());
};
