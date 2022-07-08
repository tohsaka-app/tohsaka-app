import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";

import { VideoControlList } from "./VideoControlList";
import { VideoProgress } from "./VideoProgress";
import { VideoSubtitles } from "./VideoSubtitles";
import { VideoTorrentMetadata } from "./VideoTorrentMetadata";

const TIME_TILL_FOCUS = 2000;

export const Video: React.FC<{
	slug: string;
}> = ({ slug }) => {

	const rootElementRef = useRef<HTMLDivElement | null>(null);
	const videoElementRef = useRef<HTMLVideoElement | null>(null);

	const [controlsVisible, setControlsVisible] = useState(true);

	const [quality, setQuality] = useState("");
	const [playing, setPlaying] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);

	const lastInputTsRef = useRef(Date.now());

	const [volume, setVolume] = useState(100);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const markLastInputTime = useCallback(() => {
		lastInputTsRef.current = Date.now();
		setControlsVisible(true);
	}, []);

	const updateCurrentTime = useCallback<React.Dispatch<React.SetStateAction<number>>>(
		(arg0) => {
			setCurrentTime((currentTime) => {
				const newCurrentTime = typeof arg0 === "function" ? arg0(currentTime) : arg0;
				markLastInputTime();

				const { current: element } = videoElementRef;
				if (element) element.currentTime = newCurrentTime;
				return newCurrentTime;
			});
		},
		[markLastInputTime]
	);

	const updateVolume = useCallback<React.Dispatch<React.SetStateAction<number>>>(
		(arg0) => {
			setVolume((volume) => {
				const newVolume = clamp(typeof arg0 === "function" ? arg0(volume) : arg0, 0, 100);
				markLastInputTime();

				const { current: element } = videoElementRef;
				if (element) element.volume = newVolume / 100;

				return newVolume;
			});
		},
		[markLastInputTime]
	);


	useEffect(() => {
		const { current: element } = videoElementRef;
		if (!element) return;

		function onTimeUpdate() {
			setCurrentTime(videoElementRef.current?.currentTime || 0);
		}

		function onDurationChange() {
			setDuration(videoElementRef.current?.duration || 0);
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
	}, [markLastInputTime]);

	useInterval(
		TIME_TILL_FOCUS / 10,
		useCallback(() => {
			if (controlsVisible) {
				/**
				 * As long as the controls are visible, and the
				 * user is pressing keys or interacting with it,
				 * we don't automatically hide the menu.
				 */
				if (Date.now() - lastInputTsRef.current < TIME_TILL_FOCUS) return;
				setControlsVisible(false);
			}
		}, [controlsVisible])
	);

	useEffect(() => {
		const { current: element } = rootElementRef;

		fullscreen
			? void element?.requestFullscreen({ navigationUI: "show" })
			: void document.exitFullscreen();
	}, [fullscreen]);

	useKeydown(
		"Escape",
		useCallback(() => {
			setPlaying((playing) => {
				if (!playing) navigate("/discover", { state: { anime: slug } });
				return true;
			});
		}, [navigate, slug])
	);

	useKeydown(
		" ",
		useCallback(() => {
			setPlaying((playing) => !playing);
		}, [])
	);

	useKeydown(
		"ArrowLeft",
		useCallback(
			(ev) => {
				updateCurrentTime((currentTime) => currentTime - 10);
				ev.preventDefault();
			},
			[updateCurrentTime]
		)
	);

	useKeydown(
		"ArrowRight",
		useCallback(
			(ev) => {
				updateCurrentTime((currentTime) => currentTime + 10);
				ev.preventDefault();
			},
			[updateCurrentTime]
		)
	);

	useKeydown(
		"ArrowUp",
		useCallback(
			(ev) => {
				updateVolume((volume) => volume + 10);
				ev.preventDefault();
			},
			[updateVolume]
		)
	);

	useKeydown(
		"ArrowDown",
		useCallback(
			(ev) => {
				updateVolume((volume) => volume - 10);
				ev.preventDefault();
			},
			[updateVolume]
		)
	);

	const video_url = `${LOCAL_API_URL}/${hash}.mkv`;

	return anime && episode ? (
		<div className="relative flex w-full items-center justify-center bg-black" ref={rootElementRef}>
			<div className="pointer-events-none absolute z-50 flex h-full w-full items-center justify-center">
				{loading ? (
					<VscLoading className="h-24 w-24 animate-spin text-white" />
				) : (
					!playing && <MdPlayArrow className="h-24 w-24 text-white" />
				)}
			</div>
			<VideoTorrentMetadata />
			<div className="pointer-events-none absolute z-10 h-screen w-full">
				<div
					className={twMerge(
						"absolute h-full w-full bg-gradient-to-t from-black/95 via-black/20 to-transparent",
						controlsVisible ? "opacity-100" : "opacity-0"
					)}
				/>
				<div className="absolute bottom-0 flex h-full w-full flex-col p-8">
					<VideoSubtitles subtitles={currentSubtitles} />
					<div
						className={twMerge(
							"flex w-full flex-col gap-4 pointer-events-auto",
							controlsVisible ? "opacity-100" : "opacity-0"
						)}
					>
						<VideoProgress {...{ duration, currentTime, updateCurrentTime }} />
						<VideoControlList
							{...{
								currentTime,
								episode,
								fullscreen,
								playing,
								quality,
								setEpisodeIdx,
								setFullscreen,
								updatePlaying,
								setQuality,
								anime,
								updateCurrentTime,
								updateVolume,
								volume
							}}
						/>
					</div>
				</div>
			</div>

			<video
				className="aspect-video h-full"
				controls={false}
				ref={videoElementRef}
				src={video_url}
				onClick={() => updatePlaying((playing) => !playing)}
			/>
		</div>
	) : null;
};
