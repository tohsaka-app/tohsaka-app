import { HiArrowNarrowRight } from "react-icons/hi";

import { Link } from "./Link";
export interface FooterListProps {
	children: Array<[name: string, href: string]>;
}

export const FooterList: React.FC<FooterListProps> = (props) => {
	return (
		<div className="flex flex-col">
			{props.children.map(([name, href], idx) => (
				<div className="flex items-center gap-2" key={idx}>
					<HiArrowNarrowRight />
					<Link href={href}>{name}</Link>
				</div>
			))}
		</div>
	);
};
