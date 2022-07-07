import { useParams } from "react-router-dom";

import { useAnime } from "../../hooks/useAnime";
import { Video } from "../Video";

export const Watch: React.FC = () => {
	const { slug } = useParams();
	const { data: anime } = useAnime(slug);

	return anime ? (
		<div className="relative flex h-screen w-full overflow-hidden">
			<Video slug={anime.slug} />
		</div>
	) : null;
};
