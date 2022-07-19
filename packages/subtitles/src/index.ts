export const SubtitleAlignment = {
	TOP_LEFT: 7,
	TOP_CENTER: 8,
	TOP_RIGHT: 9,
	MIDDLE_LEFT: 4,
	MIDDLE_CENTER: 5,
	MIDDLE_RIGHT: 6,
	BOTTOM_LEFT: 1,
	BOTTOM_CENTER: 2,
	BOTTOM_RIGHT: 3
} as const;

export type SubtitleAlignment = typeof SubtitleAlignment;

export const SubtitleLegacyAlignment = {
	TOP_LEFT: 5,
	TOP_CENTER: 6,
	TOP_RIGHT: 7,
	MIDDLE_LEFT: 9,
	MIDDLE_CENTER: 10,
	MIDDLE_RIGHT: 11,
	BOTTOM_LEFT: 1,
	BOTTOM_CENTER: 2,
	BOTTOM_RIGHT: 3
} as const;

export type SubtitleLegacyAlignment = typeof SubtitleAlignment;

export function convertLegacyAlignment(
	legacyAlignment: SubtitleLegacyAlignment[keyof SubtitleLegacyAlignment]
): SubtitleAlignment[keyof SubtitleAlignment] {
	const legacyAlignmentName = getLegacyAlignmentName(legacyAlignment);
	return SubtitleAlignment[legacyAlignmentName];
}

export function getLegacyAlignmentName(
	legacyAlignment: SubtitleLegacyAlignment[keyof SubtitleLegacyAlignment]
): keyof SubtitleLegacyAlignment {
	return (Object.entries(SubtitleLegacyAlignment).find(
		([, value]) => value === legacyAlignment
	)?.[0] || "BOTTOM_CENTER") as keyof SubtitleLegacyAlignment;
}

export function getAlignmentName(
	alignment: SubtitleAlignment[keyof SubtitleAlignment]
): keyof SubtitleAlignment {
	return (Object.entries(SubtitleAlignment).find(([, value]) => value === alignment)?.[0] ||
		"BOTTOM_CENTER") as keyof SubtitleAlignment;
}

export interface Subtitle {
	ts: [start: number, end: number];
	align: SubtitleAlignment[keyof SubtitleAlignment];
	text: string;
}

export * from "./serializer";
