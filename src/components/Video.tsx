export const Video: React.FC<{ hash: string }> = (props) => {
	return (
		<video autoPlay controls muted className="aspect-video w-full" id="videoPlayer">
			<source src={`/api/video/${props.hash.toLowerCase()}`} type="video/mp4" />
		</video>
	);
};
