import NextLink from "next/link";
import { twMerge } from "tailwind-merge";

export type LinkProps = Omit<JSX.IntrinsicElements["a"], "href"> & { href: string };

export const Link: React.FC<LinkProps> = ({ href, ...props }) => {
	return (
		<NextLink href={href}>
			<a {...props} className={twMerge("hover:brightness-150 hover:underline", props.className)} />
		</NextLink>
	);
};
