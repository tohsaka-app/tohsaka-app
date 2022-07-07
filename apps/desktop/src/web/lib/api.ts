import { Anime, AnimeArray } from "@tohsaka/types";

import { API_URL } from "./config";

export async function getAnime(slug: string): Promise<Anime | null> {
	const response = await fetch(`${API_URL}/anime/${slug}`);
	return response.ok ? Anime.parseAsync(response.json()) : null;
}

export async function getAvailableAnime(): Promise<AnimeArray> {
	const response = await fetch(`${API_URL}/anime`);
	return response.ok ? AnimeArray.parseAsync(response.json()) : [];
}
