import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { useShow } from "../hooks/useShow";

import { Button } from "./Button";
import { Span } from "./Span";

export interface ShowInfoBoxProps {
	slug: string;
	detailed?: {
		activeEpisodeIdx: number;
		selectedEpisodeIdx: number;
	};
}
export const ShowInfoBox: React.FC<ShowInfoBoxProps> = ({ slug, detailed }) => {
	const { data: show } = useShow(slug);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1 font-bebas text-white">
					<Span className="font-sans font-bold" placeholder={{ length: 24, loading: !show }}>
						{show?.title}
					</Span>
					<Span className="text-6xl" placeholder={{ length: 24, loading: !show }}>
						{"Vivamus accumsan ante"}
					</Span>
				</div>
				<Span className="max-w-[48ch] text-white" placeholder={{ length: 256, loading: !show }}>
					{`Sed iaculis arcu arcu, et semper sem lobortis eget. Donec in mauris a quam ullamcorper accumsan. Mauris convallis consequat auctor. In auctor, neque sed dictum porttitor, libero odio pretium nisl, nec malesuada metus nibh ut augue. Phasellus sodales nunc nec justo euismod, non aliquet justo laoreet. Integer scelerisque nec augue eget aliquet. Cras efficitur, nisi facilisis aliquet vulputate, est quam gravida mauris, a lacinia dui ex ac felis. In tincidunt sed ipsum eu feugiat. Nullam et dictum dolor.`.slice(
						0,
						256
					)}
					...
				</Span>
			</div>
			{detailed ? (
				<div className="mt-4 flex flex-col gap-4">
					<span className="text-white">Episodes</span>
					<ul className="flex flex-col gap-2">
						{show?.episodes.map((episode, idx) => (
							<li
								key={episode.name}
								className={twMerge(
									idx === detailed.selectedEpisodeIdx && "border",
									idx === detailed.activeEpisodeIdx && "border border-red-400"
								)}
							>
								<span className="text-white">{episode.name}</span>
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
