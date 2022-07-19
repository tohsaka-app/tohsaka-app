import { Link } from "./Link";

export interface HeaderListProps {
	children: Array<[string, string]>;
}

export const HeaderList: React.FC<HeaderListProps> = (props) => {
	return (
		<div className="flex flex-col gap-4 text-zinc-300 md:flex-row md:items-center">
			{props.children.map(([name, href], idx) => (
				<Link href={href} key={idx}>
					{name}
				</Link>
			))}
		</div>
	);
};
