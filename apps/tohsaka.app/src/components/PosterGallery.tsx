import { Anime, AnimeArray } from "@tohsaka/types";
import useSWR from "swr";

const PosterItem: React.FC<{ anime: Anime }> = ({ anime }) => {
	const url = `https://api.tohsaka.app/anime/${anime.slug}/media/poster`;

	return (
		<div className="relative flex grow brightness-[.2] saturate-50">
			<div className="w-full absolute top-0 left-0 bg-black/40 blur-[3px] h-[10px] transform -translate-y-1/2" />
			<div className="w-[10px] absolute top-0 left-full bg-black/40 blur-[3px] h-full transform -translate-x-1/2" />
			<div
				className="h-screen w-full grow bg-cover bg-center md:h-96 md:w-64"
				style={{
					backgroundImage: `url(${url})`,
				}}
			/>
		</div>
	);
};

export const PosterGallery: React.FC = () => {
	const { data } = useSWR("anime", async () => {
		const response = await fetch("/api/anime");
		return response.ok ? AnimeArray.parseAsync(await response.json()) : [];
	});

	return (
		<div className="absolute top-0 left-0 -z-10 flex w-full flex-col md:fixed md:flex-row md:flex-wrap">
			{data?.map((anime) => (
				<PosterItem anime={anime} key={anime.slug} />
			))}
		</div>
	);
};
