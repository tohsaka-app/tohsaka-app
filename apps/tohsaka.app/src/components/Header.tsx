import Link from "next/link";
import { HiOutlineDownload } from "react-icons/hi";

export const Header: React.FC = () => {
	return (
		<header className="flex w-full justify-center md:absolute">
			<div className="container flex flex-col justify-between gap-8 p-8 md:flex-row">
				<div className="flex flex-col gap-8 md:flex-row md:items-center">
					<span className="text-xl font-bold">Tohsaka</span>
					<div className="flex flex-col gap-4 md:flex-row md:items-center">
						<Link href="">
							<a>Resources</a>
						</Link>
						<Link href="">
							<a>Resources</a>
						</Link>
						<Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">
							<a>Legal resources</a>
						</Link>
					</div>
				</div>
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
					<button className="" type="button">
						Sign up
					</button>
					<button
						className="flex items-center justify-center gap-2 rounded bg-white/20 py-2 px-4"
						type="button"
					>
						<span>Download</span>
						<HiOutlineDownload className="h-4 w-4" />
					</button>
				</div>
			</div>
		</header>
	);
};
