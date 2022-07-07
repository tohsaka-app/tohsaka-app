import { Anime } from "@tohsaka/types";
import { API_URL } from "../lib/config";

export interface AnimeListItemProps {
	anime: Anime;
	selected: boolean;
}

export const AnimeListItem: React.FC<AnimeListItemProps> = ({ anime, selected }) => {
	return (
		<li className={`flex shrink-0 border-2 ${selected ? "border-white" : "border-transparent"}`}>
			<a href={`/watch/${anime.slug}`}>
				<img className="h-64 w-full" src={`${API_URL}/anime/${anime?.slug}/media/poster`} />
			</a>
		</li>
	);
};
