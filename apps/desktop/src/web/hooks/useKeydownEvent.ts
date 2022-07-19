import { useEffect } from "react";

export function useKeydownEvent(callback: (ev: KeyboardEvent) => void) {
	useEffect(() => {
		document.addEventListener("keydown", callback);
		return () => document.removeEventListener("keydown", callback);
	}, [callback]);
}
