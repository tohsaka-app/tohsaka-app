import { Episode } from "@tohsaka/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MdPlayArrow } from "react-icons/md";
import { VscLoading } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { useAnime } from "../../hooks/useAnime";
import { useInterval } from "../../hooks/useInterval";
import { useKeydown } from "../../hooks/useKeydown";
import { useKeydownEvent } from "../../hooks/useKeydownEvent";
import { useVideoMetadata } from "../../hooks/useVideoMetadata";
import { clamp } from "../../lib/clamp";
import { LOCAL_API_URL } from "../../lib/config";

import { VideoControlList } from "./VideoControlList";
import { VideoProgress } from "./VideoProgress";
import { VideoSubtitles } from "./VideoSubtitles";
import { VideoTorrentMetadata } from "./VideoTorrentMetadata";

const TIME_TILL_FOCUS = 2000;

export const Video: React.FC<{
	slug: string;
}> = ({ slug }) => {
	const navigate = useNavigate();
	const { data: anime } = useAnime(slug);

	const rootElementRef = useRef<HTMLDivElement | null>(null);
	const videoElementRef = useRef<HTMLVideoElement | null>(null);

	const [controlsVisible, setControlsVisible] = useState(true);
	const [episodeIdx, setEpisodeIdx] = useState(0);

	const [quality, setQuality] = useState("");
	const [playing, setPlaying] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);

	const lastInputTsRef = useRef(Date.now());

	const [volume, setVolume] = useState(100);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const episode: Episode | null = anime?.episodes[episodeIdx] || null;
	const hash = episode?.content[Object.keys(episode?.content || {})[0]][0];

	const { data: metadata } = useVideoMetadata(hash);

	const loading = !metadata;
	console.log({ loading, metadata });

	const currentSubtitles = useMemo(
		() =>
			metadata?.subtitles.filter((value) => {
				const currentTimeMs = currentTime * 1000;
				return currentTimeMs >= value.ts[0] && currentTimeMs <= value.ts[1];
			}) || [],
		[currentTime, metadata?.subtitles]
	);

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

	const updatePlaying = useCallback<React.Dispatch<React.SetStateAction<boolean>>>(
		(arg0) => {
			setPlaying((playing) => {
				const newPlaying = loading ? playing : typeof arg0 === "function" ? arg0(playing) : arg0;
				markLastInputTime();

				const { current: element } = videoElementRef;
				if (element) newPlaying ? void element.play() : element.pause();

				return newPlaying;
			});
		},
		[loading, markLastInputTime]
	);

	useEffect(() => {
		if (!loading) updatePlaying(true);
	}, [loading, updatePlaying]);

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

	useKeydownEvent(
		useCallback(
			(ev) => {
				switch (ev.key) {
					case "Escape":
						setFullscreen(false);
						updatePlaying((playing) => {
							if (!playing) navigate("/discover", { state: { anime: slug } });
							return true;
						});
						ev.preventDefault();

						break;
					case " ":
						updatePlaying((playing) => !playing);
						ev.preventDefault();

						break;
					case "f":
						setFullscreen((fullscreen) => !fullscreen);
						ev.preventDefault();
						break;
					case "ArrowLeft":
						updateCurrentTime((currentTime) => currentTime - 10);
						ev.preventDefault();
						break;
					case "ArrowRight":
						updateCurrentTime((currentTime) => currentTime + 10);
						ev.preventDefault();
						break;
					case "ArrowUp":
						updateVolume((volume) => volume + 10);
						ev.preventDefault();
						break;
					case "ArrowDown":
						updateVolume((volume) => volume - 10);
						ev.preventDefault();
						break;
				}
			},
			[slug, navigate, updatePlaying, updateCurrentTime, updateVolume]
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
