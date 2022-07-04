import { join } from "path";

import { router } from "18h";

void router({
	routesFolder: join(__dirname, "routes"),
	port: 3000
});
