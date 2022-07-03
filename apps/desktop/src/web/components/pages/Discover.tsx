import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";

import { Day, getSchedule, PartialShow, Schedule } from "../../lib/api";
import { Button } from "../Button";
import { ShowInfoBox } from "../ShowInfoBox";
import { ShowListColumn } from "../ShowListColumn";

export const Discover: React.FC = () => {
	const navigate = useNavigate();

	const { data: schedule } = useSWR(["schedule"], () => getSchedule());
	const [selectedShowIndexes, setSelectedShowIndexes] = useState<{ [K in Day]?: number }>({});

	const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

	useEffect(() => {
		if (!schedule) return;
		setSelectedDayIdx(
			Object.keys(schedule).indexOf(
				new Date().toLocaleString("en-us", { weekday: "long" }).toLowerCase() as Day
			)
		);
	}, [schedule]);

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

	const selectedShow: PartialShow | null =
		schedule && selectedDay ? schedule[selectedDay][selectedShowIdx].show : null;

	useEffect(() => {
		function onKeyDown(event: KeyboardEvent) {
			if (!schedule || !selectedDay) return;
			event.preventDefault();

			switch (event.key) {
				case "Enter":
					if (!selectedShow) return;
					navigate(`/watch/${selectedShow.slug}`);
					break;
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
	}, [schedule, selectedDay, selectedShowIdx, selectedShow]);

	return (
		<>
			<div className="pointer-events-none absolute -z-30 h-screen w-full bg-neutral-900">
				<div
					className="absolute h-screen w-full bg-cover bg-center blur-lg"
					style={{
						backgroundImage: `url(https://subsplease.org${selectedShow?.poster_url})`
					}}
				/>
				<div className="absolute h-full w-full bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
			</div>
			<div className="flex h-screen w-full overflow-hidden">
				<aside className="flex flex-col p-8" />
				<div className="flex flex-col gap-16 py-16">
					{selectedShow && <ShowInfoBox slug={selectedShow.slug} />}
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
