import MagnetUri from "magnet-uri";

const url = (pathname: string) => `https://subsplease.org/api/?f=${pathname}&tz=America/Edmonton`;

export type TitleLanguage = "english" | "romaji";

export interface ShowEpisode {
	name: string;
	released_at: string;
	content: Record<string, string>;
}

export interface PartialShow {
	title: { [K in TitleLanguage]: string };
	slug: string;
	poster_url: string;
}

export interface Show {
	title: { [K in TitleLanguage]: string };
	slug?: string;
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

export async function getShow(slug: string): Promise<Show> {
	console.log(process.browser);
	const response = await fetch(`/api/show/${slug}`);
	return response.json();
}

export async function getShowById(sid: number, slug?: string): Promise<Show> {
	const response = await fetch(url(`show&sid=${sid}`));
	const json = await response.json();

	return {
		title: (Object.values(json.episode) as any)[0].show,
		slug,
		episodes: Object.values(json.episode)
			.map((episode: any) => ({
				name: episode.episode,
				released_at: new Date(episode.release_date).toISOString(),
				content: Object.fromEntries(
					episode.downloads.map((download: any) => [
						download.res,
						getHashFromMagnet(download.magnet)
					])
				)
			}))
			.reverse()
	};
}

export async function getSchedule(): Promise<Schedule> {
	const response = await fetch(url("schedule"));
	const json = await response.json();

	return Object.fromEntries(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		Object.entries(json.schedule).map(([day, shows]: [string, any]) => {
			return [
				day.toLowerCase() as Day,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				shows.map((show: any) => {
					const date = new Date();
					return {
						at: date.toISOString(),
						show: {
							title: {
								english: "",
								romaji: show.title
							},
							slug: show.page,
							poster_url: show.image_url
						}
					};
				})
			];
		})
	) as Schedule;
}
