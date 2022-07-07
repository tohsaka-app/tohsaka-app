import { Anime, Episode } from "@tohsaka/types";
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
	MdSpeed,
	MdVolumeDown,
	MdVolumeOff,
	MdVolumeUp
} from "react-icons/md";

import { clamp } from "../../lib/clamp";

const IconButton: React.FC<{ Icon: IconType; onClick: () => void }> = ({ Icon, onClick }) => {
	return (
		<button type="button" onClick={onClick}>
			<Icon className="h-8 w-8 text-white" />
		</button>
	);
};

const QualityDropdown: React.FC<{
	quality: string;
	setQuality: React.Dispatch<React.SetStateAction<string>>;
	content: Episode["content"];
}> = ({ quality, setQuality, content }) => {
	return (
		<div className="absolute -mt-32 flex flex-col gap-1 bg-black/80 text-white opacity-0 group-hover:opacity-100">
			{Object.keys(content).map((resolution) => (
				<div className="flex justify-between gap-4" key={resolution}>
					<span>{`${resolution}p`}</span>
				</div>
			))}
		</div>
	);
};

export interface VideoControlListProps {
	fullscreen: boolean;
	setFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
	playing: boolean;
	updatePlaying: React.Dispatch<React.SetStateAction<boolean>>;
	quality: string;
	setQuality: React.Dispatch<React.SetStateAction<string>>;
	volume: number;
	updateVolume: React.Dispatch<React.SetStateAction<number>>;
	currentTime: number;
	updateCurrentTime: React.Dispatch<React.SetStateAction<number>>;
	setEpisodeIdx: React.Dispatch<React.SetStateAction<number>>;

	anime: Anime;
	episode: Episode;
}

export const VideoControlList: React.FC<VideoControlListProps> = (props) => {
	return (
		<div className="relative flex justify-between gap-2">
			<div className="flex gap-2">
				<IconButton
					Icon={props.playing ? MdPause : MdPlayArrow}
					onClick={() => props.updatePlaying((playing) => !playing)}
				/>
				<IconButton
					Icon={MdReplay10}
					onClick={() => props.updateCurrentTime((currentTime) => currentTime - 10)}
				/>
				<IconButton
					Icon={MdForward10}
					onClick={() => props.updateCurrentTime((currentTime) => currentTime + 10)}
				/>
				<div className="flex items-center gap-1">
					<IconButton
						Icon={props.volume === 0 ? MdVolumeOff : props.volume <= 50 ? MdVolumeDown : MdVolumeUp}
						onClick={() => props.updateVolume((volume) => (volume === 0 ? 100 : 0))}
					/>
					<span className="text-xs text-white">{props.volume}%</span>
				</div>
			</div>
			<div className="pointer-events-none absolute flex w-full items-center justify-center gap-4 text-white">
				<span className="font-bold">{props.anime.titles.canonical}</span>
				<span>{props.episode.titles.canonical}</span>
			</div>
			<div className="flex gap-2">
				<IconButton
					Icon={MdSkipNext}
					onClick={() =>
						props.setEpisodeIdx((episodeIdx) =>
							clamp(episodeIdx + 1, 0, props.anime.episodes.length)
						)
					}
				/>
				<IconButton
					Icon={MdPlaylistPlay}
					onClick={() => props.updatePlaying((playing) => !!playing)}
				/>
				<div className="group flex items-center gap-1">
					<IconButton Icon={MdHighQuality} onClick={() => {}} />
					<QualityDropdown
						content={props.episode.content}
						quality={props.quality}
						setQuality={props.setQuality}
					/>
				</div>
				<IconButton Icon={MdSpeed} onClick={() => {}} />
				<IconButton
					Icon={props.fullscreen ? MdFullscreenExit : MdFullscreen}
					onClick={() => props.setFullscreen((fullscreen) => !fullscreen)}
				/>
			</div>
		</div>
	);
};
