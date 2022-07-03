import { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{ secondary?: boolean }>;

export const Button: React.FC<ButtonProps> = ({ children, secondary }) => {
	return (
		<button
			type="button"
			className={`group flex items-center gap-2 rounded py-2 px-3 ${
				secondary
					? "bg-neutral-600/80 text-sm text-white hover:bg-neutral-600"
					: "bg-neutral-200 text-black hover:bg-white"
			}`}
		>
			{children}
		</button>
	);
};
