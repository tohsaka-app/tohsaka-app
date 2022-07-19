import { Anime, AnimeArray } from "@tohsaka/types";
import { useEffect, useState } from "react";
import useSWR from "swr";

const PosterItem: React.FC<{ anime: Anime }> = ({ anime }) => {
	const url = `https://api.tohsaka.app/anime/${anime.slug}/media/poster`;

	return (
		<div
			className="h-screen w-full grow bg-cover bg-center blur-sm md:h-96 md:w-64"
			style={{
				backgroundImage: `url(${url})`
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
		<div className="fixed top-0 left-0 -z-10 flex w-full flex-col brightness-[.2] md:flex-row md:flex-wrap">
			{data?.map((anime) => (
				<PosterItem anime={anime} key={anime.slug} />
			))}
		</div>
	);
};
