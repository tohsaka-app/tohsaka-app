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
		return (remainingTime: number) => dtf.format(new Date(remainingTime));
	}, []);

	return (
		<div className="flex items-center gap-4">
			<VideoProgressBar {...props} />
			<span className="text-sm text-white">
				{formatTime((props.duration - props.currentTime) * 1000)}
			</span>
		</div>
	);
};
