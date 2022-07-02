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
				<Route path="/" element={<App />}>
					<Route path="discover" element={<Discover />} />
					<Route path="watch">
						<Route path=":slug" element={<Watch />} />
					</Route>
				</Route>
			</Routes>
		</MemoryRouter>
	</React.StrictMode>
);
