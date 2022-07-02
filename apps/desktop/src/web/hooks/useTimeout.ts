import { useEffect } from "react";

export function useTimeout(ms: number, callback: () => void) {
	useEffect(() => {
		const id = setTimeout(callback, ms);
		return () => clearTimeout(id);
	}, [ms, callback]);
}
