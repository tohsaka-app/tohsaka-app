import { brotliCompressSync, brotliDecompressSync } from "zlib";

import { NodeCue } from "subtitle";

import { Subtitle } from ".";

export const SUBTITLE_SEPERATOR = "\n\u0000";

export function serialize({ data }: NodeCue): string {
	const text = data.text.replace(/<[^>]+>|{\\an?\d}/g, "");
	const pos = Number.parseInt(data.text.match(/{\\an?(\d)}/)?.[1] || "2", 10);

	return `${data.start},${data.end},${pos},${text}`;
}

export function serializeFile(values: Array<string>): Buffer {
	return brotliCompressSync(values.join(SUBTITLE_SEPERATOR));
}

export function deserialize(value: string): Subtitle {
	const [start, end, position, ...text] = value.split(",");

	return {
		ts: [Number.parseInt(start, 10), Number.parseInt(end, 10)],
		position: Number.parseInt(position, 10),
		text: text.join(",")
	};
}

export function deserializeFile(value: Buffer): Array<Subtitle> {
	return brotliDecompressSync(value)
		.toString("utf8")
		.split(SUBTITLE_SEPERATOR)
		.map((entry) => deserialize(entry));
}
