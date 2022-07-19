import { useMemo } from "react";

import { VideoProgressBar } from "./VideoProgressBar";

export interface VideoProgressProps {
	currentTime: number;
	duration: number;
	updateCurrentTime: React.Dispatch<React.SetStateAction<number>>;
}

export const VideoProgress: React.FC<VideoProgressProps> = (props) => {
	const formatTime = useMemo(() => {
		const dtf = new Intl.DateTimeFormat("en-US", { minute: "2-digit", second: "2-digit" });
		return (time: number) => dtf.format(new Date(time));
	}, []);

	const timeProgress = formatTime(props.currentTime * 1000);
	const timeRemaining = formatTime((props.duration - props.currentTime) * 1000);

	return (
		<div className="flex items-center gap-4">
			<span className="text-sm text-white" title="Current progress">
				{timeProgress}
			</span>
			<VideoProgressBar {...props} />
			<span className="text-sm text-white" title="Time remaining">
				{timeRemaining}
			</span>
		</div>
	);
};
