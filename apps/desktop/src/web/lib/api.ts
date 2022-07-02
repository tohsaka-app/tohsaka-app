// eslint-disable-next-line import/no-named-as-default
import MagnetUri from "magnet-uri";

import { API_URL } from "./config";

export type TitleLanguage = "english" | "romaji";
export enum Quality {
	LOW = 480,
	MEDIUM = 720,
	HIGH = 1080
}

export type Content = { [K in Quality]: string };

export interface ShowEpisode {
	name: string;
	released_at: string;
	content: Content;
}

export type Title = { [K in TitleLanguage]: string };

export interface PartialShow {
	title: Title;
	slug: string;
	poster_url: string;
}

export interface Show {
	title: string;
	slug: string;
	episodes: Array<ShowEpisode>;
}

export type Day =
	| "monday"
	| "tuesday"
	| "wednesday"
	| "thursday"
	| "friday"
	| "saturday"
	| "sunday";

export type Schedule = {
	[K in Day]: Array<{
		at: string;
		show: PartialShow;
	}>;
};

export function getHashFromMagnet(magnetUri: string): string {
	const xt = MagnetUri.decode(magnetUri).xt;
	return (Array.isArray(xt) ? xt[0] : xt)?.slice(9).toLowerCase() || "";
}

export async function getShow(slug: string): Promise<Show | null> {
	const response = await fetch(`${API_URL}/api/show/${slug}`);
	return response.json() || null;
}

export async function getSchedule(): Promise<Schedule> {
	const response = await fetch(`${API_URL}/api/schedule`);
	return response.json();
}
