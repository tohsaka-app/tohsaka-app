import { useTorrentMetadata } from "../../hooks/useTorrentMetadata";

export const VideoTorrentMetadata: React.FC = () => {
	const { data } = useTorrentMetadata();

	const downloadMbps = ((data?.speed.download || 0) / 1000).toFixed(2);
	const uploadMbps = ((data?.speed.upload || 0) / 1000).toFixed(2);

	return (
		<div className="pointer-events-none absolute top-0 right-0 z-50 m-8 w-64 bg-black/50 p-2 text-white">
			<div className="flex justify-between gap-4">
				<span>Download</span>
				<span className="font-mono">{downloadMbps} KB/s</span>
			</div>
			<div className="flex justify-between gap-4">
				<span>Upload</span>
				<span className="font-mono">{uploadMbps} KB/s</span>
			</div>
		</div>
	);
};
