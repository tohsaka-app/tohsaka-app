import { useEffect } from "react";

export function useKeydown(key: string, callback: (ev: KeyboardEvent) => void) {
	useEffect(() => {
		function onKeyDown(ev: KeyboardEvent) {
			if (ev.key !== key) return;
			callback(ev);
		}

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [key, callback]);
}
