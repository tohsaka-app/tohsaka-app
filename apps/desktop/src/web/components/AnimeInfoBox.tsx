import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { useAnime } from "../hooks/useAnime";

import { Button } from "./Button";
import { Span } from "./Span";

export interface AnimeInfoBoxProps {
	slug: string;
	detailed?: {
		activeEpisodeIdx: number;
		selectedEpisodeIdx: number;
	};
}
export const AnimeInfoBox: React.FC<AnimeInfoBoxProps> = ({ slug, detailed }) => {
	const { data: anime } = useAnime(slug);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<div className="font-bebas flex flex-col gap-1 text-white">
					<Span className="font-sans font-bold" placeholder={{ length: 24, loading: !anime }}>
						{anime?.titles.canonical || ""}
					</Span>
					<Span className="text-6xl" placeholder={{ length: 24, loading: !anime }}>
						{anime?.titles.romanized}
					</Span>
				</div>
				<Span className="max-w-[64ch] text-white" placeholder={{ length: 256, loading: !anime }}>
					{anime?.description}
				</Span>
			</div>
			{detailed ? (
				<div className="mt-4 flex flex-col gap-4">
					<span className="text-white">Episodes</span>
					<ul className="flex flex-col gap-2">
						{anime?.episodes.map((episode, idx) => (
							<li
								key={episode.id}
								className={twMerge(
									idx === detailed.selectedEpisodeIdx && "border",
									idx === detailed.activeEpisodeIdx && "border border-red-400"
								)}
							>
								<span className="text-white">{episode.titles.canonical}</span>
							</li>
						))}
					</ul>
				</div>
			) : (
				<div className="flex gap-2">
					<Link to={`/watch/${slug}`}>
						<Button>
							<svg className="h-6 w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
								<path d="M0 0h24v24H0z" fill="none" />
								<path
									d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
									fill="currentColor"
								/>
							</svg>
							<span>Watch now</span>
						</Button>
					</Link>
					<Button secondary>More information</Button>
				</div>
			)}
		</div>
	);
};
