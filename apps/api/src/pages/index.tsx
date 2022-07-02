import { PropsWithChildren, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";

import { Day, getSchedule, PartialShow, Schedule, Show } from "../utils/subsplease";

import type { NextPage } from "next";

const ShowListItem: React.FC<{ show: PartialShow; selected: boolean }> = ({ show, selected }) => {
	return (
		<li className={`flex shrink-0 border-2 ${selected ? "border-white" : "border-transparent"}`}>
			<Link href={`/watch/${show.slug}`}>
				<a>
					<img className="w-full h-64" src={`https://subsplease.org${show.poster_url}`} />
				</a>
			</Link>
		</li>
	);
};

const ShowListColumn: React.FC<{
	title: string;
	shows: Array<PartialShow>;
	selected: boolean;
	selectedShowIdx: number;
}> = (props) => {
	const items = useMemo(
		() => [...props.shows, ...props.shows, ...props.shows].slice(props.selectedShowIdx),
		[props.selectedShowIdx, props.shows]
	);

	return (
		<div className="flex flex-col gap-2">
			<span className="font-bebas text-4xl text-white">{props.title}</span>
			<ul className="flex overflow-x-scroll gap-2">
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

const Button: React.FC<PropsWithChildren<{ secondary?: boolean }>> = ({ children, secondary }) => {
	return (
		<button
			type="button"
			className={`py-2 px-3 rounded flex gap-2 items-center group ${
				secondary
					? "text-white bg-neutral-600/80 text-sm hover:bg-neutral-600"
					: "text-black bg-neutral-200 hover:bg-white"
			}`}
		>
			{children}
		</button>
	);
};

const RootIndex: NextPage = () => {
	const [schedule, setSchedule] = useState<Schedule | null>(null);
	const [selectedShowIndexes, setSelectedShowIndexes] = useState<{ [K in Day]?: number }>({});

	const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);
	//const [selectedShowIdx, setSelectedShowIdx] = useState<number>(0);

	useEffect(() => {
		void (async () => {
			const newSchedule = await getSchedule();
			setSelectedDayIdx(
				Object.keys(newSchedule).indexOf(
					new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase() as Day
				)
			);

			setSchedule(newSchedule);
		})();
	}, []);

	const selectedDay: Day | null = schedule ? (Object.keys(schedule)[selectedDayIdx] as Day) : null;

	const selectedShowIdx = useMemo(() => {
		if (!schedule || !selectedDay) return 0;

		const value = selectedShowIndexes[selectedDay];
		if (value === undefined)
			setSelectedShowIndexes((selectedShowIndexes) => ({
				...selectedShowIndexes,
				[selectedDay]: 0
			}));

		return value || 0;
	}, [schedule, selectedDay, selectedShowIndexes]);

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (!schedule || !selectedDay) return;
			event.preventDefault();

			switch (event.key) {
				case "ArrowUp":
					setSelectedDayIdx((selectedDayIdx) => {
						const newIdx = (selectedDayIdx - 1) % Object.keys(schedule).length;
						return newIdx < 0 ? Object.keys(schedule).length - 1 : newIdx;
					});
					break;
				case "ArrowDown":
					setSelectedDayIdx(
						(selectedDayIdx) => (selectedDayIdx + 1) % Object.keys(schedule).length
					);
					break;
				case "ArrowLeft":
					setSelectedShowIndexes((selectedShowIndexes) => ({
						...selectedShowIndexes,
						[selectedDay]:
							selectedShowIdx - 1 < 0 ? schedule[selectedDay].length - 1 : selectedShowIdx - 1
					}));
					break;
				case "ArrowRight":
					setSelectedShowIndexes((selectedShowIndexes) => ({
						...selectedShowIndexes,
						[selectedDay]: (selectedShowIdx + 1) % schedule[selectedDay].length
					}));
			}
		}
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [schedule, selectedDay, selectedShowIdx]);

	const selectedShow: PartialShow | null =
		schedule && selectedDay ? schedule[selectedDay][selectedShowIdx].show : null;

	return (
		<>
			<div className="absolute -z-30 w-full h-screen bg-neutral-900 pointer-events-none">
				<div
					className="absolute w-full h-screen bg-center bg-cover"
					style={{
						backgroundImage:
							"url(https://www.animegeek.com/wp-content/uploads/2019/03/The-Rising-Of-The-Shield-Hero-Season-2-release-date-Tate-no-Yuusha-no-Nariagari-manga-light-novels-compared-to-the-anime-Sequel-definitely-possible-says-Kadokawa-producer-Spoilers.jpg)"
					}}
				/>
				<div className="absolute w-full h-full bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
			</div>
			<div className="flex overflow-hidden w-full h-screen">
				<aside className="flex flex-col p-8" />
				<div className="flex flex-col gap-16 py-16">
					{selectedShow && (
						<div className="flex flex-col gap-4">
							<div className="flex flex-col gap-2">
								<div className="flex flex-col gap-1 font-bebas text-white">
									<span className="font-sans font-bold">
										The Rising of the Shield Hero Season 2
									</span>
									<span className="text-6xl">{selectedShow.title.romaji}</span>
								</div>
								<span className="max-w-md text-white">
									{`With another Wave happening in a week, Naofumi Iwatani and his party have no time to waste. However, when bat familiars raid Lurolona Village and the Wave countdown comes to a halt, the Four Cardinal Heroes reconvene with the queen, Mirelia Q Melromarc, for a quick briefing. The queen presumes that the odd occurrences are linked to the Spirit Tortoise—a threatening creature that has awakened from its slumber, back to cause havoc once again. A plan to put the Spirit Tortoise to rest is devised—but out of the four men, only the cursed Shield Hero agrees to help.

[Written by MAL Rewrite]`.slice(0, 256)}
									...
								</span>
							</div>
							<div className="flex gap-2">
								<Link href={`/watch/${selectedShow.slug}`}>
									<a>
										<Button>
											<svg
												className="w-6 h-6"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path d="M0 0h24v24H0z" fill="none" />
												<path
													d="M19.376 12.416L8.777 19.482A.5.5 0 0 1 8 19.066V4.934a.5.5 0 0 1 .777-.416l10.599 7.066a.5.5 0 0 1 0 .832z"
													fill="currentColor"
												/>
											</svg>
											<span>Watch now</span>
										</Button>
									</a>
								</Link>
								<Button secondary>More information</Button>
							</div>
						</div>
					)}
					<div className="flex flex-col gap-4">
						{schedule &&
							[...Object.entries(schedule), ...Object.entries(schedule)]
								.slice(selectedDayIdx)
								.map(([day, shows], idx) => (
									<ShowListColumn
										key={`${day}-${idx}`}
										selected={idx === 0}
										selectedShowIdx={selectedShowIndexes[day as Day] || 0}
										shows={shows.map(({ show }) => show)}
										title={day}
									/>
								))}
					</div>
				</div>
			</div>
		</>
	);
};

export default RootIndex;
