import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import { App } from "./components/App";
import { Discover } from "./components/pages/Discover";
import { Watch } from "./components/pages/Watch";

const element = document.getElementById("root");
if (!element) throw new Error("Expected root element");

createRoot(element).render(
	<React.StrictMode>
		<MemoryRouter>
			<Routes>
				<Route element={<App />} path="/">
					<Route element={<Discover />} path="discover" />
					<Route path="watch">
						<Route element={<Watch />} path=":slug" />
					</Route>
				</Route>
			</Routes>
		</MemoryRouter>
	</React.StrictMode>
);
