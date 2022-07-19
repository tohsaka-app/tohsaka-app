export type FooterSectionProps = React.PropsWithChildren<{
	name: string;
}>;

export const FooterSection: React.FC<FooterSectionProps> = (props) => {
	return (
		<div className="flex grow flex-col gap-4">
			<span className="text-lg font-bold">{props.name}</span>
			{props.children}
		</div>
	);
};
