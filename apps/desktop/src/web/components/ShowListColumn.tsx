import { useMemo } from "react";

import { PartialShow } from "../lib/api";

import { ShowListItem } from "./ShowListItem";

export interface ShowListColumnProps {
	title: string;
	shows: Array<PartialShow>;
	selected: boolean;
	selectedShowIdx: number;
}

export const ShowListColumn: React.FC<ShowListColumnProps> = (props) => {
	const items = useMemo(
		() => [...props.shows, ...props.shows, ...props.shows].slice(props.selectedShowIdx),
		[props.selectedShowIdx, props.shows]
	);

	return (
		<div className="flex flex-col gap-2">
			<span className="font-bebas text-4xl text-white">{props.title}</span>
			<ul className="flex overflow-x-hidden gap-2">
				{items.map((show, idx) => (
					<ShowListItem
						key={`${show.slug}-${idx}`}
						selected={props.selected && idx === 0}
						show={show}
					/>
				))}
			</ul>
		</div>
	);
};
