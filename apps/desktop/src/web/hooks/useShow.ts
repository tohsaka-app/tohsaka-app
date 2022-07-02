import useSWR from "swr";

import { getShow } from "../lib/api";

export function useShow(slug?: string) {
	return useSWR(["show", slug], () => (slug ? getShow(slug) : null));
}
