import { PartialShow } from "../lib/api";

export interface ShowListItemProps {
	show: PartialShow;
	selected: boolean;
}

export const ShowListItem: React.FC<ShowListItemProps> = ({ show, selected }) => {
	return (
		<li className={`flex shrink-0 border-2 ${selected ? "border-white" : "border-transparent"}`}>
			<a href={`/watch/${show.slug}`}>
				<img className="h-64 w-full" src={`https://subsplease.org${show.poster_url}`} />
			</a>
		</li>
	);
};
