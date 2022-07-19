import { HiOutlineDownload } from "react-icons/hi";

import { HeaderList } from "./HeaderList";
import { Link } from "./Link";

export const Header: React.FC = () => {
	return (
		<header className="flex w-full justify-center md:absolute">
			<div className="container flex flex-col justify-between gap-8 p-8 md:flex-row">
				<div className="flex flex-col gap-8 md:flex-row md:items-center">
					<span className="text-xl font-bold">Tohsaka</span>
					<HeaderList>
						{[
							["Resources", "/"],
							["Resources", "/"],
							["Copyright takedowns", "/copyright"]
						]}
					</HeaderList>
				</div>
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
					<Link className="text-zinc-300" href="/signup">
						Sign up
					</Link>
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
