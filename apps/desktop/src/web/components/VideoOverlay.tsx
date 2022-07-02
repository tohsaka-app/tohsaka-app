import { useCallback, useMemo, useRef, useState } from "react";

import { useInterval } from "../hooks/useInterval";
import { useKeyboard } from "../hooks/useKeyboard";
import { useShow } from "../hooks/useShow";
import { ShowEpisode } from "../lib/api";

import { ShowInfoBox } from "./ShowInfoBox";

const TIME_TILL_FOCUS = 2000;

export const VideoOverlay: React.FC<{
	visible: boolean;
	slug: string;
	activeEpisodeIdx: number;
	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setActiveEpisodeIdx: React.Dispatch<React.SetStateAction<number>>;
}> = (props) => {
	const { visible, activeEpisodeIdx, setActiveEpisodeIdx, setVisible } = props;
	const { data: show } = useShow(props.slug);

	const lastInputTsRef = useRef(Date.now());

	const [selectedEpisodeIdx, setSelectedEpisodeIdx] = useState(0);
	const selectedEpisode: ShowEpisode | null = show?.episodes[selectedEpisodeIdx] || null;

	useKeyboard(
		useCallback(
			(event) => {
				lastInputTsRef.current = Date.now();
				event.preventDefault();

				if (!show || !visible) return;

				switch (event.key) {
					case "Enter":
						setActiveEpisodeIdx(selectedEpisodeIdx);
						break;
					case "ArrowUp":
						setSelectedEpisodeIdx((selectedEpisodeIdx) => {
							const newIdx = (selectedEpisodeIdx - 1) % Object.keys(show.episodes).length;
							return newIdx < 0 ? Object.keys(show.episodes).length - 1 : newIdx;
						});
						break;
					case "ArrowDown":
						setSelectedEpisodeIdx(
							(selectedEpisodeIdx) => (selectedEpisodeIdx + 1) % Object.keys(show.episodes).length
						);
						break;
				}
			},
			[visible, show, selectedEpisodeIdx]
		)
	);

	useInterval(
		TIME_TILL_FOCUS / 10,
		useCallback(() => {
			if (visible) {
				/**
				 * As long as the show details menu is visible, and the
				 * user is pressing keys or interacting with it,
				 * we don't automatically hide the menu.
				 */
				if (Date.now() - lastInputTsRef.current < TIME_TILL_FOCUS) return;
				setVisible(false);
			}
		}, [visible])
	);

	return props.visible && show && selectedEpisode ? (
		<div className="absolute z-20 w-full h-screen pointer-events-none">
			<div className="absolute w-full h-full bg-gradient-to-r from-black/95 via-black/40 to-transparent" />
			<div className="absolute p-16">
				<ShowInfoBox slug={show.slug} detailed={{ activeEpisodeIdx, selectedEpisodeIdx }} />
			</div>
		</div>
	) : null;
};
