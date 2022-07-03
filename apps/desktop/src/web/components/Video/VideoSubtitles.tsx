import type { VideoMetadata } from "../../hooks/useVideoMetadata";

export interface VideoSubtitleProps {
	subtitle: VideoMetadata["subtitles"][0];
}

export const VideoSubtitle: React.FC<VideoSubtitleProps> = ({ subtitle }) => {
	return (
		<span className="max-w-[40vw] bg-black/50 px-2 text-center text-[3vh] text-white">
			{subtitle.data.text.replace(/<[^>]+>/g, "")}
		</span>
	);
};

export interface SubtitlesProps {
	subtitles: VideoMetadata["subtitles"];
}

export const VideoSubtitles: React.FC<SubtitlesProps> = ({ subtitles }) => {
	return (
		<div className="flex h-full flex-col justify-between">
			<div className="flex w-full flex-col items-center justify-center gap-4">
				{subtitles
					.filter(({ data: { position } }) => position === "top")
					.map((subtitle) => {
						return <VideoSubtitle key={subtitle.id} subtitle={subtitle} />;
					})}
			</div>
			<div className="flex w-full flex-col items-center justify-center gap-4">
				{subtitles
					.filter(({ data: { position } }) => position === "bottom")
					.map((subtitle) => {
						return <VideoSubtitle key={subtitle.id} subtitle={subtitle} />;
					})}
			</div>
		</div>
	);
};
