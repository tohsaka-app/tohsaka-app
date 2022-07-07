import { z } from "zod";

export const Date = z.preprocess((value) => {
	if (value instanceof globalThis.Date) return value;
	if (typeof value === "string") return new globalThis.Date(value);
}, z.date());

export type Date = z.infer<typeof Date>;
