import create from "zustand";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdPlayArrow } from "react-icons/md";

import { LOCAL_API_URL } from "../lib/config";
import { useShow } from "../hooks/useShow";
import { Quality, ShowEpisode } from "../lib/api";
import { useKeydown } from "../hooks/useKeydown";

import { VideoOverlay } from "./VideoOverlay";
import { VideoControls } from "./VideoControls";

export const Video: React.FC<{
	slug: string;
}> = ({ slug }) => {
	const navigate = useNavigate();
	const { data: show } = useShow(slug);

	const rootElementRef = useRef<HTMLDivElement | null>(null);
	const videoElementRef = useRef<HTMLVideoElement | null>(null);

	const [controlsVisible, setControlsVisible] = useState(true);
	const [episodeIdx, setEpisodeIdx] = useState(0);

	const [quality, setQuality] = useState(Quality.HIGH);
	const [paused, setPaused] = useState(false);
	const [fullscreen, setFullscreen] = useState(false);

	const episode: ShowEpisode | null = show?.episodes[episodeIdx] || null;

	useEffect(() => {
		const { current: element } = videoElementRef;
		paused ? element?.pause() : element?.play();
	}, [paused]);

	useEffect(() => {
		const { current: element } = rootElementRef;
		fullscreen
			? void element?.requestFullscreen({ navigationUI: "show" })
			: void document.exitFullscreen();
	}, [fullscreen]);

	useKeydown(
		"Escape",
		useCallback(() => {
			setPaused(true);
			if (paused) navigate("/discover", { state: { show: slug } });
		}, [paused])
	);

	useKeydown(
		" ",
		useCallback(() => {
			setPaused((paused) => !paused);
		}, [])
	);

	return show && episode ? (
		<div ref={rootElementRef} className="flex relative justify-center items-center w-full bg-black">
			<div className="flex absolute z-50 justify-center items-center w-full h-full pointer-events-none">
				{paused && <MdPlayArrow className="w-24 h-24 text-white" />}
			</div>
			<VideoControls
				videoRef={videoElementRef}
				rootRef={rootElementRef}
				visible={controlsVisible}
				setVisible={setControlsVisible}
				{...{
					slug,
					paused,
					episode,
					setPaused,
					fullscreen,
					setFullscreen,
					quality,
					setQuality,
					episodeIdx,
					setEpisodeIdx
				}}
			/>
			<video
				ref={videoElementRef}
				onClick={() => setPaused((paused) => !paused)}
				autoPlay
				controls={false}
				className="aspect-video h-full"
				src={`${LOCAL_API_URL}?hash=${episode.content[quality]}`}
			/>
		</div>
	) : null;
};
