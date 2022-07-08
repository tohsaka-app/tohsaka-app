import { Anime, AnimeArray } from "@tohsaka/types";
import useSWR from "swr";

const PosterItem: React.FC<{ anime: Anime }> = ({ anime }) => {
	return (
		<div
			className="h-96 w-64 grow bg-cover bg-center"
			style={{
				backgroundImage: `url(${`https://api.tohsaka.app/anime/${anime.slug}/media/poster`})`
			}}
		/>
	);
};

export const PosterGallery: React.FC = () => {
	const { data } = useSWR("anime", async () => {
		const response = await fetch("/api/anime");
		return response.ok ? AnimeArray.parseAsync(await response.json()) : [];
	});

	return (
		<div className="fixed -z-10 flex flex-wrap brightness-50 blur-sm">
			{data?.map((anime, idx) => (
				<PosterItem anime={anime} key={anime.slug} />
			))}
		</div>
	);
};
