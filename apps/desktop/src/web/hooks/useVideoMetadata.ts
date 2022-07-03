import useSWR from "swr";

import { LOCAL_API_URL } from "../lib/config";

export interface VideoMetadata {
	file: {
		name: string;
	};
	subtitles: Array<{
		id: number;
		type: string;
		data: {
			start: number;
			end: number;
			position: "top" | "bottom";
			text: string;
		};
	}>;
}

export function useVideoMetadata(hash?: string) {
	return useSWR<VideoMetadata>(["video", hash], async () => {
		if (!hash) return null;
		const response = await fetch(`${LOCAL_API_URL}/${hash}.json`);
		if (response.ok) return response.json();
		return null;
	});
}
