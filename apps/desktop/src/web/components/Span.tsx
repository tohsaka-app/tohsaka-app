import { twMerge } from "tailwind-merge";

export const Span: React.FC<
	Omit<JSX.IntrinsicElements["span"], "placeholder"> & {
		placeholder?: { length: number; loading: boolean; className?: string };
	}
> = ({ children, placeholder, className, ...props }) => {
	const loading = !!placeholder?.loading;

	return (
		<span
			{...props}
			className={twMerge(
				className,
				loading && "text-transparent w-fit break-all bg-neutral-200 animate-pulse",
				loading && placeholder.className
			)}
		>
			{loading ? "a".repeat(placeholder?.length || 0) : children}
		</span>
	);
};
