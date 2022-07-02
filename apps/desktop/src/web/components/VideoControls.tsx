import { useCallback, useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
	MdForward10,
	MdFullscreen,
	MdFullscreenExit,
	MdHighQuality,
	MdPause,
	MdPlayArrow,
	MdPlaylistPlay,
	MdReplay10,
	MdSkipNext,
	MdSkipPrevious,
	MdSpeed,
	MdVolumeDown,
	MdVolumeOff,
	MdVolumeUp
} from "react-icons/md";
import { twMerge } from "tailwind-merge";

import { useInterval } from "../hooks/useInterval";
import { useKeydown } from "../hooks/useKeydown";

const VideoProgress: React.FC<{
	currentTime: number;
	duration: number;
	updateCurrentTime: (newCurrentTime: number) => void;
}> = ({ duration, currentTime, updateCurrentTime }) => {
	const elementRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			ref={elementRef}
			className="overflow-hidden relative w-full h-2 bg-neutral-900 rounded pointer-events-auto"
			onClick={({ clientX }) => {
				if (!elementRef.current) return;
				const { left, width } = elementRef.current.getBoundingClientRect();
				updateCurrentTime(duration * ((clientX - left) / width));
			}}
		>
			<div
				className="absolute h-2 bg-red-600"
				style={{ width: `${(currentTime / duration) * 100}%` }}
			/>
		</div>
	);
};

const IconButton: React.FC<{ Icon: IconType; onClick: () => void }> = ({ Icon, onClick }) => {
	return (
		<button onClick={onClick}>
			<Icon className="w-8 h-8 text-white" />
		</button>
	);
};

const TIME_TILL_FOCUS = 2000;

const QualityDropdown: React.FC<{
	quality: Quality;
	setQuality: React.Dispatch<React.SetStateAction<Quality>>;
}> = ({ quality, setQuality }) => {
	return (
		<div className="flex absolute flex-col gap-1 -mt-32 text-white bg-black/80 opacity-0 group-hover:opacity-100">
			{Object.entries(Quality)
				.filter(([, resolution]) => !isNaN(parseInt(resolution as string)))
				.map(([name, resolution]) => (
					<div className="flex gap-4 justify-between">
						<span>{name}</span>
						<span>{resolution}p</span>
					</div>
				))}
		</div>
	);
};

import { useShow } from "../hooks/useShow";
import { Quality, ShowEpisode } from "../lib/api";
import { clamp } from "../lib/clamp";
export const VideoControls: React.FC<{
	rootRef: React.MutableRefObject<HTMLDivElement | null>;
	videoRef: React.MutableRefObject<HTMLVideoElement | null>;
	slug: string;
	visible: boolean;
	paused: boolean;
	fullscreen: boolean;
	episodeIdx: number;
	episode: ShowEpisode;
	quality: Quality;

	setVisible: React.Dispatch<React.SetStateAction<boolean>>;
	setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
	setPaused: React.Dispatch<React.SetStateAction<boolean>>;
	setQuality: React.Dispatch<React.SetStateAction<Quality>>;
	setEpisodeIdx: React.Dispatch<React.SetStateAction<number>>;
}> = (props) => {
	const { rootRef, videoRef, slug, visible, paused, episode, setVisible, setPaused } = props;
	const { data: show } = useShow(slug);

	const lastInputTsRef = useRef(Date.now());

	const [volume, setVolume] = useState(100);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const markLastInputTime = useCallback(() => {
		lastInputTsRef.current = Date.now();
		setVisible(true);
	}, []);

	const updateCurrentTime = useCallback((newCurrentTime: number) => {
		setCurrentTime(newCurrentTime);
		markLastInputTime();

		const { current: element } = videoRef;
		if (!element) return;

		element.currentTime = newCurrentTime;
	}, []);

	const updateVolume = useCallback((newVolume: number) => {
		newVolume = clamp(newVolume, 0, 100);

		setVolume(newVolume);
		markLastInputTime();

		const { current: element } = videoRef;
		if (!element) return;

		element.volume = newVolume / 100;
	}, []);

	useEffect(() => {
		const { current: element } = videoRef;
		if (!element) return;

		function onTimeUpdate() {
			setCurrentTime(videoRef.current?.currentTime || 0);
		}

		function onDurationChange() {
			setDuration(videoRef.current?.duration || 0);
		}

		function onMouseMove() {
			markLastInputTime();
		}

		element.addEventListener("timeupdate", onTimeUpdate);
		element.addEventListener("durationchange", onDurationChange);

		document.addEventListener("mousemove", onMouseMove);

		return () => {
			element.removeEventListener("timeupdate", onTimeUpdate);
			element.removeEventListener("durationchange", onDurationChange);

			document.removeEventListener("mousemove", onMouseMove);
		};
	}, []);

	useKeydown(
		"ArrowLeft",
		useCallback(
			(ev) => {
				updateCurrentTime(currentTime - 10);
				ev.preventDefault();
			},
			[currentTime]
		)
	);

	useKeydown(
		"ArrowRight",
		useCallback(
			(ev) => {
				updateCurrentTime(currentTime + 10);
				ev.preventDefault();
			},
			[currentTime]
		)
	);

	useKeydown(
		"ArrowUp",
		useCallback(
			(ev) => {
				updateVolume(volume + 10);
				ev.preventDefault();
			},
			[volume]
		)
	);

	useKeydown(
		"ArrowDown",
		useCallback(
			(ev) => {
				updateVolume(volume - 10);
				ev.preventDefault();
			},
			[volume]
		)
	);

	useInterval(
		TIME_TILL_FOCUS / 10,
		useCallback(() => {
			if (visible) {
				/**
				 * As long as the controls are visible, and the
				 * user is pressing keys or interacting with it,
				 * we don't automatically hide the menu.
				 */
				if (Date.now() - lastInputTsRef.current < TIME_TILL_FOCUS) return;
				setVisible(false);
			}
		}, [visible])
	);

	return show ? (
		<div
			className={twMerge(
				"absolute z-10 w-full h-screen pointer-events-none",
				visible ? "opacity-100" : "opacity-0"
			)}
		>
			<div className="absolute w-full h-full bg-gradient-to-t from-black/95 via-black/20 to-transparent" />
			<div className="flex absolute bottom-0 flex-col gap-4 p-8 w-full pointer-events-auto">
				<div className="flex gap-4 items-center">
					<VideoProgress {...{ duration, currentTime, updateCurrentTime }} />
					<span className="text-sm text-white">
						{new Intl.DateTimeFormat("en-US", { minute: "2-digit", second: "2-digit" }).format(
							new Date((duration - currentTime) * 1000)
						)}
					</span>
				</div>
				<div className="flex relative gap-2 justify-between">
					<div className="flex gap-2">
						<IconButton
							onClick={() => setPaused((paused) => !paused)}
							Icon={paused ? MdPlayArrow : MdPause}
						/>
						<IconButton onClick={() => updateCurrentTime(currentTime - 10)} Icon={MdReplay10} />
						<IconButton onClick={() => updateCurrentTime(currentTime + 10)} Icon={MdForward10} />
						<div className="flex gap-1 items-center">
							<IconButton
								onClick={() => (volume === 0 ? updateVolume(100) : updateVolume(0))}
								Icon={volume === 0 ? MdVolumeOff : volume <= 50 ? MdVolumeDown : MdVolumeUp}
							/>
							<span className="text-xs text-white">{volume}%</span>
						</div>
					</div>
					<div className="flex absolute gap-4 justify-center items-center w-full text-white pointer-events-none">
						<span className="font-bold">{show.title}</span>
						<span>{episode.name}</span>
					</div>
					<div className="flex gap-2">
						<IconButton
							onClick={() =>
								props.setEpisodeIdx((episodeIdx) => clamp(episodeIdx + 1, 0, show.episodes.length))
							}
							Icon={MdSkipNext}
						/>
						<IconButton onClick={() => {}} Icon={MdPlaylistPlay} />
						<div className="group flex gap-1 items-center">
							<IconButton onClick={() => {}} Icon={MdHighQuality} />
							<QualityDropdown quality={props.quality} setQuality={props.setQuality} />
						</div>
						<IconButton onClick={() => {}} Icon={MdSpeed} />
						<IconButton
							onClick={() => props.setFullscreen((fullscreen) => !fullscreen)}
							Icon={props.fullscreen ? MdFullscreenExit : MdFullscreen}
						/>
					</div>
				</div>
			</div>
		</div>
	) : null;
};
