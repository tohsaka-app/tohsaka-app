import { Anime } from "@tohsaka/types";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { getAvailableAnime } from "../../lib/api";
import { API_URL } from "../../lib/config";
import { AnimeInfoBox } from "../AnimeInfoBox";
import { AnimeListColumn } from "../AnimeListColumn";

export const Discover: React.FC = () => {
	const navigate = useNavigate();

	const { data: availableAnime } = useSWR("availableAnime", () => getAvailableAnime());
	const [selectedAnimeIdx, setSelectedAnimeIdx] = useState<number>(0);

	const selectedAnime: Anime | null = availableAnime ? availableAnime[selectedAnimeIdx] : null;
	console.log(selectedAnimeIdx, selectedAnime);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (!availableAnime) return;
			event.preventDefault();

			switch (event.key) {
				case "Enter":
					if (!selectedAnime) return;
					navigate(`/watch/${selectedAnime.slug}`);
					break;

				case "ArrowLeft":
					setSelectedAnimeIdx((selectedAnimeIdx) => {
						const newIdx = (selectedAnimeIdx - 1) % availableAnime.length;
						return newIdx < 0 ? availableAnime.length - 1 : newIdx;
					});
					break;
				case "ArrowRight":
					setSelectedAnimeIdx((selectedAnimeIdx) => (selectedAnimeIdx + 1) % availableAnime.length);
					break;
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [navigate, availableAnime, selectedAnimeIdx, selectedAnime]);

	console.log(availableAnime);

	return (
		<>
			<div className="pointer-events-none absolute -z-30 h-screen w-full bg-neutral-900">
				<div
					className="absolute h-screen w-full bg-cover bg-center blur-lg"
					style={{
						backgroundImage: `url(${API_URL}/anime/${selectedAnime?.slug}/media/banner)`
					}}
				/>
				<div className="absolute h-full w-full bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
			</div>
			<div className="flex h-screen w-full overflow-hidden">
				<aside className="flex flex-col p-8" />
				<div className="flex flex-col gap-16 py-16">
					{selectedAnime && <AnimeInfoBox slug={selectedAnime.slug} />}
					<div className="flex flex-col gap-4">
						{availableAnime && (
							<AnimeListColumn
								animes={availableAnime}
								key={0}
								selected={true}
								selectedAnimeIdx={selectedAnimeIdx}
								title="Available Anime"
							/>
						)}
					</div>
				</div>
			</div>
		</>
	);
};
