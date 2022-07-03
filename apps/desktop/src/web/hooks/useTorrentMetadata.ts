import useSWR from "swr";

import { LOCAL_API_URL } from "../lib/config";

export interface TorrentMetadata {
	speed: {
		upload: number;
		download: number;
	};
}

export function useTorrentMetadata() {
	return useSWR<TorrentMetadata>(
		"info",
		async () => {
			const response = await fetch(`${LOCAL_API_URL}/info`);
			if (response.ok) return response.json();
			return null;
		},
		{
			refreshInterval: 1
		}
	);
}
