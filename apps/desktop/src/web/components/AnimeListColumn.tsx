import { AnimeArray } from "@tohsaka/types";
import { useMemo } from "react";

import { AnimeListItem } from "./AnimeListItem";

export interface AnimeListColumnProps {
	title: string;
	animes: AnimeArray;
	selected: boolean;
	selectedAnimeIdx: number;
}

export const AnimeListColumn: React.FC<AnimeListColumnProps> = (props) => {
	const items = useMemo(
		() => [...props.animes, ...props.animes, ...props.animes].slice(props.selectedAnimeIdx),
		[props.selectedAnimeIdx, props.animes]
	);

	return (
		<div className="flex flex-col gap-2">
			<span className="font-bebas text-4xl text-white">{props.title}</span>
			<ul className="flex gap-2 overflow-x-hidden">
				{items.map((anime, idx) => (
					<AnimeListItem
						anime={anime}
						key={anime.slug}
						selected={props.selected && idx === props.selectedAnimeIdx}
					/>
				))}
			</ul>
		</div>
	);
};
