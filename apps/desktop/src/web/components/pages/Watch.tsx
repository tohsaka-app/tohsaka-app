import { useParams } from "react-router-dom";

import { useShow } from "../../hooks/useShow";
import { Video } from "../Video";

export const Watch: React.FC = () => {
	const { slug } = useParams();
	const { data: show } = useShow(slug);

	return show ? (
		<div className="relative flex h-screen w-full overflow-hidden">
			<Video slug={show.slug} />
		</div>
	) : null;
};
