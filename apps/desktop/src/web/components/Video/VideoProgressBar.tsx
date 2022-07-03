import { useRef } from "react";

export interface VideoProgressBarProps {
	currentTime: number;
	duration: number;
	updateCurrentTime: React.Dispatch<React.SetStateAction<number>>;
}

export const VideoProgressBar: React.FC<VideoProgressBarProps> = (props) => {
	const elementRef = useRef<HTMLDivElement | null>(null);

	return (
		<div
			className="pointer-events-auto relative h-2 w-full overflow-hidden rounded bg-neutral-900"
			ref={elementRef}
			onClick={({ clientX }) => {
				if (!elementRef.current) return;
				const { left, width } = elementRef.current.getBoundingClientRect();
				props.updateCurrentTime(() => props.duration * ((clientX - left) / width));
			}}
		>
			<div
				className="absolute h-2 bg-red-600"
				style={{ width: `${(props.currentTime / props.duration) * 100}%` }}
			/>
		</div>
	);
};
