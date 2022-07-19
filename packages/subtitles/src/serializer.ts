import { NodeCue } from "subtitle";

import { convertLegacyAlignment, Subtitle, SubtitleAlignment, SubtitleLegacyAlignment } from ".";

function parseLegacyAlignment(
	value: string
): SubtitleLegacyAlignment[keyof SubtitleLegacyAlignment] | null {
	return (Number.parseInt(value.match(/{\\a(\d)}/)?.[1] || "", 10) ||
		null) as SubtitleLegacyAlignment[keyof SubtitleLegacyAlignment];
}

export function parseAlignment(value: string): SubtitleAlignment[keyof SubtitleAlignment] {
	const legacyAlignment = parseLegacyAlignment(value);
	if (legacyAlignment) return convertLegacyAlignment(legacyAlignment);

	return (Number.parseInt(value.match(/{\\an(\d)}/)?.[1] || "", 10) ||
		SubtitleAlignment.BOTTOM_CENTER) as SubtitleAlignment[keyof SubtitleAlignment];
}

export function parse({ data }: NodeCue): Subtitle {
	const text = data.text.replace(/<[^>]+>|{\\an?\d}/g, "");
	const align = parseAlignment(data.text);

	console.log(align, data.text);

	return {
		align,
		ts: [data.start, data.end],
		text
	};
}
