import useSWR from "swr";

import { getAnime } from "../lib/api";

export function useAnime(slug?: string) {
	return useSWR(["show", slug], () => (slug ? getAnime(slug) : null));
}
