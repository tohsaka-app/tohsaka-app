import { z } from "zod";

export const Titles = z.object({
	canonical: z.string(),
	romanized: z.string().nullable(),
	original: z.string().nullable()
});

export type Titles = z.infer<typeof Titles>;
