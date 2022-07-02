import { useEffect } from "react";

export function useInterval(ms: number, callback: () => void) {
	useEffect(() => {
		const id = setInterval(callback, ms);
		return () => clearInterval(id);
	}, [ms, callback]);
}
