import { Anime } from "@tohsaka/types";
import fetch from "isomorphic-fetch";

export async function getAnime(slug: string): Promise<Anime | null> {
	const response = await fetch(`https://api.tohsaka.app/anime/${slug}`);
	return response.ok ? response.json() : null;
}

export async function searchAnime(title: string, count: number = 10): Promise<Array<Anime>> {
	const query = new URLSearchParams({
		count: count.toString(),
		title
	});

	query.sort();
	const url = `https://api.tohsaka.app/anime/search?${query.toString()}`;
	const response = await fetch(url);

	if (!response.ok) throw new Error("Request failed");
	return response.json();
}
