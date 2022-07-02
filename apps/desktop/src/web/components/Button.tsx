import { PropsWithChildren } from "react";

export type ButtonProps = PropsWithChildren<{ secondary?: boolean }>;

export const Button: React.FC<ButtonProps> = ({ children, secondary }) => {
	return (
		<button
			type="button"
			className={`py-2 px-3 rounded flex gap-2 items-center group ${
				secondary
					? "text-white bg-neutral-600/80 text-sm hover:bg-neutral-600"
					: "text-black bg-neutral-200 hover:bg-white"
			}`}
		>
			{children}
		</button>
	);
};
