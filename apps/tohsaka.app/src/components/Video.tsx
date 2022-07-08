import { MdPlayArrow } from "react-icons/md";

export const Video: React.FC = () => {
	return (
		<div className="relative">
			<div className="absolute flex h-full w-full items-center justify-center">
				<MdPlayArrow className="h-16 w-16" />
			</div>
			<img src="https://api.tohsaka.app/anime/kimetsu-no-yaiba/media/poster" />
		</div>
	);
};
