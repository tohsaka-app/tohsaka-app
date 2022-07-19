import { getAlignmentName, SubtitleAlignment } from "@tohsaka/subtitles";
import { twMerge } from "tailwind-merge";

import type { VideoMetadata } from "../../hooks/useVideoMetadata";

export interface VideoSubtitleProps {
	subtitle: VideoMetadata["subtitles"][0];
}

export const VideoSubtitle: React.FC<VideoSubtitleProps> = ({ subtitle }) => {
	return (
		<span className="max-w-[40vw] bg-black/50 px-2 text-center text-[3vh] text-white">
			{subtitle.text}
		</span>
	);
};

export interface SubtitlesProps {
	subtitles: VideoMetadata["subtitles"];
}

export const VideoSubtitles: React.FC<SubtitlesProps> = (props) => {
	console.log(props.subtitles);

	return (
		<div className="mb-4 grid h-full grid-cols-3 grid-rows-3">
			{Object.values(SubtitleAlignment).map((alignment) => {
				const subtitles = props.subtitles.filter((subtitle) => subtitle.align === alignment);
				const positionName = getAlignmentName(alignment);

				return (
					<div
						key={positionName}
						className={twMerge(
							"flex",
							positionName.includes("TOP") && "items-start",
							positionName.includes("MIDDLE") && "items-center",
							positionName.includes("BOTTOM") && "items-end",
							positionName.includes("LEFT") && "justify-start text-left",
							positionName.includes("CENTER") && "justify-center text-center",
							positionName.includes("RIGHT") && "justify-end text-right"
						)}
					>
						{subtitles.map((subtitle) => (
							<VideoSubtitle key={subtitle.id} subtitle={subtitle} />
						))}
					</div>
				);
			})}
		</div>
	);
};
